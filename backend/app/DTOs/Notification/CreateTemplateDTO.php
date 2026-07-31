<?php

declare(strict_types=1);

namespace App\DTOs\Notification;

final class CreateTemplateDTO
{
    public function __construct(
        public readonly string $templateCode,
        public readonly string $templateName,
        public readonly string $notificationType,
        public readonly string $channel,
        public readonly ?string $subject = null,
        public readonly string $title = '',
        public readonly string $message = '',
        public readonly ?array $variables = null,
        public readonly string $language = 'en',
        public readonly string $status = 'active',
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            templateCode: $data['template_code'] ?? '',
            templateName: $data['template_name'] ?? '',
            notificationType: $data['notification_type'] ?? 'transactional',
            channel: $data['channel'] ?? 'push',
            subject: $data['subject'] ?? null,
            title: $data['title'] ?? '',
            message: $data['message'] ?? '',
            variables: $data['variables'] ?? null,
            language: $data['language'] ?? 'en',
            status: $data['status'] ?? 'active',
        );
    }

    public function toArray(): array
    {
        return [
            'template_code' => $this->templateCode,
            'template_name' => $this->templateName,
            'notification_type' => $this->notificationType,
            'channel' => $this->channel,
            'subject' => $this->subject,
            'title' => $this->title,
            'message' => $this->message,
            'variables' => $this->variables,
            'language' => $this->language,
            'status' => $this->status,
        ];
    }
}
