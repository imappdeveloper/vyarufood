<?php

declare(strict_types=1);

namespace App\Http\Resources\Payment;

use App\Support\BaseResource;

class PaymentWebhookLogResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'gateway_name' => $this->gateway_name,
            'event_name' => $this->event_name,
            'signature' => $this->signature,
            'verification_status' => $this->verification_status,
            'processed_at' => $this->processed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
