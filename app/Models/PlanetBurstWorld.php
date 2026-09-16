<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanetBurstWorld extends Model
{
    use HasFactory;

    protected $table = 'planet_burst_worlds';

    protected $fillable = [
        'order',
        'name',
        'icon',
        'description',
        'background_theme',
    ];

    /**
     * Get levels for this cosmic world.
     *
     * // YB - 16-09-2026 Relation to missions within this planetary region
     */
    public function levels(): HasMany
    {
        return $this->hasMany(PlanetBurstLevel::class, 'world_id')->orderBy('level_number');
    }
}
