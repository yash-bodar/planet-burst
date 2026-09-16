<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanetBurstLevel extends Model
{
    use HasFactory;

    protected $table = 'planet_burst_levels';

    protected $fillable = [
        'world_id',
        'level_number',
        'title',
        'difficulty',
        'rows',
        'columns',
        'move_limit',
        'target_score',
        'star_thresholds',
        'objectives',
        'available_tiles',
        'obstacles',
        'special_powers',
        'is_active',
    ];

    protected $casts = [
        'star_thresholds' => 'array',
        'objectives' => 'array',
        'available_tiles' => 'array',
        'obstacles' => 'array',
        'special_powers' => 'array',
        'is_active' => 'boolean',
        'rows' => 'integer',
        'columns' => 'integer',
        'move_limit' => 'integer',
        'target_score' => 'integer',
        'level_number' => 'integer',
    ];

    /**
     * Get parent world of this level.
     *
     * // YB - 16-09-2026 Belongs to planetary world region
     */
    public function world(): BelongsTo
    {
        return $this->belongsTo(PlanetBurstWorld::class, 'world_id');
    }

    /**
     * Get user progress records for this level.
     *
     * // YB - 16-09-2026 Level progress records
     */
    public function progress(): HasMany
    {
        return $this->hasMany(PlanetBurstLevelProgress::class, 'level_id');
    }

    /**
     * Get scores logged for this level.
     *
     * // YB - 16-09-2026 Level score records
     */
    public function scores(): HasMany
    {
        return $this->hasMany(PlanetBurstScore::class, 'level_id');
    }
}
