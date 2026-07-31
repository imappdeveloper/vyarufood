<?php

declare(strict_types=1);

namespace App\Services\CmsPage;

use App\Models\CmsPage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CmsPageServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;

    public function getAll(): Collection;

    public function getPublished(): Collection;

    public function getByUuid(string $uuid): ?CmsPage;

    public function getBySlug(string $slug): ?CmsPage;

    public function getByCode(string $code): ?CmsPage;

    public function create(array $data): CmsPage;

    public function update(CmsPage $page, array $data): CmsPage;

    public function delete(CmsPage $page): bool;

    public function publish(CmsPage $page): CmsPage;

    public function archive(CmsPage $page): CmsPage;

    public function search(string $query): Collection;

    public function getStatusCount(): array;

    public function refreshCache(): void;
}
