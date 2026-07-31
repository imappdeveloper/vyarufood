<?php

declare(strict_types=1);

namespace App\Http\Resources\ProductionBatch;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionStatusHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'production_batch_id' => $this->production_batch_id,
            'from_status' => $this->from_status,
            'to_status' => $this->to_status,
            'reason' => $this->reason,
            'changed_by' => $this->changed_by,
            'changed_by_name' => $this->whenLoaded('changedBy', fn () => $this->changedBy->name),
            'metadata' => $this->metadata,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
