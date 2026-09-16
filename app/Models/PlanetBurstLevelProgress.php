<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanetBurstLevelProgress extends Model
{
    use HasFactory;

    protected $table = 'planet_burst_level_progress';

    protected $fillable = [
        'user_id',
        'level_id',
        'stars',
        'highest_score',
        'completed_at',
    ];

    protected $casts = [
        'stars' => 'integer',
        'highest_score' => 'integer',
        'completed_at' => 'datetime',
    ];

    /**
     * Get user owning this progress record.
     *
     * // YB - 16-09-2026 Belongs to player user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get level associated with this progress.
     *
     * // YB - 16-09-2026 Belongs to level
     */
    public function level(): BelongsTo
    {
        return $this->belongsTo(PlanetBurstLevel::class, 'level_id');
    }
}
