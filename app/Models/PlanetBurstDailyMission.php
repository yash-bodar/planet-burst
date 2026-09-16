<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanetBurstDailyMission extends Model
{
    use HasFactory;

    protected $table = 'planet_burst_daily_missions';

    protected $fillable = [
        'mission_date',
        'title',
        'target_score',
        'move_limit',
        'objectives',
    ];

    protected $casts = [
        'mission_date' => 'date',
        'target_score' => 'integer',
        'move_limit' => 'integer',
        'objectives' => 'array',
    ];

    /**
     * Get player scores for this daily challenge.
     *
     * // YB - 16-09-2026 Scores logged for daily challenge
     */
    public function dailyScores(): HasMany
    {
        return $this->hasMany(PlanetBurstDailyScore::class, 'daily_mission_id')->orderByDesc('score');
    }
}
