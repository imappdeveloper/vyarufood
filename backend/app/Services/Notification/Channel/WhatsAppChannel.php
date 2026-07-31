<?php

declare(strict_types=1);

namespace App\Services\Notification\Channel;

use Illuminate\Support\Facades\Log;

class WhatsAppChannel implements NotificationChannelInterface
{
    public function send(array $data): array
    {
        try {
            $phone = $data['phone'] ?? $data['recipient'] ?? '';
            $message = $data['message'] ?? '';
            $templateName = $data['template_name'] ?? null;
            $templateParams = $data['template_params'] ?? [];

            Log::info('[WhatsApp] Sending WhatsApp notification', [
                'to' => $phone,
                'template' => $templateName,
                'message_length' => strlen($message),
            ]);

            $providerMessageId = 'wa_' . bin2hex(random_bytes(8));

            Log::info('[WhatsApp] WhatsApp notification dispatched (stub)', [
                'to' => $phone,
                'provider_message_id' => $providerMessageId,
            ]);

            return [
                'success' => true,
                'provider_message_id' => $providerMessageId,
                'error' => null,
            ];
        } catch (\Exception $e) {
            Log::error('[WhatsApp] WhatsApp notification failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'provider_message_id' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
