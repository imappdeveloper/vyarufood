<?php

declare(strict_types=1);

namespace App\Services\Meal;

use App\DTOs\Meal\MealCategoryDTO;
use App\Models\MealCategory;
use App\Repositories\Meal\MealCategoryRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MealCategoryService extends BaseService implements MealCategoryServiceInterface
{
    protected string $moduleName = 'meal_category';

    public function __construct(
        protected MealCategoryRepositoryInterface $mealCategoryRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->mealCategoryRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal_category', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealCategoryRepo->getAll();
        });
    }

    public function getActive(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal_category', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealCategoryRepo->getActive();
        });
    }

    public function getById(int $id): ?MealCategory
    {
        return $this->mealCategoryRepo->getById($id);
    }

    public function findByUuid(string $uuid): ?MealCategory
    {
        return $this->mealCategoryRepo->findByUuid($uuid);
    }

    public function create(array $data): MealCategory
    {
        return $this->transaction(function () use ($data) {
            $dto = MealCategoryDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $mealCategory = $this->mealCategoryRepo->create($dto, $createdBy);

            CacheManager::flush('meal_category');

            $this->logInfo('Meal category created', ['meal_category_id' => $mealCategory->id, 'category_code' => $mealCategory->category_code]);
            $this->logActivity('meal_category_created', $mealCategory);

            return $mealCategory;
        });
    }

    public function update(MealCategory $mealCategory, array $data): MealCategory
    {
        return $this->transaction(function () use ($mealCategory, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $mealCategory = $this->mealCategoryRepo->update($mealCategory, $data, $updatedBy);

            CacheManager::flush('meal_category');

            $this->logInfo('Meal category updated', ['meal_category_id' => $mealCategory->id]);
            $this->logActivity('meal_category_updated', $mealCategory);

            return $mealCategory;
        });
    }

    public function delete(MealCategory $mealCategory): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->mealCategoryRepo->softDelete($mealCategory, $deletedBy);

        if ($result) {
            CacheManager::flush('meal_category');

            $this->logInfo('Meal category deleted', ['meal_category_id' => $mealCategory->id]);
            $this->logActivity('meal_category_deleted', $mealCategory);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->mealCategoryRepo->restore($id);

        if ($result) {
            CacheManager::flush('meal_category');

            $this->logInfo('Meal category restored', ['meal_category_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(MealCategory $mealCategory): bool
    {
        $result = $this->mealCategoryRepo->forceDelete($mealCategory);

        if ($result) {
            CacheManager::flush('meal_category');

            $this->logInfo('Meal category force deleted', ['meal_category_id' => $mealCategory->id]);
        }

        return $result;
    }

    public function setDefault(MealCategory $mealCategory): MealCategory
    {
        $mealCategory = $this->mealCategoryRepo->setDefault($mealCategory);

        CacheManager::flush('meal_category');

        $this->logInfo('Meal category set as default', ['meal_category_id' => $mealCategory->id]);
        $this->logActivity('meal_category_default_changed', $mealCategory);

        return $mealCategory;
    }

    public function setStatus(MealCategory $mealCategory, string $status): MealCategory
    {
        $mealCategory = $this->mealCategoryRepo->setStatus($mealCategory, $status);

        CacheManager::flush('meal_category');

        $this->logInfo('Meal category status changed', ['meal_category_id' => $mealCategory->id, 'status' => $status]);
        $this->logActivity($status === 'active' ? 'meal_category_activated' : 'meal_category_deactivated', $mealCategory, ['status' => $status]);

        return $mealCategory;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->mealCategoryRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('meal_category');

            $this->logInfo('Bulk meal categories deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->mealCategoryRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('meal_category');

            $this->logInfo('Bulk meal categories status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->mealCategoryRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('meal_category');

            $this->logInfo('Meal categories imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): Collection
    {
        return $this->mealCategoryRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'category_code', 'name', 'slug', 'description',
            'display_order', 'icon', 'color_code',
            'status', 'is_default',
        ];

        $sampleRow = [
            'MCAT-001', 'Breakfast', 'breakfast', 'Early morning breakfast meals',
            '1', 'free_breakfast', '#FF9800',
            'active', 'true',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', array_map(fn ($v) => '"' . str_replace('"', '""', $v) . '"', $sampleRow)) . "\n";

        return $csv;
    }

    public function getStats(): array
    {
        $cacheKey = CacheManager::cacheKey('meal_category', 'stats');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () {
            return [
                'total_by_status' => $this->mealCategoryRepo->countByStatus(),
                'default_count' => $this->mealCategoryRepo->countDefault(),
            ];
        });
    }

    public function getDefault(): ?MealCategory
    {
        return $this->mealCategoryRepo->getDefault();
    }

    public function search(?string $search): Collection
    {
        return $this->mealCategoryRepo->search($search);
    }

    public function hasRelatedData(MealCategory $mealCategory): bool
    {
        return $this->mealCategoryRepo->hasRelatedData($mealCategory);
    }
}
