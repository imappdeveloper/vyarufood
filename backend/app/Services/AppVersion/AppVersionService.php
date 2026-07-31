<?php

declare(strict_types=1);

namespace App\Services\AppVersion;

use App\Models\AppVersion;
use App\Repositories\AppVersion\AppVersionRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AppVersionService extends BaseService implements AppVersionServiceInterface
{
    protected string $moduleName = 'app_version';

    public function __construct(
        protected AppVersionRepositoryInterface $versionRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->versionRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        return CacheManager::remember(
            CacheManager::cacheKey('app_version', 'all'),
            3600,
            fn () => $this->versionRepo->getAll(),
        );
    }

    public function getLatestForPlatform(string $platform): ?AppVersion
    {
        return CacheManager::remember(
            CacheManager::cacheKey('app_version', 'latest', $platform),
            3600,
            fn () => $this->versionRepo->getLatestForPlatform($platform),
        );
    }

    public function getByUuid(string $uuid): ?AppVersion
    {
        return $this->versionRepo->findByUuid($uuid);
    }

    public function create(array $data): AppVersion
    {
        return $this->transaction(function () use ($data) {
            $version = $this->versionRepo->create($data);

            $this->logActivity('version_created', $version, [
                'platform' => $version->platform,
                'version_name' => $version->version_name,
            ]);

            $this->refreshCache();

            return $version;
        });
    }

    public function update(AppVersion $version, array $data): AppVersion
    {
        return $this->transaction(function () use ($version, $data) {
            $version = $this->versionRepo->update($version, $data);

            $this->logActivity('version_updated', $version, [
                'platform' => $version->platform,
                'version_name' => $version->version_name,
            ]);

            $this->refreshCache();

            return $version;
        });
    }

    public function delete(AppVersion $version): bool
    {
        return $this->transaction(function () use ($version) {
            $result = $this->versionRepo->delete($version);

            $this->logActivity('version_deleted', null, [
                'platform' => $version->platform,
                'version_name' => $version->version_name,
            ]);

            $this->refreshCache();

            return $result;
        });
    }

    public function setStatus(AppVersion $version, string $status): AppVersion
    {
        return $this->transaction(function () use ($version, $status) {
            $oldStatus = $version->status;
            $version = $this->versionRepo->setStatus($version, $status);

            $this->logActivity('version_status_changed', $version, [
                'old_status' => $oldStatus,
                'new_status' => $status,
            ]);

            $this->refreshCache();

            return $version;
        });
    }

    public function checkOutdated(string $platform, string $currentVersion): ?AppVersion
    {
        return $this->versionRepo->checkOutdated($platform, $currentVersion);
    }

    public function getPlatformCount(): array
    {
        return $this->versionRepo->getPlatformCount();
    }

    public function getStatusCount(): array
    {
        return $this->versionRepo->getStatusCount();
    }

    public function search(string $query): Collection
    {
        return $this->versionRepo->search($query);
    }

    public function refreshCache(): void
    {
        CacheManager::flush('app_version');
    }
}
