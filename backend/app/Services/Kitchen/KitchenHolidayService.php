<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\DTOs\Kitchen\KitchenHolidayDTO;
use App\Models\KitchenHoliday;
use App\Repositories\Kitchen\KitchenHolidayRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class KitchenHolidayService extends BaseService implements KitchenHolidayServiceInterface
{
    protected string $moduleName = 'kitchen_holiday';

    public function __construct(
        protected KitchenHolidayRepositoryInterface $repo,
    ) {}

    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->repo->getPaginated($kitchenId, $filters, $perPage, $sort, $order);
    }

    public function getAll(int $kitchenId): Collection
    {
        $cacheKey = CacheManager::cacheKey('kitchen_holiday', "all:{$kitchenId}");

        return CacheManager::remember($cacheKey, 3600, fn () => $this->repo->getAll($kitchenId));
    }

    public function getById(int $id): ?KitchenHoliday
    {
        return $this->repo->getById($id);
    }

    public function findByUuid(string $uuid): ?KitchenHoliday
    {
        return $this->repo->findByUuid($uuid);
    }

    public function create(array $data): KitchenHoliday
    {
        return $this->transaction(function () use ($data) {
            if ($this->repo->isDateOverlapping($data['kitchen_id'], $data['start_date'], $data['end_date'])) {
                throw new \Illuminate\Validation\ValidationException(
                    \Illuminate\Support\Facades\Validator::make([], []),
                    ['start_date' => ['Holiday dates overlap with an existing holiday for this kitchen.']]
                );
            }

            $dto = KitchenHolidayDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $holiday = $this->repo->create($dto->toArray(), $createdBy);

            CacheManager::flush('kitchen_holiday');

            $this->logInfo('Holiday created', ['id' => $holiday->id, 'name' => $holiday->holiday_name]);
            $this->logActivity('holiday_created', $holiday);

            return $holiday;
        });
    }

    public function update(KitchenHoliday $holiday, array $data): KitchenHoliday
    {
        return $this->transaction(function () use ($holiday, $data) {
            $startDate = $data['start_date'] ?? $holiday->start_date->format('Y-m-d');
            $endDate = $data['end_date'] ?? $holiday->end_date->format('Y-m-d');

            if ($this->repo->isDateOverlapping($holiday->kitchen_id, $startDate, $endDate, $holiday->id)) {
                throw new \Illuminate\Validation\ValidationException(
                    \Illuminate\Support\Facades\Validator::make([], []),
                    ['start_date' => ['Holiday dates overlap with an existing holiday for this kitchen.']]
                );
            }

            $updatedBy = auth()->guard('admin')->id();
            $holiday = $this->repo->update($holiday, $data, $updatedBy);

            CacheManager::flush('kitchen_holiday');

            $this->logInfo('Holiday updated', ['id' => $holiday->id]);
            $this->logActivity('holiday_updated', $holiday);

            return $holiday;
        });
    }

    public function delete(KitchenHoliday $holiday): bool
    {
        $result = $this->repo->delete($holiday);

        if ($result) {
            CacheManager::flush('kitchen_holiday');
            $this->logInfo('Holiday deleted', ['id' => $holiday->id]);
            $this->logActivity('holiday_deleted', $holiday);
        }

        return $result;
    }

    public function getActiveHolidaysForDate(int $kitchenId, string $date): Collection
    {
        return $this->repo->getActiveHolidaysForDate($kitchenId, $date);
    }

    public function isKitchenOnHoliday(int $kitchenId, string $date): bool
    {
        $cacheKey = CacheManager::cacheKey('kitchen_holiday', "on-holiday:{$kitchenId}:{$date}");

        return CacheManager::remember($cacheKey, 300, fn () => $this->repo->isKitchenOnHoliday($kitchenId, $date));
    }

    public function getHolidayCalendar(int $kitchenId, string $year, string $month): Collection
    {
        $from = "{$year}-{$month}-01";
        $to = Carbon::create($year, $month, 1)->endOfMonth()->format('Y-m-d');

        $cacheKey = CacheManager::cacheKey('kitchen_holiday', "calendar:{$kitchenId}:{$year}-{$month}");

        return CacheManager::remember($cacheKey, 3600, fn () => $this->repo->getForDateRange($kitchenId, $from, $to));
    }
}
