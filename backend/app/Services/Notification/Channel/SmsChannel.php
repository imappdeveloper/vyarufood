<?php

declare(strict_types=1);

namespace App\Services\Notification\Channel;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsChannel implements NotificationChannelInterface
{
    public function send(array $data): array
    {
        try {
            $phone = $data['phone'] ?? $data['recipient'] ?? '';
            $message = $data['message'] ?? '';
            $provider = config('services.sms.provider', env('SMS_PROVIDER', 'twilio'));
            $apiKey = config('services.sms.api_key', env('SMS_API_KEY', ''));
            $apiSecret = config('services.sms.api_secret', env('SMS_API_SECRET', ''));
            $fromNumber = config('services.sms.from_number', env('SMS_FROM_NUMBER', ''));

            Log::info("[SMS] Sending SMS via {$provider}", [
                'to' => $phone,
                'from' => $fromNumber,
                'message_length' => strlen($message),
            ]);

            if ($provider === 'twilio') {
                $response = Http::withBasicAuth($apiKey, $apiSecret)
                    ->post("https://api.twilio.com/2010-04-01/Accounts/{$apiKey}/Messages.json", [
                        'To' => $phone,
                        'From' => $fromNumber,
                        'Body' => $message,
                    ]);

                if ($response->successful()) {
                    $providerMessageId = $response->json('sid', 'sms_' . bin2hex(random_bytes(8)));

                    return [
                        'success' => true,
                        'provider_message_id' => $providerMessageId,
                        'error' => null,
                    ];
                }

                return [
                    'success' => false,
                    'provider_message_id' => null,
                    'error' => $response->json('message', 'SMS delivery failed'),
                ];
            }

            $providerMessageId = 'sms_' . bin2hex(random_bytes(8));

            Log::info('[SMS] SMS notification dispatched (stub)', [
                'to' => $phone,
                'provider_message_id' => $providerMessageId,
            ]);

            return [
                'success' => true,
                'provider_message_id' => $providerMessageId,
                'error' => null,
            ];
        } catch (\Exception $e) {
            Log::error('[SMS] SMS notification failed', [
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
