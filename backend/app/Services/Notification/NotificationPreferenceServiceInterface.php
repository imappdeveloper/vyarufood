<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\NotificationPreference;

interface NotificationPreferenceServiceInterface
{
    public function getPreferences(int $customerId): NotificationPreference;

    public function updatePreferences(int $customerId, array $data): NotificationPreference;

    public function createDefaultPreferences(int $customerId): NotificationPreference;
}
