<?php

declare(strict_types=1);

namespace App\Repositories\SystemBackup;

use App\Models\SystemBackup;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface SystemBackupRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;

    public function getAll(): Collection;

    public function findById(int $id): ?SystemBackup;

    public function findByUuid(string $uuid): ?SystemBackup;

    public function create(array $data): SystemBackup;

    public function update(SystemBackup $backup, array $data): SystemBackup;

    public function delete(SystemBackup $backup): bool;

    public function getCompletedByType(string $type): Collection;

    public function getLatestCompleted(?string $type = null): ?SystemBackup;

    public function getStatusCount(): array;

    public function getTypeCount(): array;

    public function getTotalSize(): int;

    public function getOlderThan(int $days): Collection;

    public function search(string $query): Collection;
}
