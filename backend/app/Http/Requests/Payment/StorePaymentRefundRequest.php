<?php

declare(strict_types=1);

namespace App\Http\Requests\Payment;

use App\Support\BaseRequest;

class StorePaymentRefundRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'payment_transaction_id' => ['required', 'exists:payment_transactions,id'],
            'refund_amount' => ['required', 'numeric', 'min:0.01'],
            'refund_reason' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'payment_transaction_id' => 'Payment Transaction',
            'refund_amount' => 'Refund Amount',
            'refund_reason' => 'Refund Reason',
        ];
    }
}
