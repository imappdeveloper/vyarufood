<?php

declare(strict_types=1);

namespace App\Http\Resources\Payment;

use App\Support\BaseResource;

class WalletResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'customer_id' => $this->customer_id,
            'wallet_number' => $this->wallet_number,
            'current_balance' => $this->current_balance,
            'blocked_balance' => $this->blocked_balance,
            'total_credit' => $this->total_credit,
            'total_debit' => $this->total_debit,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
