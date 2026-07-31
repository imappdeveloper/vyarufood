<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierLedgerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'supplier_id' => $this->supplier_id,
            'supplier_name' => $this->whenLoaded('supplier', fn () => $this->supplier->supplier_name ?? null),
            'transaction_date' => $this->transaction_date?->toDateString(),
            'description' => $this->description,
            'debit_amount' => (float) $this->debit_amount,
            'credit_amount' => (float) $this->credit_amount,
            'balance' => (float) $this->balance,
            'payment_method' => $this->payment_method,
            'transaction_reference' => $this->transaction_reference,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
        ];
    }
}
