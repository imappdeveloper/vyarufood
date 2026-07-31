<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerSubscription;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerSubscriptionUpgradeHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_subscription_id' => $this->customer_subscription_id,
            'old_plan_id' => $this->old_plan_id,
            'new_plan_id' => $this->new_plan_id,
            'price_difference' => $this->price_difference,
            'reason' => $this->reason,
            'remarks' => $this->remarks,
            'status' => $this->status,
            'approved_by' => $this->approved_by,
            'approved_at' => $this->approved_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
