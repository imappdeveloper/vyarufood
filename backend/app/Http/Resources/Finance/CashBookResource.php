<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CashBookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'transaction_date' => $this->transaction_date?->toDateString(),
            'description' => $this->description,
            'receipt_number' => $this->receipt_number,
            'payment_number' => $this->payment_number,
            'debit_amount' => (float) $this->debit_amount,
            'credit_amount' => (float) $this->credit_amount,
            'balance' => (float) $this->balance,
            'payment_method' => $this->payment_method,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
        ];
    }
}
