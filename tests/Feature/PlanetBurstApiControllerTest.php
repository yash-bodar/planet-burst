<?php

namespace Tests\Feature;

use App\Models\PlanetBurstGameSession;
use App\Models\PlanetBurstLevel;
use App\Models\PlanetBurstWorld;
use App\Models\User;
use Database\Seeders\PlanetBurstSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanetBurstApiControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Set up test fixtures and seed celestial worlds.
     *
     * // YB - 16-09-2026 Seed database with Planet Burst worlds and missions
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PlanetBurstSeeder::class);
    }

    /**
     * Test Planet Burst main web page renders successfully.
     *
     * // YB - 16-09-2026 Test main web route response
     */
    public function test_planet_burst_home_renders_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    /**
     * Test Guess-X route remains accessible at /guess-x.
     *
     * // YB - 16-09-2026 Verify Guess-X word game regression safety
     */
    public function test_guess_x_route_remains_intact(): void
    {
        $response = $this->get('/guess-x');
        $response->assertStatus(200);
    }

    /**
     * Test API returns 6 celestial worlds and missions.
     *
     * // YB - 16-09-2026 Verify worlds endpoint returns seeded collection
     */
    public function test_api_returns_worlds_collection(): void
    {
        $response = $this->getJson('/api/planet-burst/worlds');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'worlds' => [
                    '*' => ['id', 'name', 'icon', 'is_unlocked', 'levels'],
                ],
            ]);

        $this->assertCount(6, $response->json('worlds'));
    }

    /**
     * Test creating a game session creates a valid token in the database.
     *
     * // YB - 16-09-2026 Test starting game session API
     */
    public function test_start_game_session(): void
    {
        $level = PlanetBurstLevel::first();

        $response = $this->postJson('/api/planet-burst/game-session', [
            'level_id' => $level->id,
            'is_daily' => false,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'session' => ['session_token', 'level_id', 'status'],
                'session_token',
            ]);

        $token = $response->json('session_token');
        $this->assertDatabaseHas('planet_burst_game_sessions', [
            'session_token' => $token,
            'level_id' => $level->id,
            'status' => 'active',
        ]);
    }

    /**
     * Test score submission with valid session and parameters.
     *
     * // YB - 16-09-2026 Test completing level with score submission
     */
    public function test_complete_level_success(): void
    {
        $user = User::factory()->create();
        $level = PlanetBurstLevel::first();

        $session = PlanetBurstGameSession::create([
            'session_token' => 'test_token_' . uniqid(),
            'user_id' => $user->id,
            'level_id' => $level->id,
            'status' => 'active',
            'started_at' => now(),
        ]);

        $response = $this->actingAs($user)->postJson("/api/planet-burst/levels/{$level->id}/complete", [
            'session_token' => $session->session_token,
            'score' => 6500,
            'stars' => 2,
            'moves_used' => 15,
            'completed' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'score' => 6500,
                'stars' => 2,
            ]);

        $this->assertDatabaseHas('planet_burst_game_sessions', [
            'session_token' => $session->session_token,
            'status' => 'completed',
            'final_score' => 6500,
        ]);

        $this->assertDatabaseHas('planet_burst_level_progress', [
            'user_id' => $user->id,
            'level_id' => $level->id,
            'stars' => 2,
            'highest_score' => 6500,
        ]);
    }

    /**
     * Test anti-cheat blocks submitting to an already finalized session.
     *
     * // YB - 16-09-2026 Verify anti-cheat blocks replay attacks on completed sessions
     */
    public function test_anti_cheat_blocks_duplicate_finalization(): void
    {
        $user = User::factory()->create();
        $level = PlanetBurstLevel::first();

        $session = PlanetBurstGameSession::create([
            'session_token' => 'test_token_' . uniqid(),
            'user_id' => $user->id,
            'level_id' => $level->id,
            'status' => 'completed', // Already completed
            'started_at' => now(),
        ]);

        $response = $this->actingAs($user)->postJson("/api/planet-burst/levels/{$level->id}/complete", [
            'session_token' => $session->session_token,
            'score' => 8000,
            'stars' => 3,
            'moves_used' => 12,
            'completed' => true,
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'This game session has already been finalized.',
            ]);
    }

    /**
     * Test anti-cheat blocks impossible move counts.
     *
     * // YB - 16-09-2026 Verify anti-cheat blocks moves exceeding limit
     */
    public function test_anti_cheat_blocks_excessive_moves(): void
    {
        $user = User::factory()->create();
        $level = PlanetBurstLevel::first(); // move_limit is 25

        $session = PlanetBurstGameSession::create([
            'session_token' => 'test_token_' . uniqid(),
            'user_id' => $user->id,
            'level_id' => $level->id,
            'status' => 'active',
            'started_at' => now(),
        ]);

        $response = $this->actingAs($user)->postJson("/api/planet-burst/levels/{$level->id}/complete", [
            'session_token' => $session->session_token,
            'score' => 5000,
            'stars' => 1,
            'moves_used' => 70, // Exceeds move_limit + 5
            'completed' => true,
        ]);

        $response->assertStatus(422);
    }

    /**
     * Test global leaderboard returns valid ranks.
     *
     * // YB - 16-09-2026 Test global leaderboard endpoint
     */
    public function test_leaderboard_returns_rankings(): void
    {
        $response = $this->getJson('/api/planet-burst/leaderboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'leaderboard',
            ]);
    }

    /**
     * Test daily mission endpoint returns mission of the day.
     *
     * // YB - 16-09-2026 Test daily mission retrieval
     */
    public function test_daily_mission_endpoint(): void
    {
        $response = $this->getJson('/api/planet-burst/daily-mission');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'daily_mission' => ['id', 'mission_date', 'title', 'target_score', 'move_limit'],
                'leaderboard',
            ]);
    }
}
