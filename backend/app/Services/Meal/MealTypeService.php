<?php

declare(strict_types=1);

namespace App\Services\Meal;

use App\DTOs\Meal\MealTypeDTO;
use App\Models\MealType;
use App\Repositories\Meal\MealTypeRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MealTypeService extends BaseService implements MealTypeServiceInterface
{
    protected string $moduleName = 'meal_type';

    public function __construct(
        protected MealTypeRepositoryInterface $mealTypeRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->mealTypeRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal_type', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealTypeRepo->getAll();
        });
    }

    public function getActive(): Collection
    {
        $cacheKey = CacheManager::cacheKey('meal_type', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->mealTypeRepo->getActive();
        });
    }

    public function getById(int $id): ?MealType
    {
        return $this->mealTypeRepo->getById($id);
    }

    public function findByUuid(string $uuid): ?MealType
    {
        return $this->mealTypeRepo->findByUuid($uuid);
    }

    public function create(array $data): MealType
    {
        return $this->transaction(function () use ($data) {
            $dto = MealTypeDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $mealType = $this->mealTypeRepo->create($dto, $createdBy);

            CacheManager::flush('meal_type');

            $this->logInfo('Meal type created', ['meal_type_id' => $mealType->id, 'type_code' => $mealType->type_code]);
            $this->logActivity('meal_type_created', $mealType);

            return $mealType;
        });
    }

    public function update(MealType $mealType, array $data): MealType
    {
        return $this->transaction(function () use ($mealType, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $mealType = $this->mealTypeRepo->update($mealType, $data, $updatedBy);

            CacheManager::flush('meal_type');

            $this->logInfo('Meal type updated', ['meal_type_id' => $mealType->id]);
            $this->logActivity('meal_type_updated', $mealType);

            return $mealType;
        });
    }

    public function delete(MealType $mealType): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->mealTypeRepo->softDelete($mealType, $deletedBy);

        if ($result) {
            CacheManager::flush('meal_type');

            $this->logInfo('Meal type deleted', ['meal_type_id' => $mealType->id]);
            $this->logActivity('meal_type_deleted', $mealType);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->mealTypeRepo->restore($id);

        if ($result) {
            CacheManager::flush('meal_type');

            $this->logInfo('Meal type restored', ['meal_type_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(MealType $mealType): bool
    {
        $result = $this->mealTypeRepo->forceDelete($mealType);

        if ($result) {
            CacheManager::flush('meal_type');

            $this->logInfo('Meal type force deleted', ['meal_type_id' => $mealType->id]);
        }

        return $result;
    }

    public function setDefault(MealType $mealType): MealType
    {
        $mealType = $this->mealTypeRepo->setDefault($mealType);

        CacheManager::flush('meal_type');

        $this->logInfo('Meal type set as default', ['meal_type_id' => $mealType->id]);
        $this->logActivity('meal_type_default_changed', $mealType);

        return $mealType;
    }

    public function setStatus(MealType $mealType, string $status): MealType
    {
        $mealType = $this->mealTypeRepo->setStatus($mealType, $status);

        CacheManager::flush('meal_type');

        $this->logInfo('Meal type status changed', ['meal_type_id' => $mealType->id, 'status' => $status]);
        $this->logActivity($status === 'active' ? 'meal_type_activated' : 'meal_type_deactivated', $mealType, ['status' => $status]);

        return $mealType;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->mealTypeRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('meal_type');

            $this->logInfo('Bulk meal types deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->mealTypeRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('meal_type');

            $this->logInfo('Bulk meal types status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->mealTypeRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('meal_type');

            $this->logInfo('Meal types imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): Collection
    {
        return $this->mealTypeRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'type_code', 'name', 'slug', 'description',
            'display_order', 'icon', 'color_code',
            'status', 'is_default',
        ];

        $sampleRow = [
            'MTYPE-001', 'Veg', 'veg', 'Vegetarian meals',
            '1', 'eco', '#4CAF50',
            'active', 'true',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', array_map(fn ($v) => '"' . str_replace('"', '""', $v) . '"', $sampleRow)) . "\n";

        return $csv;
    }

    public function getStats(): array
    {
        $cacheKey = CacheManager::cacheKey('meal_type', 'stats');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_SHORT, function () {
            return [
                'total_by_status' => $this->mealTypeRepo->countByStatus(),
                'default_count' => $this->mealTypeRepo->countDefault(),
            ];
        });
    }

    public function getDefault(): ?MealType
    {
        return $this->mealTypeRepo->getDefault();
    }

    public function search(?string $search): Collection
    {
        return $this->mealTypeRepo->search($search);
    }

    public function hasRelatedData(MealType $mealType): bool
    {
        return $this->mealTypeRepo->hasRelatedData($mealType);
    }
}
