<?php

namespace App\Http\Resources\PlanetBurst;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameSessionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * // YB - 16-09-2026 Transform game session model into API JSON resource
     */
    public function toArray(Request $request): array
    {
        return [
            'session_token' => $this->session_token,
            'level_id' => $this->level_id,
            'is_daily' => $this->is_daily,
            'status' => $this->status,
            'started_at' => $this->started_at?->toIso8601String(),
        ];
    }
}
