<?php

declare(strict_types=1);

namespace App\Services\AppVersion;

use App\Models\AppVersion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AppVersionServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;

    public function getAll(): Collection;

    public function getLatestForPlatform(string $platform): ?AppVersion;

    public function getByUuid(string $uuid): ?AppVersion;

    public function create(array $data): AppVersion;

    public function update(AppVersion $version, array $data): AppVersion;

    public function delete(AppVersion $version): bool;

    public function setStatus(AppVersion $version, string $status): AppVersion;

    public function checkOutdated(string $platform, string $currentVersion): ?AppVersion;

    public function getPlatformCount(): array;

    public function getStatusCount(): array;

    public function search(string $query): Collection;

    public function refreshCache(): void;
}
