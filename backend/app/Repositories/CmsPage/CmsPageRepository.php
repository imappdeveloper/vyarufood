<?php

declare(strict_types=1);

namespace App\Repositories\CmsPage;

use App\Models\CmsPage;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CmsPageRepository extends BaseRepository implements CmsPageRepositoryInterface
{
    protected function model(): CmsPage
    {
        return new CmsPage;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->newQuery()->with(['creator', 'updater']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['page_code'])) {
            $query->where('page_code', $filters['page_code']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('page_code', 'like', "%{$filters['search']}%")
                    ->orWhere('page_title', 'like', "%{$filters['search']}%")
                    ->orWhere('slug', 'like', "%{$filters['search']}%");
            });
        }

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->newQuery()->with('creator')->orderBy('page_title')->get();
    }

    public function getPublished(): Collection
    {
        return $this->newQuery()
            ->where('status', 'published')
            ->orderBy('page_title')
            ->get();
    }

    public function findById(int $id): ?CmsPage
    {
        return $this->newQuery()->with(['creator', 'updater'])->find($id);
    }

    public function findByUuid(string $uuid): ?CmsPage
    {
        return $this->newQuery()->with(['creator', 'updater'])->where('uuid', $uuid)->first();
    }

    public function findBySlug(string $slug): ?CmsPage
    {
        return $this->newQuery()->where('slug', $slug)->first();
    }

    public function findByCode(string $code): ?CmsPage
    {
        return $this->newQuery()->where('page_code', $code)->first();
    }

    public function create(array $data): CmsPage
    {
        $data['uuid'] = Str::uuid();

        if (!empty($data['status']) && $data['status'] === 'published') {
            $data['published_at'] = now();
        }

        return $this->newQuery()->create($data);
    }

    public function update(CmsPage $page, array $data): CmsPage
    {
        if (isset($data['status']) && $data['status'] === 'published' && $page->status !== 'published') {
            $data['published_at'] = now();
        }

        $page->update($data);

        return $page->fresh(['creator', 'updater']);
    }

    public function delete(CmsPage $page): bool
    {
        return $page->delete();
    }

    public function publish(CmsPage $page): CmsPage
    {
        $page->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return $page->fresh();
    }

    public function archive(CmsPage $page): CmsPage
    {
        $page->update(['status' => 'archived']);

        return $page->fresh();
    }

    public function search(string $query): Collection
    {
        return $this->newQuery()
            ->where('page_code', 'like', "%{$query}%")
            ->orWhere('page_title', 'like', "%{$query}%")
            ->orWhere('slug', 'like', "%{$query}%")
            ->orderBy('page_title')
            ->get();
    }

    public function getStatusCount(): array
    {
        return $this->newQuery()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function existsBySlug(string $slug, ?int $excludeId = null): bool
    {
        $query = $this->newQuery()->where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function existsByCode(string $code, ?int $excludeId = null): bool
    {
        $query = $this->newQuery()->where('page_code', $code);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
