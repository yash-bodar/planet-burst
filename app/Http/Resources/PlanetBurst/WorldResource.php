<?php

namespace App\Http\Resources\PlanetBurst;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorldResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * // YB - 16-09-2026 Transform world model into API JSON resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order' => $this->order,
            'name' => $this->name,
            'icon' => $this->icon,
            'description' => $this->description,
            'background_theme' => $this->background_theme,
            'levels' => LevelResource::collection($this->whenLoaded('levels')),
        ];
    }
}
