<?php

declare(strict_types=1);

namespace App\DTOs\Notification;

final class UpdatePreferencesDTO
{
    public function __construct(
        public readonly bool $pushEnabled = true,
        public readonly bool $emailEnabled = true,
        public readonly bool $smsEnabled = true,
        public readonly bool $marketingEnabled = false,
        public readonly bool $orderEnabled = true,
        public readonly bool $paymentEnabled = true,
        public readonly bool $subscriptionEnabled = true,
        public readonly bool $systemEnabled = true,
        public readonly string $language = 'en',
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            pushEnabled: (bool) ($data['push_enabled'] ?? true),
            emailEnabled: (bool) ($data['email_enabled'] ?? true),
            smsEnabled: (bool) ($data['sms_enabled'] ?? true),
            marketingEnabled: (bool) ($data['marketing_enabled'] ?? false),
            orderEnabled: (bool) ($data['order_enabled'] ?? true),
            paymentEnabled: (bool) ($data['payment_enabled'] ?? true),
            subscriptionEnabled: (bool) ($data['subscription_enabled'] ?? true),
            systemEnabled: (bool) ($data['system_enabled'] ?? true),
            language: $data['language'] ?? 'en',
        );
    }

    public function toArray(): array
    {
        return [
            'push_enabled' => $this->pushEnabled,
            'email_enabled' => $this->emailEnabled,
            'sms_enabled' => $this->smsEnabled,
            'marketing_enabled' => $this->marketingEnabled,
            'order_enabled' => $this->orderEnabled,
            'payment_enabled' => $this->paymentEnabled,
            'subscription_enabled' => $this->subscriptionEnabled,
            'system_enabled' => $this->systemEnabled,
            'language' => $this->language,
        ];
    }
}
