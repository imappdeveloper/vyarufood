<?php

declare(strict_types=1);

namespace App\Services\Notification\Channel;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailChannel implements NotificationChannelInterface
{
    public function send(array $data): array
    {
        try {
            $to = $data['email'] ?? $data['recipient'] ?? '';
            $subject = $data['subject'] ?? $data['title'] ?? '';
            $body = $data['message'] ?? '';
            $from = $data['from'] ?? config('mail.from.address', 'noreply@vyarufood.com');

            Log::info('[Email] Sending email notification', [
                'to' => $to,
                'subject' => $subject,
                'from' => $from,
            ]);

            if (! empty($to) && ! empty($subject)) {
                $mailable = new \App\Notifications\Channels\NotificationMail(
                    $subject,
                    $body,
                    $data['html_body'] ?? null,
                    $data['attachments'] ?? []
                );

                Mail::to($to)->send($mailable);
            }

            $providerMessageId = 'email_' . bin2hex(random_bytes(8));

            return [
                'success' => true,
                'provider_message_id' => $providerMessageId,
                'error' => null,
            ];
        } catch (\Exception $e) {
            Log::error('[Email] Email notification failed', [
                'error' => $e->getMessage(),
                'to' => $data['email'] ?? $data['recipient'] ?? null,
            ]);

            return [
                'success' => false,
                'provider_message_id' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
