<?php

declare(strict_types=1);

namespace App\Http\Resources\Payment;

use App\Support\BaseResource;

class PaymentRefundResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'refund_number' => $this->refund_number,
            'payment_transaction_id' => $this->payment_transaction_id,
            'payment_transaction_number' => $this->whenLoaded(
                'paymentTransaction',
                fn () => $this->paymentTransaction->transaction_number
            ),
            'customer_id' => $this->customer_id,
            'refund_amount' => $this->refund_amount,
            'refund_reason' => $this->refund_reason,
            'gateway_refund_id' => $this->gateway_refund_id,
            'status' => $this->status,
            'processed_by_name' => $this->whenLoaded('processedBy', fn () => $this->processedBy->name),
            'processed_at' => $this->processed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
