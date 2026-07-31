<?php

declare(strict_types=1);

namespace App\Repositories\Notification;

use App\Models\NotificationTemplate;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationTemplateRepository extends BaseRepository implements NotificationTemplateRepositoryInterface
{
    protected function model(): NotificationTemplate
    {
        return new NotificationTemplate;
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('template_code', 'LIKE', "%{$search}%")
                    ->orWhere('template_name', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['notification_type'])) {
            $query->where('notification_type', $filters['notification_type']);
        }

        if (! empty($filters['channel'])) {
            $query->where('channel', $filters['channel']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['language'])) {
            $query->where('language', $filters['language']);
        }

        $perPage = min($perPage, 100);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(int $id): ?NotificationTemplate
    {
        return $this->model->find($id);
    }

    public function findByCode(string $code): ?NotificationTemplate
    {
        return $this->model->where('template_code', $code)->first();
    }

    public function create(array $data): NotificationTemplate
    {
        return $this->model->create($data);
    }

    public function update(NotificationTemplate $template, array $data): NotificationTemplate
    {
        $template->update($data);

        return $template->fresh();
    }
}
