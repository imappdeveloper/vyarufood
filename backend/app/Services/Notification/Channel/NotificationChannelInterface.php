<?php

declare(strict_types=1);

namespace App\Services\Notification\Channel;

interface NotificationChannelInterface
{
    public function send(array $data): array;
}
