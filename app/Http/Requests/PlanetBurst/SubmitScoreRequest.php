<?php

namespace App\Http\Requests\PlanetBurst;

use Illuminate\Foundation\Http\FormRequest;

class SubmitScoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * // YB - 16-09-2026 Authorization check for score submission
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * // YB - 16-09-2026 Validation rules for mission completion and score submission
     */
    public function rules(): array
    {
        return [
            'session_token' => ['required', 'string', 'max:64', 'exists:planet_burst_game_sessions,session_token'],
            'score' => ['required', 'integer', 'min:0', 'max:5000000'],
            'stars' => ['required', 'integer', 'min:0', 'max:3'],
            'moves_used' => ['required', 'integer', 'min:0', 'max:100'],
            'completed' => ['required', 'boolean'],
        ];
    }
}
