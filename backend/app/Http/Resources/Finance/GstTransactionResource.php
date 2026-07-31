<?php

declare(strict_types=1);

namespace App\Http\Resources\Finance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GstTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'transaction_date' => $this->transaction_date?->toDateString(),
            'gst_type' => $this->gst_type,
            'gst_rate' => (float) $this->gst_rate,
            'taxable_amount' => (float) $this->taxable_amount,
            'cgst_amount' => (float) $this->cgst_amount,
            'sgst_amount' => (float) $this->sgst_amount,
            'igst_amount' => (float) $this->igst_amount,
            'cess_amount' => (float) $this->cess_amount,
            'total_tax' => (float) $this->total_tax,
            'invoice_number' => $this->invoice_number,
            'invoice_date' => $this->invoice_date?->toDateString(),
            'supplier_gstin' => $this->supplier_gstin,
            'place_of_supply' => $this->place_of_supply,
            'is_reconciled' => $this->is_reconciled,
            'status' => $this->status,
        ];
    }
}
