<?php

declare(strict_types=1);

namespace App\Repositories\Notification;

use App\Models\NotificationLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationLogRepositoryInterface
{
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): NotificationLog;
}
