<?php

declare(strict_types=1);

namespace App\Http\Resources\Notification;

use App\Support\BaseResource;

class NotificationTemplateResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'template_code' => $this->template_code,
            'template_name' => $this->template_name,
            'notification_type' => $this->notification_type,
            'channel' => $this->channel,
            'subject' => $this->subject,
            'title' => $this->title,
            'message' => $this->message,
            'variables' => $this->variables,
            'language' => $this->language,
            'status' => $this->status,
            'created_by' => $this->created_by,
            'created_by_name' => $this->whenLoaded('createdBy', fn () => $this->createdBy->name),
            'updated_by' => $this->updated_by,
            'updated_by_name' => $this->whenLoaded('updatedBy', fn () => $this->updatedBy->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
