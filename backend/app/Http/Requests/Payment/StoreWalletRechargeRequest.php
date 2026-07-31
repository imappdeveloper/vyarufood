<?php

declare(strict_types=1);

namespace App\Http\Requests\Payment;

use App\Support\BaseRequest;

class StoreWalletRechargeRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'exists:customers,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'in:upi,card,netbanking,cash'],
        ];
    }

    public function attributes(): array
    {
        return [
            'customer_id' => 'Customer',
            'amount' => 'Amount',
            'payment_method' => 'Payment Method',
        ];
    }
}
