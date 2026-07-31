<?php

declare(strict_types=1);

namespace App\Http\Resources\CustomerSubscription;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerSubscriptionPauseHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_subscription_id' => $this->customer_subscription_id,
            'pause_start' => $this->pause_start?->toISOString(),
            'pause_end' => $this->pause_end?->toISOString(),
            'pause_days' => $this->pause_days,
            'reason' => $this->reason,
            'remarks' => $this->remarks,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
