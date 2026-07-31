<?php

declare(strict_types=1);

namespace App\Repositories\Notification;

use App\Models\NotificationLog;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationLogRepository extends BaseRepository implements NotificationLogRepositoryInterface
{
    protected function model(): NotificationLog
    {
        return new NotificationLog;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (! empty($filters['notification_id'])) {
            $query->where('notification_id', (int) $filters['notification_id']);
        }

        if (! empty($filters['provider'])) {
            $query->where('provider', $filters['provider']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function create(array $data): NotificationLog
    {
        return $this->model->create($data);
    }
}
