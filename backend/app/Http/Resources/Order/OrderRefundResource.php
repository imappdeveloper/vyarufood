<?php

declare(strict_types=1);

namespace App\Http\Resources\Order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderRefundResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'order_id' => $this->order_id,
            'refund_number' => $this->refund_number,
            'refund_amount' => $this->refund_amount,
            'refund_method' => $this->refund_method,
            'refund_status' => $this->refund_status,
            'refund_reason' => $this->refund_reason,
            'processed_by' => $this->processed_by,
            'processed_by_name' => $this->whenLoaded('processedBy', fn () => $this->processedBy->full_name),
            'processed_at' => $this->processed_at?->toISOString(),
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
