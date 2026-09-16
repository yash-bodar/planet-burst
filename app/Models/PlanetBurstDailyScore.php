<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanetBurstDailyScore extends Model
{
    use HasFactory;

    protected $table = 'planet_burst_daily_scores';

    protected $fillable = [
        'daily_mission_id',
        'user_id',
        'score',
        'moves_used',
        'submitted_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'moves_used' => 'integer',
        'submitted_at' => 'datetime',
    ];

    /**
     * Get daily mission associated with this score.
     *
     * // YB - 16-09-2026 Belongs to daily mission
     */
    public function dailyMission(): BelongsTo
    {
        return $this->belongsTo(PlanetBurstDailyMission::class, 'daily_mission_id');
    }

    /**
     * Get user associated with this daily score.
     *
     * // YB - 16-09-2026 Belongs to player user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
