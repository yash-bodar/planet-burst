<?php

namespace App\Http\Requests\PlanetBurst;

use Illuminate\Foundation\Http\FormRequest;

class StartSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * // YB - 16-09-2026 Authorization check for session start
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * // YB - 16-09-2026 Validation rules for mission session start
     */
    public function rules(): array
    {
        return [
            'level_id' => ['nullable', 'integer', 'exists:planet_burst_levels,id'],
            'is_daily' => ['nullable', 'boolean'],
        ];
    }
}
