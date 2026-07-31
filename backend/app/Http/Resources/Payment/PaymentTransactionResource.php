<?php

declare(strict_types=1);

namespace App\Http\Resources\Payment;

use App\Support\BaseResource;

class PaymentTransactionResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'transaction_number' => $this->transaction_number,
            'gateway_name' => $this->gateway_name,
            'gateway_transaction_id' => $this->gateway_transaction_id,
            'gateway_order_id' => $this->gateway_order_id,
            'customer_id' => $this->customer_id,
            'order_id' => $this->order_id,
            'subscription_id' => $this->subscription_id,
            'payment_type' => $this->payment_type,
            'payment_method' => $this->payment_method,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'gateway_fee' => $this->gateway_fee,
            'tax_amount' => $this->tax_amount,
            'status' => $this->status,
            'payment_date' => $this->payment_date?->toISOString(),
            'failure_reason' => $this->failure_reason,
            'webhook_verified' => $this->webhook_verified,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
