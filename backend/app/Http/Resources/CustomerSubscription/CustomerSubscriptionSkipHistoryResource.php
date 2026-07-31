<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerSubscription;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerSubscriptionSkipHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_subscription_id' => $this->customer_subscription_id,
            'skip_type' => $this->skip_type,
            'skip_date' => $this->skip_date?->toISOString(),
            'meal_id' => $this->meal_id,
            'reason' => $this->reason,
            'remarks' => $this->remarks,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
