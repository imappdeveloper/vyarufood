<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BankReconciliationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'bank_account_id' => $this->bank_account_id,
            'bank_account_name' => $this->whenLoaded('bankAccount', fn () => $this->bankAccount->account_name ?? null),
            'reconciliation_date' => $this->reconciliation_date?->toDateString(),
            'statement_date' => $this->statement_date?->toDateString(),
            'opening_balance' => (float) $this->opening_balance,
            'closing_balance' => (float) $this->closing_balance,
            'total_deposits' => (float) $this->total_deposits,
            'total_withdrawals' => (float) $this->total_withdrawals,
            'adjusted_balance' => (float) $this->adjusted_balance,
            'difference' => (float) $this->difference,
            'status' => $this->status,
            'reconciled_by_name' => $this->whenLoaded('reconciledBy', fn () => $this->reconciledBy->full_name ?? null),
            'reconciled_at' => $this->reconciled_at?->toISOString(),
            'remarks' => $this->remarks,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->full_name ?? null),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
