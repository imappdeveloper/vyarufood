<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerSubscription;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerSubscriptionStatusHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_subscription_id' => $this->customer_subscription_id,
            'old_status' => $this->old_status,
            'new_status' => $this->new_status,
            'reason' => $this->reason,
            'changed_by' => $this->changed_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
