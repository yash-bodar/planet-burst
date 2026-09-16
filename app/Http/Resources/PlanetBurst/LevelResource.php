<?php

namespace App\Http\Resources\PlanetBurst;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LevelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * // YB - 16-09-2026 Transform level model into API JSON resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'world_id' => $this->world_id,
            'level_number' => $this->level_number,
            'title' => $this->title,
            'difficulty' => $this->difficulty,
            'rows' => $this->rows,
            'columns' => $this->columns,
            'move_limit' => $this->move_limit,
            'target_score' => $this->target_score,
            'star_thresholds' => $this->star_thresholds,
            'objectives' => $this->objectives,
            'available_tiles' => $this->available_tiles,
            'obstacles' => $this->obstacles,
            'special_powers' => $this->special_powers,
            'is_active' => $this->is_active,
        ];
    }
}
