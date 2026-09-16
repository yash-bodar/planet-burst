<?php

namespace App\Http\Requests\PlanetBurst;

use Illuminate\Foundation\Http\FormRequest;

class SubmitDailyScoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * // YB - 16-09-2026 Authorization check for daily score submission
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * // YB - 16-09-2026 Validation rules for daily challenge score
     */
    public function rules(): array
    {
        return [
            'session_token' => ['nullable', 'string', 'max:64'],
            'score' => ['required', 'integer', 'min:0', 'max:5000000'],
            'moves_used' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }
}
