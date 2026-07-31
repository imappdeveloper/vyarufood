<?php

declare(strict_types=1);

namespace App\Http\Requests\Payment;

use App\Support\BaseRequest;

class ProcessWebhookRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'gateway_name' => ['required', 'in:razorpay,phonepe,cashfree,payu,stripe'],
            'event_name' => ['required', 'string'],
            'payload' => ['required', 'array'],
            'signature' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'gateway_name' => 'Gateway Name',
            'event_name' => 'Event Name',
            'payload' => 'Payload',
            'signature' => 'Signature',
        ];
    }
}
