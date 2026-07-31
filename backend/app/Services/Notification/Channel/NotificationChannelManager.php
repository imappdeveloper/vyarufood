<?php

declare(strict_types=1);

namespace App\Services\Notification\Channel;

use Illuminate\Support\Facades\Log;

class NotificationChannelManager
{
    private const CHANNEL_MAP = [
        'email' => EmailChannel::class,
        'sms' => SmsChannel::class,
        'push' => FcmPushChannel::class,
        'whatsapp' => WhatsAppChannel::class,
    ];

    public function send(string $channel, array $data): array
    {
        $channelInstance = $this->resolve($channel);

        return $channelInstance->send($data);
    }

    public function resolve(string $channel): NotificationChannelInterface
    {
        $class = self::CHANNEL_MAP[$channel] ?? null;

        if (! $class) {
            throw new \InvalidArgumentException("Unsupported notification channel: {$channel}");
        }

        if (! class_exists($class)) {
            throw new \RuntimeException("Notification channel class not found: {$class}");
        }

        $instance = new $class();

        if (! $instance instanceof NotificationChannelInterface) {
            throw new \RuntimeException("Channel class must implement NotificationChannelInterface: {$class}");
        }

        Log::info("[NotificationChannel] Resolved channel", [
            'channel' => $channel,
            'class' => $class,
        ]);

        return $instance;
    }

    public function supportedChannels(): array
    {
        return array_keys(self::CHANNEL_MAP);
    }

    public function isSupported(string $channel): bool
    {
        return isset(self::CHANNEL_MAP[$channel]);
    }
}
