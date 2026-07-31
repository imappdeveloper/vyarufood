<?php

declare(strict_types=1);

namespace App\DTOs\Notification;

final class BroadcastMessageDTO
{
    public function __construct(
        public readonly string $title = '',
        public readonly string $message = '',
        public readonly string $channel = 'push',
        public readonly string $priority = 'normal',
        public readonly array $recipientIds = [],
        public readonly string $recipientType = 'Customer',
        public readonly string $language = 'en',
        public readonly ?string $eventName = null,
        public readonly ?string $scheduledAt = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            title: $data['title'] ?? '',
            message: $data['message'] ?? '',
            channel: $data['channel'] ?? 'push',
            priority: $data['priority'] ?? 'normal',
            recipientIds: $data['recipient_ids'] ?? [],
            recipientType: $data['recipient_type'] ?? 'Customer',
            language: $data['language'] ?? 'en',
            eventName: $data['event_name'] ?? null,
            scheduledAt: $data['scheduled_at'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'channel' => $this->channel,
            'priority' => $this->priority,
            'recipient_ids' => $this->recipientIds,
            'recipient_type' => $this->recipientType,
            'language' => $this->language,
            'event_name' => $this->eventName,
            'scheduled_at' => $this->scheduledAt,
        ];
    }
}
