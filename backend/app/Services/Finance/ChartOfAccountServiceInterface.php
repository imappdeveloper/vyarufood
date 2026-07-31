<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\ChartOfAccount;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ChartOfAccountServiceInterface
{
    public function getPaginatedCategories(array $filters, int $perPage): LengthAwarePaginator;
    public function getActiveCategories(): Collection;
    public function getCategoryById(int $id): ?ChartOfAccount;
    public function getCategoryByUuid(string $uuid): ?ChartOfAccount;
    public function createCategory(array $data): ChartOfAccount;
    public function updateCategory(int $id, array $data): ChartOfAccount;
    public function deleteCategory(int $id): bool;
    public function getAccountTree(): Collection;
    public function getByAccountType(string $type): Collection;
}
