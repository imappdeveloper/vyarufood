<?php

declare(strict_types=1);

namespace App\Services\Kitchen;

use App\DTOs\Kitchen\KitchenWorkingDayDTO;
use App\Models\KitchenWorkingDay;
use App\Repositories\Kitchen\KitchenWorkingDayRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class KitchenWorkingDayService extends BaseService implements KitchenWorkingDayServiceInterface
{
    protected string $moduleName = 'kitchen_working_day';

    public function __construct(
        protected KitchenWorkingDayRepositoryInterface $repo,
    ) {}

    public function getPaginated(int $kitchenId, array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->repo->getPaginated($kitchenId, $filters, $perPage, $sort, $order);
    }

    public function getAll(int $kitchenId): Collection
    {
        $cacheKey = CacheManager::cacheKey('kitchen_working_day', "all:{$kitchenId}");

        return CacheManager::remember($cacheKey, 3600, fn () => $this->repo->getAll($kitchenId));
    }

    public function getById(int $id): ?KitchenWorkingDay
    {
        return $this->repo->getById($id);
    }

    public function findByUuid(string $uuid): ?KitchenWorkingDay
    {
        return $this->repo->findByUuid($uuid);
    }

    public function create(array $data): KitchenWorkingDay
    {
        return $this->transaction(function () use ($data) {
            $dto = KitchenWorkingDayDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $workingDay = $this->repo->create($dto->toArray(), $createdBy);

            CacheManager::flush('kitchen_working_day');

            $this->logInfo('Working day created', ['id' => $workingDay->id]);
            $this->logActivity('working_day_created', $workingDay);

            return $workingDay;
        });
    }

    public function update(KitchenWorkingDay $workingDay, array $data): KitchenWorkingDay
    {
        return $this->transaction(function () use ($workingDay, $data) {
            $updatedBy = auth()->guard('admin')->id();
            $workingDay = $this->repo->update($workingDay, $data, $updatedBy);

            CacheManager::flush('kitchen_working_day');

            $this->logInfo('Working day updated', ['id' => $workingDay->id]);
            $this->logActivity('working_day_updated', $workingDay);

            return $workingDay;
        });
    }

    public function delete(KitchenWorkingDay $workingDay): bool
    {
        $result = $this->repo->delete($workingDay);

        if ($result) {
            CacheManager::flush('kitchen_working_day');
            $this->logInfo('Working day deleted', ['id' => $workingDay->id]);
            $this->logActivity('working_day_deleted', $workingDay);
        }

        return $result;
    }

    public function bulkUpdate(int $kitchenId, array $days): int
    {
        $count = $this->repo->bulkUpdate($kitchenId, $days, auth()->guard('admin')->id());

        if ($count > 0) {
            CacheManager::flush('kitchen_working_day');
            $this->logInfo('Bulk working days updated', ['kitchen_id' => $kitchenId, 'count' => $count]);
        }

        return $count;
    }

    public function getWorkingDays(int $kitchenId): Collection
    {
        $cacheKey = CacheManager::cacheKey('kitchen_working_day', "working:{$kitchenId}");

        return CacheManager::remember($cacheKey, 3600, fn () => $this->repo->getWorkingDays($kitchenId));
    }

    public function getDefaultSchedule(): array
    {
        return [
            ['day_of_week' => 'monday', 'is_working' => true, 'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '05:00', 'accept_order_start' => '07:00', 'accept_order_end' => '21:00'],
            ['day_of_week' => 'tuesday', 'is_working' => true, 'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '05:00', 'accept_order_start' => '07:00', 'accept_order_end' => '21:00'],
            ['day_of_week' => 'wednesday', 'is_working' => true, 'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '05:00', 'accept_order_start' => '07:00', 'accept_order_end' => '21:00'],
            ['day_of_week' => 'thursday', 'is_working' => true, 'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '05:00', 'accept_order_start' => '07:00', 'accept_order_end' => '21:00'],
            ['day_of_week' => 'friday', 'is_working' => true, 'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '05:00', 'accept_order_start' => '07:00', 'accept_order_end' => '21:00'],
            ['day_of_week' => 'saturday', 'is_working' => true, 'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '05:00', 'accept_order_start' => '07:00', 'accept_order_end' => '21:00'],
            ['day_of_week' => 'sunday', 'is_working' => false, 'opening_time' => null, 'closing_time' => null, 'preparation_start_time' => null, 'accept_order_start' => null, 'accept_order_end' => null],
        ];
    }
}
