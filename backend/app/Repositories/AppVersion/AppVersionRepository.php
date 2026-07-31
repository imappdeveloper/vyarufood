<?php

declare(strict_types=1);

namespace App\Repositories\AppVersion;

use App\Models\AppVersion;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class AppVersionRepository extends BaseRepository implements AppVersionRepositoryInterface
{
    protected function model(): AppVersion
    {
        return new AppVersion;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->newQuery();

        if (!empty($filters['platform'])) {
            $query->where('platform', $filters['platform']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('version_name', 'like', "%{$filters['search']}%")
                    ->orWhere('platform', 'like', "%{$filters['search']}%")
                    ->orWhere('release_notes', 'like', "%{$filters['search']}%");
            });
        }

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->newQuery()->orderByDesc('version_code')->get();
    }

    public function getLatestForPlatform(string $platform): ?AppVersion
    {
        return $this->newQuery()
            ->where('platform', $platform)
            ->orderByDesc('version_code')
            ->first();
    }

    public function findById(int $id): ?AppVersion
    {
        return $this->newQuery()->find($id);
    }

    public function findByUuid(string $uuid): ?AppVersion
    {
        return $this->newQuery()->where('uuid', $uuid)->first();
    }

    public function create(array $data): AppVersion
    {
        $data['uuid'] = Str::uuid();

        return $this->newQuery()->create($data);
    }

    public function update(AppVersion $version, array $data): AppVersion
    {
        $version->update($data);

        return $version->fresh();
    }

    public function delete(AppVersion $version): bool
    {
        return $version->delete();
    }

    public function setStatus(AppVersion $version, string $status): AppVersion
    {
        $version->update(['status' => $status]);

        return $version->fresh();
    }

    public function checkOutdated(string $platform, string $currentVersion): ?AppVersion
    {
        $latest = $this->getLatestForPlatform($platform);

        if (!$latest) {
            return null;
        }

        if ($latest->minimum_supported_version && version_compare($currentVersion, $latest->minimum_supported_version, '<')) {
            return $latest;
        }

        return null;
    }

    public function getPlatformCount(): array
    {
        return $this->newQuery()
            ->selectRaw('platform, COUNT(*) as count')
            ->groupBy('platform')
            ->pluck('count', 'platform')
            ->toArray();
    }

    public function getStatusCount(): array
    {
        return $this->newQuery()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function search(string $query): Collection
    {
        return $this->newQuery()
            ->where('version_name', 'like', "%{$query}%")
            ->orWhere('platform', 'like', "%{$query}%")
            ->orWhere('release_notes', 'like', "%{$query}%")
            ->orderByDesc('version_code')
            ->get();
    }
}
