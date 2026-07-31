<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerSubscription;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerSubscriptionRenewHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_subscription_id' => $this->customer_subscription_id,
            'old_plan_id' => $this->old_plan_id,
            'new_plan_id' => $this->new_plan_id,
            'old_end_date' => $this->old_end_date?->toISOString(),
            'new_end_date' => $this->new_end_date?->toISOString(),
            'reason' => $this->reason,
            'remarks' => $this->remarks,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
