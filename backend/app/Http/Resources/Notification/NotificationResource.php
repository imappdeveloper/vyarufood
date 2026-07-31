<?php

declare(strict_types=1);

namespace App\Http\Resources\Notification;

use App\Support\BaseResource;

class NotificationResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'notification_number' => $this->notification_number,
            'recipient_type' => $this->recipient_type,
            'recipient_id' => $this->recipient_id,
            'template_id' => $this->template_id,
            'event_name' => $this->event_name,
            'channel' => $this->channel,
            'title' => $this->title,
            'message' => $this->message,
            'payload' => $this->payload,
            'priority' => $this->priority,
            'scheduled_at' => $this->scheduled_at?->toISOString(),
            'sent_at' => $this->sent_at?->toISOString(),
            'delivery_status' => $this->delivery_status,
            'read_at' => $this->read_at?->toISOString(),
            'failure_reason' => $this->failure_reason,
            'template' => new NotificationTemplateResource($this->whenLoaded('template')),
            'logs' => NotificationLogResource::collection($this->whenLoaded('logs')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
