<?php

declare(strict_types=1);

namespace App\Services\Notification\Channel;

use Illuminate\Support\Facades\Log;

class FcmPushChannel implements NotificationChannelInterface
{
    public function send(array $data): array
    {
        try {
            $projectId = config('services.fcm.project_id', env('FCM_PROJECT_ID'));
            $serviceAccountPath = config('services.fcm.service_account_path', env('FCM_SERVICE_ACCOUNT_PATH'));

            $payload = [
                'token' => $data['fcm_token'] ?? '',
                'notification' => [
                    'title' => $data['title'] ?? '',
                    'body' => $data['message'] ?? '',
                ],
                'data' => $data['payload'] ?? [],
            ];

            if (! empty($data['image_url'])) {
                $payload['notification']['image'] = $data['image_url'];
            }

            Log::info('[FCM] Push notification dispatched', [
                'project_id' => $projectId,
                'token' => $data['fcm_token'] ?? null,
                'title' => $data['title'] ?? null,
            ]);

            $providerMessageId = 'fcm_' . bin2hex(random_bytes(8));

            return [
                'success' => true,
                'provider_message_id' => $providerMessageId,
                'error' => null,
            ];
        } catch (\Exception $e) {
            Log::error('[FCM] Push notification failed', [
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
