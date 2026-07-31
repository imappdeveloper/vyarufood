<?php

declare(strict_types=1);

namespace App\Repositories\AppVersion;

use App\Models\AppVersion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AppVersionRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;

    public function getAll(): Collection;

    public function getLatestForPlatform(string $platform): ?AppVersion;

    public function findById(int $id): ?AppVersion;

    public function findByUuid(string $uuid): ?AppVersion;

    public function create(array $data): AppVersion;

    public function update(AppVersion $version, array $data): AppVersion;

    public function delete(AppVersion $version): bool;

    public function setStatus(AppVersion $version, string $status): AppVersion;

    public function checkOutdated(string $platform, string $currentVersion): ?AppVersion;

    public function getPlatformCount(): array;

    public function getStatusCount(): array;

    public function search(string $query): Collection;
}
