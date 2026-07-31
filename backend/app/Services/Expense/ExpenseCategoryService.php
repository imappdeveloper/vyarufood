<?php

declare(strict_types=1);

namespace App\Services\Expense;

use App\DTOs\Expense\ExpenseCategoryDTO;
use App\Models\ExpenseCategory;
use App\Repositories\Expense\ExpenseCategoryRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ExpenseCategoryService extends BaseService implements ExpenseCategoryServiceInterface
{
    protected string $moduleName = 'expense_category';

    public function __construct(
        private readonly ExpenseCategoryRepositoryInterface $repo,
    ) {}

    public function getPaginatedCategories(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getCategoryById(int $id): ?ExpenseCategory
    {
        return $this->repo->getById($id);
    }

    public function getCategoryByUuid(string $uuid): ?ExpenseCategory
    {
        return $this->repo->getByUuid($uuid);
    }

    public function createCategory(ExpenseCategoryDTO $dto): ExpenseCategory
    {
        return $this->transaction(function () use ($dto) {
            $adminId = auth()->guard('admin')->id();

            $data = array_merge($dto->toArray(), [
                'category_code' => $dto->categoryCode ?: $this->repo->generateCategoryCode(),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $category = $this->repo->create($data);

            CacheManager::flush('expense');
            $this->logInfo('Expense category created', ['category_id' => $category->id, 'code' => $category->category_code]);

            return $category->fresh(['parentCategory']);
        });
    }

    public function updateCategory(int $id, ExpenseCategoryDTO $dto): ?ExpenseCategory
    {
        return $this->transaction(function () use ($id, $dto) {
            $category = $this->repo->getById($id);

            if (! $category) {
                throw new \RuntimeException('Expense category not found.');
            }

            $adminId = auth()->guard('admin')->id();

            $data = array_filter($dto->toArray(), fn ($v) => $v !== null);
            $data['updated_by'] = $adminId;

            $this->repo->update($id, $data);

            CacheManager::flush('expense');
            $this->logInfo('Expense category updated', ['category_id' => $id]);

            return $this->repo->getById($id);
        });
    }

    public function deleteCategory(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $category = $this->repo->getById($id);

            if (! $category) {
                throw new \RuntimeException('Expense category not found.');
            }

            if ($category->expenses()->count() > 0) {
                throw new \RuntimeException('Cannot delete category with existing expenses.');
            }

            if ($category->childCategories()->count() > 0) {
                throw new \RuntimeException('Cannot delete category with sub-categories.');
            }

            $category->delete();

            CacheManager::flush('expense');
            $this->logInfo('Expense category deleted', ['category_id' => $id]);

            return true;
        });
    }

    public function getStats(): array
    {
        return $this->repo->countByStatus();
    }

    public function getAllActive(): Collection
    {
        return $this->repo->getAllActive();
    }
}
