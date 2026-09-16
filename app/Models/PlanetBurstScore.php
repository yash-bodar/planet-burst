<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanetBurstScore extends Model
{
    use HasFactory;

    protected $table = 'planet_burst_scores';

    protected $fillable = [
        'user_id',
        'level_id',
        'game_session_id',
        'score',
        'stars',
        'moves_used',
        'submitted_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'stars' => 'integer',
        'moves_used' => 'integer',
        'submitted_at' => 'datetime',
    ];

    /**
     * Get user associated with this score.
     *
     * // YB - 16-09-2026 Belongs to user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get level for this score record.
     *
     * // YB - 16-09-2026 Belongs to level
     */
    public function level(): BelongsTo
    {
        return $this->belongsTo(PlanetBurstLevel::class, 'level_id');
    }

    /**
     * Get game session for this score.
     *
     * // YB - 16-09-2026 Belongs to game session
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(PlanetBurstGameSession::class, 'game_session_id');
    }
}
