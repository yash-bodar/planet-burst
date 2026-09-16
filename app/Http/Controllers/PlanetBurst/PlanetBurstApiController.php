<?php

namespace App\Http\Controllers\PlanetBurst;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlanetBurst\StartSessionRequest;
use App\Http\Requests\PlanetBurst\SubmitDailyScoreRequest;
use App\Http\Requests\PlanetBurst\SubmitScoreRequest;
use App\Http\Resources\PlanetBurst\GameSessionResource;
use App\Http\Resources\PlanetBurst\LevelResource;
use App\Http\Resources\PlanetBurst\WorldResource;
use App\Models\PlanetBurstGameSession;
use App\Models\PlanetBurstLevel;
use App\Models\PlanetBurstWorld;
use App\Services\PlanetBurst\DailyMissionService;
use App\Services\PlanetBurst\GameEngineService;
use App\Services\PlanetBurst\LeaderboardService;
use App\Services\PlanetBurst\MissionService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

class PlanetBurstApiController extends Controller
{
    /**
     * PlanetBurstApiController constructor with service injections.
     *
     * // YB - 16-09-2026 Constructor dependency injection for Planet Burst API services
     */
    public function __construct(
        protected MissionService $missionService,
        protected GameEngineService $gameEngineService,
        protected LeaderboardService $leaderboardService,
        protected DailyMissionService $dailyMissionService
    ) {}

    /**
     * Get all worlds with nested levels and player progress.
     *
     * // YB - 16-09-2026 Fetch worlds collection with player progression
     */
    public function worlds(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;
        $worlds = $this->missionService->getWorldsWithProgress($userId);

        return response()->json([
            'success' => true,
            'worlds' => $worlds,
        ]);
    }

    /**
     * Get a single world by ID.
     *
     * // YB - 16-09-2026 Fetch single world with its levels
     */
    public function showWorld(PlanetBurstWorld $world): JsonResponse
    {
        $world->load('levels');

        return response()->json([
            'success' => true,
            'world' => new WorldResource($world),
        ]);
    }

    /**
     * Get all active mission levels.
     *
     * // YB - 16-09-2026 List all active mission levels
     */
    public function levels(): JsonResponse
    {
        $levels = PlanetBurstLevel::where('is_active', true)->orderBy('level_number')->get();

        return response()->json([
            'success' => true,
            'levels' => LevelResource::collection($levels),
        ]);
    }

    /**
     * Get details for a single mission level.
     *
     * // YB - 16-09-2026 Fetch single mission level details
     */
    public function showLevel(PlanetBurstLevel $level): JsonResponse
    {
        return response()->json([
            'success' => true,
            'level' => new LevelResource($level),
        ]);
    }

    /**
     * Start a new game session.
     *
     * // YB - 16-09-2026 Create a new game session token
     */
    public function startSession(StartSessionRequest $request): JsonResponse
    {
        $session = $this->gameEngineService->createSession(
            $request->user()?->id,
            $request->validated('level_id'),
            (bool) $request->validated('is_daily', false)
        );

        return response()->json([
            'success' => true,
            'session' => new GameSessionResource($session),
            'session_token' => $session->session_token,
        ], 201);
    }

    /**
     * Submit completed level results with anti-cheat verification.
     *
     * // YB - 16-09-2026 Validate session and persist completed level score
     */
    public function completeLevel(SubmitScoreRequest $request, PlanetBurstLevel $level): JsonResponse
    {
        $session = PlanetBurstGameSession::where('session_token', $request->validated('session_token'))->firstOrFail();

        try {
            $this->gameEngineService->validateAndCompleteSession(
                $session,
                $request->validated('score'),
                $request->validated('stars'),
                $request->validated('moves_used'),
                (bool) $request->validated('completed')
            );
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }

        $userId = $request->user()?->id;

        // Save progress if authenticated and level completed
        if ($userId && $request->validated('completed')) {
            $this->missionService->saveLevelProgress(
                $userId,
                $level->id,
                $request->validated('score'),
                $request->validated('stars')
            );

            $this->leaderboardService->recordScore(
                $userId,
                $level->id,
                $session->id,
                $request->validated('score'),
                $request->validated('stars'),
                $request->validated('moves_used')
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Mission result verified and recorded.',
            'score' => $request->validated('score'),
            'stars' => $request->validated('stars'),
        ]);
    }

    /**
     * Get global high scores leaderboard.
     *
     * // YB - 16-09-2026 Fetch top global players leaderboard
     */
    public function leaderboard(): JsonResponse
    {
        $leaderboard = $this->leaderboardService->getGlobalLeaderboard(25);

        return response()->json([
            'success' => true,
            'leaderboard' => $leaderboard,
        ]);
    }

    /**
     * Get today's daily cosmic mission and ranking.
     *
     * // YB - 16-09-2026 Fetch today's daily mission and top scorers
     */
    public function dailyMission(Request $request): JsonResponse
    {
        $userId = $request->user()?->id;
        $mission = $this->dailyMissionService->getTodayMissionForUser($userId);
        $leaderboard = $this->dailyMissionService->getDailyLeaderboard(20);

        return response()->json([
            'success' => true,
            'daily_mission' => $mission,
            'leaderboard' => $leaderboard,
            'user_score' => $mission['user_score'],
        ]);
    }

    /**
     * Submit score for today's daily cosmic mission.
     *
     * // YB - 16-09-2026 Submit authenticated score for daily cosmic mission
     */
    public function submitDailyScore(SubmitDailyScoreRequest $request): JsonResponse
    {
        $userId = $request->user()->id;

        $record = $this->dailyMissionService->recordDailyScore(
            $userId,
            $request->validated('score'),
            $request->validated('moves_used')
        );

        return response()->json([
            'success' => true,
            'message' => 'Daily cosmic score recorded.',
            'record' => $record,
        ]);
    }
}
