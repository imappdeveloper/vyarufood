<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BankBookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'bank_account_id' => $this->bank_account_id,
            'bank_account_name' => $this->whenLoaded('bankAccount', fn () => $this->bankAccount->account_name ?? null),
            'transaction_date' => $this->transaction_date?->toDateString(),
            'description' => $this->description,
            'cheque_number' => $this->cheque_number,
            'transaction_reference' => $this->transaction_reference,
            'debit_amount' => (float) $this->debit_amount,
            'credit_amount' => (float) $this->credit_amount,
            'balance' => (float) $this->balance,
            'is_reconciled' => $this->is_reconciled,
            'reconciled_at' => $this->reconciled_at?->toISOString(),
        ];
    }
}
