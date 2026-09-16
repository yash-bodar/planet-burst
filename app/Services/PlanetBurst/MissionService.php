<?php

namespace App\Services\PlanetBurst;

use App\Models\PlanetBurstLevel;
use App\Models\PlanetBurstLevelProgress;
use App\Models\PlanetBurstWorld;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MissionService
{
    /**
     * Retrieve all celestial worlds with nested missions and player progress.
     *
     * // YB - 16-09-2026 Fetch worlds and levels with user progress mapping
     */
    public function getWorldsWithProgress(?int $userId = null): array
    {
        $worlds = PlanetBurstWorld::with(['levels' => function ($query) {
            $query->where('is_active', true)->orderBy('level_number');
        }])->orderBy('order')->get();

        $userProgress = [];
        if ($userId) {
            $userProgress = PlanetBurstLevelProgress::where('user_id', $userId)
                ->pluck('stars', 'level_id')
                ->toArray();
        }

        $highestCompletedLevel = 0;
        if (!empty($userProgress)) {
            $completedLevelIds = array_keys($userProgress);
            $highestCompletedLevel = PlanetBurstLevel::whereIn('id', $completedLevelIds)
                ->max('level_number') ?? 0;
        }

        $unlockedThreshold = max(1, $highestCompletedLevel + 1);

        return $worlds->map(function ($world) use ($userProgress, $unlockedThreshold) {
            $levels = $world->levels->map(function ($level) use ($userProgress, $unlockedThreshold) {
                $stars = $userProgress[$level->id] ?? 0;
                $isUnlocked = $level->level_number <= $unlockedThreshold;

                return [
                    'id' => $level->id,
                    'world_id' => $level->world_id,
                    'level_number' => $level->level_number,
                    'title' => $level->title,
                    'difficulty' => $level->difficulty,
                    'rows' => $level->rows,
                    'columns' => $level->columns,
                    'move_limit' => $level->move_limit,
                    'target_score' => $level->target_score,
                    'star_thresholds' => $level->star_thresholds,
                    'objectives' => $level->objectives,
                    'available_tiles' => $level->available_tiles,
                    'obstacles' => $level->obstacles,
                    'is_unlocked' => $isUnlocked,
                    'stars' => $stars,
                ];
            });

            $anyUnlocked = $levels->contains('is_unlocked', true);

            return [
                'id' => $world->id,
                'order' => $world->order,
                'name' => $world->name,
                'icon' => $world->icon,
                'description' => $world->description,
                'background_theme' => $world->background_theme,
                'is_unlocked' => $anyUnlocked || $world->order === 1,
                'levels' => $levels,
            ];
        })->toArray();
    }

    /**
     * Get a specific mission level by ID.
     *
     * // YB - 16-09-2026 Find single mission level by ID
     */
    public function getLevel(int $levelId): ?PlanetBurstLevel
    {
        return PlanetBurstLevel::with('world')->find($levelId);
    }

    /**
     * Save user level progress and update stars if new record achieved.
     *
     * // YB - 16-09-2026 Persist level stars and score progress inside DB transaction
     */
    public function saveLevelProgress(?int $userId, int $levelId, int $score, int $stars): ?PlanetBurstLevelProgress
    {
        if (!$userId) {
            return null;
        }

        return DB::transaction(function () use ($userId, $levelId, $score, $stars) {
            $progress = PlanetBurstLevelProgress::firstOrNew([
                'user_id' => $userId,
                'level_id' => $levelId,
            ]);

            $progress->stars = max($progress->stars ?? 0, $stars);
            $progress->highest_score = max($progress->highest_score ?? 0, $score);
            $progress->completed_at = Carbon::now();
            $progress->save();

            Log::info("PlanetBurst level progress saved [User: {$userId}, Level: {$levelId}, Stars: {$stars}, Score: {$score}]");

            return $progress;
        });
    }
}
