<?php

declare(strict_types=1);

namespace App\Http\Resources\ProductionBatch;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionBatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'batch_number' => $this->batch_number,
            'production_date' => $this->production_date?->toDateString(),
            'kitchen_id' => $this->kitchen_id,
            'kitchen_name' => $this->whenLoaded('kitchen', fn () => $this->kitchen->name),
            'batch_name' => $this->batch_name,
            'batch_type' => $this->batch_type,
            'total_orders' => $this->total_orders,
            'total_meals' => $this->total_meals,
            'planned_start_time' => $this->planned_start_time,
            'planned_end_time' => $this->planned_end_time,
            'actual_start_time' => $this->actual_start_time?->toISOString(),
            'actual_end_time' => $this->actual_end_time?->toISOString(),
            'production_status' => $this->production_status,
            'production_status_label' => ucfirst(str_replace('_', ' ', $this->production_status ?? '')),
            'prepared_by' => $this->prepared_by,
            'prepared_by_name' => $this->whenLoaded('preparedBy', fn () => $this->preparedBy->name),
            'approved_by' => $this->approved_by,
            'approved_by_name' => $this->whenLoaded('approvedBy', fn () => $this->approvedBy->name),
            'remarks' => $this->remarks,
            'is_draft' => $this->is_draft,
            'is_completed' => $this->is_completed,
            'is_locked' => $this->is_locked,
            'created_by' => $this->created_by,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->name),
            'updated_by' => $this->updated_by,
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
            'items' => ProductionBatchItemResource::collection($this->whenLoaded('items')),
            'packing_lists' => MealPackingListResource::collection($this->whenLoaded('packingLists')),
            'status_history' => ProductionStatusHistoryResource::collection($this->whenLoaded('statusHistory')),
        ];
    }
}
