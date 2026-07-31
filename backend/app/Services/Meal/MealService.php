<?php

declare(strict_types=1);

namespace App\Services\Meal;

use App\DTOs\Meal\MealDTO;
use App\Models\Meal;
use App\Repositories\Meal\MealRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MealService extends BaseService implements MealServiceInterface
{
    protected string $moduleName = 'meal';

    public function __construct(
        protected MealRepositoryInterface $mealRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->mealRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealRepo->getAll();
        });
    }

    public function getActive(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealRepo->getActive();
        });
    }

    public function getById(int $id): ?Meal
    {
        return $this->mealRepo->getById($id);
    }

    public function findByUuid(string $uuid): ?Meal
    {
        return $this->mealRepo->findByUuid($uuid);
    }

    public function create(array $data): Meal
    {
        return $this->transaction(function () use ($data) {
            $dto = MealDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $meal = $this->mealRepo->create($dto->toArray(), $createdBy);

            CacheManager::flush('meal');

            $this->logInfo('Meal created', ['meal_id' => $meal->id, 'meal_code' => $meal->meal_code]);
            $this->logActivity('meal_created', $meal);

            return $meal;
        });
    }

    public function update(Meal $meal, array $data): Meal
    {
        return $this->transaction(function () use ($meal, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $meal = $this->mealRepo->update($meal, $data, $updatedBy);

            CacheManager::flush('meal');

            $this->logInfo('Meal updated', ['meal_id' => $meal->id]);
            $this->logActivity('meal_updated', $meal);

            return $meal;
        });
    }

    public function delete(Meal $meal): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->mealRepo->softDelete($meal, $deletedBy);

        if ($result) {
            CacheManager::flush('meal');

            $this->logInfo('Meal deleted', ['meal_id' => $meal->id]);
            $this->logActivity('meal_deleted', $meal);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->mealRepo->restore($id);

        if ($result) {
            CacheManager::flush('meal');

            $this->logInfo('Meal restored', ['meal_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(Meal $meal): bool
    {
        $result = $this->mealRepo->forceDelete($meal);

        if ($result) {
            CacheManager::flush('meal');

            $this->logInfo('Meal force deleted', ['meal_id' => $meal->id]);
        }

        return $result;
    }

    public function setStatus(Meal $meal, string $status): Meal
    {
        $meal = $this->mealRepo->setStatus($meal, $status);

        CacheManager::flush('meal');

        $this->logInfo('Meal status changed', ['meal_id' => $meal->id, 'status' => $status]);
        $this->logActivity($status === 'active' ? 'meal_activated' : 'meal_deactivated', $meal, ['status' => $status]);

        return $meal;
    }

    public function setFeatured(Meal $meal, bool $value): Meal
    {
        $meal = $this->mealRepo->setFeatured($meal, $value);

        CacheManager::flush('meal');

        $this->logInfo('Meal featured flag changed', ['meal_id' => $meal->id, 'is_featured' => $value]);
        $this->logActivity('meal_featured_changed', $meal, ['is_featured' => $value]);

        return $meal;
    }

    public function setRecommended(Meal $meal, bool $value): Meal
    {
        $meal = $this->mealRepo->setRecommended($meal, $value);

        CacheManager::flush('meal');

        $this->logInfo('Meal recommended flag changed', ['meal_id' => $meal->id, 'is_recommended' => $value]);
        $this->logActivity('meal_recommended_changed', $meal, ['is_recommended' => $value]);

        return $meal;
    }

    public function setBestseller(Meal $meal, bool $value): Meal
    {
        $meal = $this->mealRepo->setBestseller($meal, $value);

        CacheManager::flush('meal');

        $this->logInfo('Meal bestseller flag changed', ['meal_id' => $meal->id, 'is_bestseller' => $value]);
        $this->logActivity('meal_bestseller_changed', $meal, ['is_bestseller' => $value]);

        return $meal;
    }

    public function setNewFlag(Meal $meal, bool $value): Meal
    {
        $meal = $this->mealRepo->setNewFlag($meal, $value);

        CacheManager::flush('meal');

        $this->logInfo('Meal new flag changed', ['meal_id' => $meal->id, 'is_new' => $value]);
        $this->logActivity('meal_new_changed', $meal, ['is_new' => $value]);

        return $meal;
    }

    public function duplicate(Meal $meal): Meal
    {
        $createdBy = auth()->guard('admin')->id();

        $newMeal = $this->mealRepo->duplicate($meal, $createdBy);

        CacheManager::flush('meal');

        $this->logInfo('Meal duplicated', ['original_meal_id' => $meal->id, 'new_meal_id' => $newMeal->id]);
        $this->logActivity('meal_duplicated', $newMeal);

        return $newMeal;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->mealRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('meal');

            $this->logInfo('Bulk meals deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->mealRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('meal');

            $this->logInfo('Bulk meals status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function bulkUpdatePrice(array $ids, array $data): int
    {
        $count = $this->mealRepo->bulkUpdatePrice($ids, $data);

        if ($count > 0) {
            CacheManager::flush('meal');

            $this->logInfo('Bulk meals price updated', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkUpdateCategory(array $ids, int $categoryId): int
    {
        $count = $this->mealRepo->bulkUpdateCategory($ids, $categoryId);

        if ($count > 0) {
            CacheManager::flush('meal');

            $this->logInfo('Bulk meals category updated', ['ids' => $ids, 'category_id' => $categoryId, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->mealRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('meal');

            $this->logInfo('Meals imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): Collection
    {
        return $this->mealRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'meal_code', 'category_id', 'meal_type_id', 'kitchen_id',
            'name', 'slug', 'short_description', 'description',
            'spice_level', 'serving_size', 'unit',
            'barcode', 'sku', 'hsn_code',
            'preparation_time', 'calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar', 'sodium',
            'price', 'offer_price', 'cost_price', 'tax_percentage',
            'display_order', 'availability_type',
            'is_featured', 'is_recommended', 'is_new', 'is_bestseller',
            'is_customizable', 'requires_preparation',
            'status',
        ];

        $sampleRow = [
            'ML-001', '1', '1', '1',
            'Chicken Biryani', 'chicken-biryani', 'Aromatic chicken biryani with basmati rice', 'Traditional Hyderabadi chicken biryani',
            '2', '1 full plate', 'plate',
            '8901234567890', 'BIR-CHICK-001', '9988',
            '45', '450', '25', '60', '12', '3', '5', '800',
            '180', '150', '90', '5',
            '1', 'all_day',
            'true', 'false', 'false', 'true',
            'false', 'true',
            'active',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', array_map(fn ($v) => '"' . str_replace('"', '""', $v) . '"', $sampleRow)) . "\n";

        return $csv;
    }

    public function getStats(): array
    {
        $cacheKey = CacheManager::cacheKey('meal', 'stats');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () {
            return [
                'total_by_status' => $this->mealRepo->countByStatus(),
                'flags' => $this->mealRepo->countByFlags(),
            ];
        });
    }

    public function search(?string $search): Collection
    {
        return $this->mealRepo->search($search);
    }

    public function hasRelatedData(Meal $meal): bool
    {
        return $this->mealRepo->hasRelatedData($meal);
    }

    public function getFeatured(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'featured');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealRepo->model->query()
                ->where('is_featured', true)
                ->where('status', 'active')
                ->with(['category', 'mealType', 'kitchen'])
                ->orderBy('display_order', 'asc')
                ->get();
        });
    }

    public function getRecommended(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'recommended');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealRepo->model->query()
                ->where('is_recommended', true)
                ->where('status', 'active')
                ->with(['category', 'mealType', 'kitchen'])
                ->orderBy('display_order', 'asc')
                ->get();
        });
    }

    public function getBestsellers(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'bestsellers');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealRepo->model->query()
                ->where('is_bestseller', true)
                ->where('status', 'active')
                ->with(['category', 'mealType', 'kitchen'])
                ->orderBy('display_order', 'asc')
                ->get();
        });
    }

    public function getNewArrivals(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'new_arrivals');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealRepo->model->query()
                ->where('is_new', true)
                ->where('status', 'active')
                ->with(['category', 'mealType', 'kitchen'])
                ->orderBy('display_order', 'asc')
                ->get();
        });
    }

    public function getByCategory(int $categoryId): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'category', (string) $categoryId);

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($categoryId) {
            return $this->mealRepo->model->query()
                ->where('category_id', $categoryId)
                ->where('status', 'active')
                ->with(['mealType', 'kitchen'])
                ->orderBy('display_order', 'asc')
                ->get();
        });
    }

    public function getByKitchen(int $kitchenId): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'kitchen', (string) $kitchenId);

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($kitchenId) {
            return $this->mealRepo->model->query()
                ->where('kitchen_id', $kitchenId)
                ->where('status', 'active')
                ->with(['category', 'mealType'])
                ->orderBy('display_order', 'asc')
                ->get();
        });
    }

    public function getByAvailability(string $availabilityType): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal', 'availability', $availabilityType);

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () use ($availabilityType) {
            return $this->mealRepo->model->query()
                ->where('status', 'active')
                ->where(function ($q) use ($availabilityType) {
                    $q->where('availability_type', $availabilityType)
                      ->orWhere('availability_type', 'all_day');
                })
                ->with(['category', 'mealType', 'kitchen'])
                ->orderBy('display_order', 'asc')
                ->get();
        });
    }
}
