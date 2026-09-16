<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanetBurstGameSession extends Model
{
    use HasFactory;

    protected $table = 'planet_burst_game_sessions';

    protected $fillable = [
        'session_token',
        'user_id',
        'level_id',
        'is_daily',
        'status',
        'seed',
        'moves_used',
        'final_score',
        'checksum',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'is_daily' => 'boolean',
        'seed' => 'integer',
        'moves_used' => 'integer',
        'final_score' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get user associated with this game session.
     *
     * // YB - 16-09-2026 Belongs to user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get level played in this game session.
     *
     * // YB - 16-09-2026 Belongs to level
     */
    public function level(): BelongsTo
    {
        return $this->belongsTo(PlanetBurstLevel::class, 'level_id');
    }
}
