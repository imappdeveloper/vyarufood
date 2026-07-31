<?php

declare(strict_types=1);

namespace App\Repositories\Notification;

use App\Models\NotificationPreference;

interface NotificationPreferenceRepositoryInterface
{
    public function findByCustomer(int $customerId): ?NotificationPreference;

    public function create(array $data): NotificationPreference;

    public function update(NotificationPreference $preference, array $data): NotificationPreference;
}
