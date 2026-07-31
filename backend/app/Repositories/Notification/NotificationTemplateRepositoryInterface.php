<?php

declare(strict_types=1);

namespace App\Repositories\Notification;

use App\Models\NotificationTemplate;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationTemplateRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?NotificationTemplate;

    public function findByCode(string $code): ?NotificationTemplate;

    public function create(array $data): NotificationTemplate;

    public function update(NotificationTemplate $template, array $data): NotificationTemplate;
}
