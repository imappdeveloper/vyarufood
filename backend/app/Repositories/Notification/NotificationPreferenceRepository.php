<?php

declare(strict_types=1);

namespace App\Repositories\Notification;

use App\Models\NotificationPreference;
use App\Support\BaseRepository;

class NotificationPreferenceRepository extends BaseRepository implements NotificationPreferenceRepositoryInterface
{
    protected function model(): NotificationPreference
    {
        return new NotificationPreference;
    }

    public function findByCustomer(int $customerId): ?NotificationPreference
    {
        return $this->model->where('customer_id', $customerId)->first();
    }

    public function create(array $data): NotificationPreference
    {
        return $this->model->create($data);
    }

    public function update(NotificationPreference $preference, array $data): NotificationPreference
    {
        $preference->update($data);

        return $preference->fresh();
    }
}
