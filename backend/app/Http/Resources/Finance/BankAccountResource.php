<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BankAccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'account_name' => $this->account_name,
            'bank_name' => $this->bank_name,
            'account_number' => $this->account_number,
            'ifsc_code' => $this->ifsc_code,
            'branch' => $this->branch,
            'account_type' => $this->account_type,
            'chart_of_account_id' => $this->chart_of_account_id,
            'chart_of_account_name' => $this->whenLoaded('chartOfAccount', fn () => $this->chartOfAccount->account_name ?? null),
            'opening_balance' => (float) $this->opening_balance,
            'current_balance' => (float) $this->current_balance,
            'is_default' => $this->is_default,
            'status' => $this->status,
            'remarks' => $this->remarks,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->full_name ?? null),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
