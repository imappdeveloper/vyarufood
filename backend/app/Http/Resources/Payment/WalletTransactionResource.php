<?php

declare(strict_types=1);

namespace App\Http\Resources\Payment;

use App\Support\BaseResource;

class WalletTransactionResource extends BaseResource
{
    public function toArray($request): array
    {
        $typeLabels = [
            'wallet_recharge' => 'Wallet Recharge',
            'admin_adjustment' => 'Admin Adjustment',
            'order' => 'Order Payment',
            'subscription' => 'Subscription Payment',
            'refund' => 'Refund',
            'payment' => 'Payment',
        ];

        $performer = null;
        if ($this->created_by && $this->relationLoaded('createdBy') && $this->createdBy) {
            $performer = [
                'type' => 'admin',
                'name' => $this->createdBy->name,
            ];
        }

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'wallet_id' => $this->wallet_id,
            'transaction_number' => $this->transaction_number,
            'transaction_type' => $this->transaction_type,
            'transaction_type_label' => $this->transaction_type === 'credit' ? 'Credit' : 'Debit',
            'reference_type' => $this->reference_type,
            'reference_type_label' => $typeLabels[$this->reference_type] ?? ucfirst(str_replace('_', ' ', $this->reference_type ?? '')),
            'reference_id' => $this->reference_id,
            'opening_balance' => $this->opening_balance,
            'amount' => $this->amount,
            'closing_balance' => $this->closing_balance,
            'remarks' => $this->remarks,
            'performed_by' => $performer,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
