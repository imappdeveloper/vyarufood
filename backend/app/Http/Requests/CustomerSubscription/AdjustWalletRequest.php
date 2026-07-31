<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerSubscription;

use Illuminate\Foundation\Http\FormRequest;

class AdjustWalletRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subscription_id' => 'required|exists:customer_subscriptions,id',
            'amount' => 'required|numeric|min:-10000|max:10000',
            'reason' => 'nullable|string|max:500',
        ];
    }
}
