<?php

declare(strict_types=1);

namespace App\DTOs\Notification;

final class CreateNotificationDTO
{
    public function __construct(
        public readonly string $recipientType,
        public readonly int $recipientId,
        public readonly ?int $templateId = null,
        public readonly ?string $eventName = null,
        public readonly string $channel = 'push',
        public readonly string $title = '',
        public readonly string $message = '',
        public readonly ?array $payload = null,
        public readonly string $priority = 'normal',
        public readonly ?string $scheduledAt = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            recipientType: $data['recipient_type'] ?? 'Customer',
            recipientId: (int) ($data['recipient_id'] ?? 0),
            templateId: isset($data['template_id']) ? (int) $data['template_id'] : null,
            eventName: $data['event_name'] ?? null,
            channel: $data['channel'] ?? 'push',
            title: $data['title'] ?? '',
            message: $data['message'] ?? '',
            payload: $data['payload'] ?? null,
            priority: $data['priority'] ?? 'normal',
            scheduledAt: $data['scheduled_at'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'recipient_type' => $this->recipientType,
            'recipient_id' => $this->recipientId,
            'template_id' => $this->templateId,
            'event_name' => $this->eventName,
            'channel' => $this->channel,
            'title' => $this->title,
            'message' => $this->message,
            'payload' => $this->payload,
            'priority' => $this->priority,
            'scheduled_at' => $this->scheduledAt,
        ];
    }
}
