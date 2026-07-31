<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerSubscription;

use Illuminate\Foundation\Http\FormRequest;

class PauseSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subscription_id' => 'required|exists:customer_subscriptions,id',
            'pause_start' => 'required|date|after_or_equal:today',
            'pause_end' => 'required|date|after:pause_start',
            'reason' => 'nullable|string|max:500',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
