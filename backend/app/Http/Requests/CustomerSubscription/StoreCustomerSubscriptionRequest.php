<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerSubscription;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'kitchen_id' => 'nullable|exists:kitchens,id',
            'start_date' => 'required|date|after_or_equal:today',
            'billing_cycle' => 'nullable|string|in:one_time,weekly,monthly,quarterly,yearly',
            'auto_renew' => 'nullable|boolean',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
