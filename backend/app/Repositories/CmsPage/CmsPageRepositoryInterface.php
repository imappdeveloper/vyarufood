<?php

declare(strict_types=1);

namespace App\Repositories\CmsPage;

use App\Models\CmsPage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CmsPageRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;

    public function getAll(): Collection;

    public function getPublished(): Collection;

    public function findById(int $id): ?CmsPage;

    public function findByUuid(string $uuid): ?CmsPage;

    public function findBySlug(string $slug): ?CmsPage;

    public function findByCode(string $code): ?CmsPage;

    public function create(array $data): CmsPage;

    public function update(CmsPage $page, array $data): CmsPage;

    public function delete(CmsPage $page): bool;

    public function publish(CmsPage $page): CmsPage;

    public function archive(CmsPage $page): CmsPage;

    public function search(string $query): Collection;

    public function getStatusCount(): array;

    public function existsBySlug(string $slug, ?int $excludeId = null): bool;

    public function existsByCode(string $code, ?int $excludeId = null): bool;
}
