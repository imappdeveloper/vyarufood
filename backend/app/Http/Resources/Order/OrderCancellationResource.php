<?php

declare(strict_types=1);

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderCancellationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'order_id' => $this->order_id,
            'cancelled_by' => $this->cancelled_by,
            'cancelled_by_name' => $this->whenLoaded('cancelledBy', fn () => $this->cancelledBy->full_name),
            'cancellation_reason' => $this->cancellation_reason,
            'cancellation_charge' => $this->cancellation_charge ?? '0.00',
            'refund_amount' => $this->refund_amount,
            'refund_status' => $this->refund_processed ? 'completed' : 'pending',
            'remarks' => $this->additional_notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
