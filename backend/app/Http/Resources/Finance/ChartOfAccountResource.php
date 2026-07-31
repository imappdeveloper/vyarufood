<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChartOfAccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'account_code' => $this->account_code,
            'account_name' => $this->account_name,
            'account_type' => $this->account_type,
            'parent_account_id' => $this->parent_account_id,
            'parent_account_name' => $this->whenLoaded('parentAccount', fn () => $this->parentAccount->account_name ?? null),
            'opening_balance' => (float) $this->opening_balance,
            'current_balance' => (float) $this->current_balance,
            'currency' => $this->currency,
            'is_system' => $this->is_system,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->full_name ?? null),
            'children_count' => $this->whenCounted('children'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
