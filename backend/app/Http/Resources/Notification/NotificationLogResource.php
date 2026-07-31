<?php

declare(strict_types=1);

namespace App\Http\Resources\Notification;

use App\Support\BaseResource;

class NotificationLogResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'notification_id' => $this->notification_id,
            'provider' => $this->provider,
            'provider_message_id' => $this->provider_message_id,
            'request_payload' => $this->request_payload,
            'response_payload' => $this->response_payload,
            'status' => $this->status,
            'sent_at' => $this->sent_at?->toISOString(),
        ];
    }
}
