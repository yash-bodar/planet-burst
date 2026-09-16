<?php

namespace App\Services\PlanetBurst;

use App\Models\PlanetBurstScore;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LeaderboardService
{
    /**
     * Get global top leaderboard scores.
     *
     * // YB - 16-09-2026 Fetch top global players with aggregated scores and stars
     */
    public function getGlobalLeaderboard(int $limit = 20): array
    {
        return PlanetBurstScore::with('user:id,name,avatar')
            ->select('user_id', DB::raw('SUM(score) as total_score'), DB::raw('SUM(stars) as total_stars'))
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('total_score')
            ->limit($limit)
            ->get()
            ->map(function ($entry) {
                return [
                    'user_id' => $entry->user_id,
                    'user_name' => $entry->user?->name ?? 'Cosmic Explorer',
                    'avatar' => $entry->user?->avatar,
                    'score' => (int) $entry->total_score,
                    'stars' => (int) $entry->total_stars,
                ];
            })
            ->toArray();
    }

    /**
     * Get level-specific high scores.
     *
     * // YB - 16-09-2026 Fetch leaderboard for a specific mission level
     */
    public function getMissionLeaderboard(int $levelId, int $limit = 20): array
    {
        return PlanetBurstScore::with('user:id,name,avatar')
            ->where('level_id', $levelId)
            ->whereNotNull('user_id')
            ->orderByDesc('score')
            ->limit($limit)
            ->get()
            ->map(function ($score) {
                return [
                    'id' => $score->id,
                    'user_id' => $score->user_id,
                    'user_name' => $score->user?->name ?? 'Cosmic Explorer',
                    'avatar' => $score->user?->avatar,
                    'score' => $score->score,
                    'stars' => $score->stars,
                    'submitted_at' => $score->submitted_at?->toIso8601String(),
                ];
            })
            ->toArray();
    }

    /**
     * Record a completed level score into the database.
     *
     * // YB - 16-09-2026 Persist level score record inside DB transaction
     */
    public function recordScore(
        ?int $userId,
        int $levelId,
        ?int $sessionId,
        int $score,
        int $stars,
        int $movesUsed
    ): PlanetBurstScore {
        return DB::transaction(function () use ($userId, $levelId, $sessionId, $score, $stars, $movesUsed) {
            $scoreRecord = PlanetBurstScore::create([
                'user_id' => $userId,
                'level_id' => $levelId,
                'game_session_id' => $sessionId,
                'score' => $score,
                'stars' => $stars,
                'moves_used' => $movesUsed,
                'submitted_at' => Carbon::now(),
            ]);

            Log::info("PlanetBurst score recorded [ID: {$scoreRecord->id}, Level: {$levelId}, Score: {$score}]");

            return $scoreRecord;
        });
    }
}
