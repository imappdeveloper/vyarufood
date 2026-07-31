<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

abstract class BaseNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(config('app.name') . ' Notification')
            ->greeting('Hello ' . $notifiable->name)
            ->line('Thank you for using our application!');
    }

    public function toArray($notifiable): array
    {
        return [
            'id' => $this->id,
            'created_at' => now()->toISOString(),
        ];
    }
}
