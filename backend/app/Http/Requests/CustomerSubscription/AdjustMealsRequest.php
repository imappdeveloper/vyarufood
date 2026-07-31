<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerSubscription;

use Illuminate\Foundation\Http\FormRequest;

class AdjustMealsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subscription_id' => 'required|exists:customer_subscriptions,id',
            'additional_meals' => 'required|integer|min:1|max:100',
            'reason' => 'nullable|string|max:500',
        ];
    }
}
