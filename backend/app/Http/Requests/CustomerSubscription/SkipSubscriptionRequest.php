<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerSubscription;

use Illuminate\Foundation\Http\FormRequest;

class SkipSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'skip_type' => 'required|string|in:day,meal',
            'skip_date' => 'required|date|after_or_equal:today',
            'meal_id' => 'required_if:skip_type,meal|nullable|exists:meals,id',
            'reason' => 'nullable|string|max:500',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
