<?php

declare(strict_types=1);

namespace App\Services\CmsPage;

use App\Models\CmsPage;
use App\Repositories\CmsPage\CmsPageRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CmsPageService extends BaseService implements CmsPageServiceInterface
{
    protected string $moduleName = 'cms_page';

    public function __construct(
        protected CmsPageRepositoryInterface $cmsPageRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->cmsPageRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        return CacheManager::remember(
            CacheManager::cacheKey('cms_page', 'all'),
            3600,
            fn () => $this->cmsPageRepo->getAll(),
        );
    }

    public function getPublished(): Collection
    {
        return CacheManager::remember(
            CacheManager::cacheKey('cms_page', 'published'),
            3600,
            fn () => $this->cmsPageRepo->getPublished(),
        );
    }

    public function getByUuid(string $uuid): ?CmsPage
    {
        return $this->cmsPageRepo->findByUuid($uuid);
    }

    public function getBySlug(string $slug): ?CmsPage
    {
        return CacheManager::remember(
            CacheManager::cacheKey('cms_page', 'slug', $slug),
            3600,
            fn () => $this->cmsPageRepo->findBySlug($slug),
        );
    }

    public function getByCode(string $code): ?CmsPage
    {
        return $this->cmsPageRepo->findByCode($code);
    }

    public function create(array $data): CmsPage
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;
            $data['updated_by'] = $adminId;

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['page_title']);
            }

            $page = $this->cmsPageRepo->create($data);

            $this->logActivity('cms_page_created', $page, [
                'page_code' => $page->page_code,
                'page_title' => $page->page_title,
            ]);

            $this->refreshCache();

            return $page;
        });
    }

    public function update(CmsPage $page, array $data): CmsPage
    {
        return $this->transaction(function () use ($page, $data) {
            $adminId = auth()->guard('admin')->id();
            $data['updated_by'] = $adminId;

            if (isset($data['page_title']) && !isset($data['slug'])) {
                $data['slug'] = Str::slug($data['page_title']);
            }

            $page = $this->cmsPageRepo->update($page, $data);

            $this->logActivity('cms_page_updated', $page, [
                'page_code' => $page->page_code,
                'page_title' => $page->page_title,
            ]);

            $this->refreshCache();

            return $page;
        });
    }

    public function delete(CmsPage $page): bool
    {
        return $this->transaction(function () use ($page) {
            $pageTitle = $page->page_title;

            $result = $this->cmsPageRepo->delete($page);

            $this->logActivity('cms_page_deleted', null, [
                'page_title' => $pageTitle,
            ]);

            $this->refreshCache();

            return $result;
        });
    }

    public function publish(CmsPage $page): CmsPage
    {
        return $this->transaction(function () use ($page) {
            $page = $this->cmsPageRepo->publish($page);

            $this->logActivity('cms_page_published', $page, [
                'page_code' => $page->page_code,
                'page_title' => $page->page_title,
            ]);

            $this->refreshCache();

            return $page;
        });
    }

    public function archive(CmsPage $page): CmsPage
    {
        return $this->transaction(function () use ($page) {
            $page = $this->cmsPageRepo->archive($page);

            $this->logActivity('cms_page_archived', $page, [
                'page_code' => $page->page_code,
            ]);

            $this->refreshCache();

            return $page;
        });
    }

    public function search(string $query): Collection
    {
        return $this->cmsPageRepo->search($query);
    }

    public function getStatusCount(): array
    {
        return $this->cmsPageRepo->getStatusCount();
    }

    public function refreshCache(): void
    {
        CacheManager::flush('cms_page');
    }
}
