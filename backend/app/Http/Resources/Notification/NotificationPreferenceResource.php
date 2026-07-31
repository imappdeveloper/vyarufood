<?php

declare(strict_types=1);

namespace App\Http\Resources\Notification;

use App\Support\BaseResource;

class NotificationPreferenceResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'customer_id' => $this->customer_id,
            'push_enabled' => $this->push_enabled,
            'email_enabled' => $this->email_enabled,
            'sms_enabled' => $this->sms_enabled,
            'marketing_enabled' => $this->marketing_enabled,
            'order_enabled' => $this->order_enabled,
            'payment_enabled' => $this->payment_enabled,
            'subscription_enabled' => $this->subscription_enabled,
            'system_enabled' => $this->system_enabled,
            'language' => $this->language,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
