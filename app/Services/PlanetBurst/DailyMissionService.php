<?php

namespace App\Services\PlanetBurst;

use App\Models\PlanetBurstDailyMission;
use App\Models\PlanetBurstDailyScore;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DailyMissionService
{
    /**
     * Get or create today's daily mission.
     *
     * // YB - 16-09-2026 Fetch or dynamically generate daily cosmic challenge for today
     */
    public function getTodayMission(): PlanetBurstDailyMission
    {
        $today = Carbon::today();

        $mission = PlanetBurstDailyMission::whereDate('mission_date', $today)->first();

        if (!$mission) {
            try {
                $mission = PlanetBurstDailyMission::create([
                    'mission_date' => $today->toDateString(),
                    'title' => 'Nebula Pulse ' . $today->format('M d'),
                    'target_score' => 12500,
                    'move_limit' => 22,
                    'objectives' => [
                        ['type' => 'score', 'target' => 12500],
                    ],
                ]);
            } catch (\Throwable $e) {
                $mission = PlanetBurstDailyMission::whereDate('mission_date', $today)->first();
            }
        }

        return $mission;
    }

    /**
     * Get today's mission formatted for frontend payload with user's current score.
     *
     * // YB - 16-09-2026 Format daily mission data and user best score for today
     */
    public function getTodayMissionForUser(?int $userId = null): array
    {
        $mission = $this->getTodayMission();
        $userScore = 0;

        if ($userId) {
            $userScore = PlanetBurstDailyScore::where('daily_mission_id', $mission->id)
                ->where('user_id', $userId)
                ->value('score') ?? 0;
        }

        return [
            'id' => $mission->id,
            'mission_date' => $mission->mission_date->toDateString(),
            'title' => $mission->title,
            'target_score' => $mission->target_score,
            'move_limit' => $mission->move_limit,
            'objectives' => $mission->objectives,
            'user_score' => $userScore,
        ];
    }

    /**
     * Record a user's daily challenge score.
     *
     * // YB - 16-09-2026 Upsert user score for today's daily mission
     */
    public function recordDailyScore(int $userId, int $score, int $movesUsed): PlanetBurstDailyScore
    {
        $mission = $this->getTodayMission();

        return DB::transaction(function () use ($mission, $userId, $score, $movesUsed) {
            $dailyScore = PlanetBurstDailyScore::firstOrNew([
                'daily_mission_id' => $mission->id,
                'user_id' => $userId,
            ]);

            // Save if new or higher score
            if (!$dailyScore->exists || $score > $dailyScore->score) {
                $dailyScore->score = $score;
                $dailyScore->moves_used = $movesUsed;
                $dailyScore->submitted_at = Carbon::now();
                $dailyScore->save();
            }

            Log::info("PlanetBurst daily score saved [User: {$userId}, Score: {$score}]");

            return $dailyScore;
        });
    }

    /**
     * Get daily leaderboard rankings for today's mission.
     *
     * // YB - 16-09-2026 Fetch top ranks for today's daily cosmic mission
     */
    public function getDailyLeaderboard(int $limit = 20): array
    {
        $mission = $this->getTodayMission();

        return PlanetBurstDailyScore::with('user:id,name,avatar')
            ->where('daily_mission_id', $mission->id)
            ->orderByDesc('score')
            ->limit($limit)
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'user_id' => $entry->user_id,
                    'user_name' => $entry->user?->name ?? 'Cosmic Explorer',
                    'avatar' => $entry->user?->avatar,
                    'score' => $entry->score,
                    'moves_used' => $entry->moves_used,
                    'submitted_at' => $entry->submitted_at?->toIso8601String(),
                ];
            })
            ->toArray();
    }
}
