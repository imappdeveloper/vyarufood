<?php

declare(strict_types=1);

namespace App\Services\SystemBackup;

use App\Models\SystemBackup;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface SystemBackupServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;

    public function getAll(): Collection;

    public function getByUuid(string $uuid): ?SystemBackup;

    public function createBackup(array $data): SystemBackup;

    public function runBackup(SystemBackup $backup): bool;

    public function delete(SystemBackup $backup): bool;

    public function getLatestCompleted(?string $type = null): ?SystemBackup;

    public function getStatusCount(): array;

    public function getTypeCount(): array;

    public function getTotalSize(): int;

    public function search(string $query): Collection;

    public function cleanupOldBackups(int $retentionDays): int;
}
