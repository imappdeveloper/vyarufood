<?php

declare(strict_types=1);

namespace App\Services\Country;

use App\DTOs\Country\CountryDTO;
use App\Models\Master\Country;
use App\Repositories\Country\CountryRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use App\Constants\AppConstants;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CountryService extends BaseService implements CountryServiceInterface
{
    protected string $moduleName = 'country';

    public function __construct(
        protected CountryRepositoryInterface $countryRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->countryRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('country', 'all');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->countryRepo->getAll();
        });
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheManager::cacheKey('country', 'active');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->countryRepo->getActive();
        });
    }

    public function getDefault(): ?Country
    {
        $cacheKey = CacheManager::cacheKey('country', 'default');

        return CacheManager::remember($cacheKey, AppConstants::CACHE_TTL_MEDIUM, function () {
            return $this->countryRepo->getDefault();
        });
    }

    public function findById(int $id): ?Country
    {
        return $this->countryRepo->findById($id);
    }

    public function findByUuid(string $uuid): ?Country
    {
        return $this->countryRepo->findByUuid($uuid);
    }

    public function create(array $data): Country
    {
        return $this->transaction(function () use ($data) {
            $dto = CountryDTO::fromArray($data);
            $createdBy = auth()->guard('admin')->id();

            $country = $this->countryRepo->create($dto, $createdBy);

            CacheManager::flush('country');

            $this->logInfo('Country created', ['country_id' => $country->id, 'name' => $country->name]);
            $this->logActivity('country_created', $country);

            return $country;
        });
    }

    public function update(Country $country, array $data): Country
    {
        return $this->transaction(function () use ($country, $data) {
            $updatedBy = auth()->guard('admin')->id();

            $country = $this->countryRepo->update($country, $data, $updatedBy);

            CacheManager::flush('country');

            $this->logInfo('Country updated', ['country_id' => $country->id, 'name' => $country->name]);
            $this->logActivity('country_updated', $country);

            return $country;
        });
    }

    public function delete(Country $country): bool
    {
        $deletedBy = auth()->guard('admin')->id();

        $result = $this->countryRepo->softDelete($country, $deletedBy);

        if ($result) {
            CacheManager::flush('country');

            $this->logInfo('Country deleted', ['country_id' => $country->id, 'name' => $country->name]);
            $this->logActivity('country_deleted', $country);
        }

        return $result;
    }

    public function restore(int $id): bool
    {
        $result = $this->countryRepo->restore($id);

        if ($result) {
            CacheManager::flush('country');

            $this->logInfo('Country restored', ['country_id' => $id]);
        }

        return $result;
    }

    public function forceDelete(Country $country): bool
    {
        $result = $this->countryRepo->forceDelete($country);

        if ($result) {
            CacheManager::flush('country');

            $this->logInfo('Country force deleted', ['country_id' => $country->id, 'name' => $country->name]);
            $this->logActivity('country_force_deleted', $country);
        }

        return $result;
    }

    public function setStatus(Country $country, string $status): Country
    {
        $country = $this->countryRepo->setStatus($country, $status);

        CacheManager::flush('country');

        $this->logInfo('Country status changed', ['country_id' => $country->id, 'status' => $status]);
        $this->logActivity('country_status_changed', $country, ['status' => $status]);

        return $country;
    }

    public function setDefault(Country $country): bool
    {
        $result = $this->countryRepo->setDefault($country);

        if ($result) {
            CacheManager::flush('country');

            $this->logInfo('Country set as default', ['country_id' => $country->id, 'name' => $country->name]);
            $this->logActivity('country_set_default', $country);
        }

        return $result;
    }

    public function bulkDelete(array $ids): int
    {
        $count = $this->countryRepo->bulkDelete($ids);

        if ($count > 0) {
            CacheManager::flush('country');

            $this->logInfo('Bulk countries deleted', ['ids' => $ids, 'count' => $count]);
        }

        return $count;
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        $count = $this->countryRepo->bulkSetStatus($ids, $status);

        if ($count > 0) {
            CacheManager::flush('country');

            $this->logInfo('Bulk countries status changed', ['ids' => $ids, 'status' => $status, 'count' => $count]);
        }

        return $count;
    }

    public function import(array $rows): array
    {
        $result = $this->countryRepo->import($rows);

        if ($result['successes'] > 0) {
            CacheManager::flush('country');

            $this->logInfo('Countries imported', ['successes' => $result['successes'], 'failures' => count($result['failures'])]);
        }

        return $result;
    }

    public function export(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        return $this->countryRepo->getForExport($filters);
    }

    public function downloadSampleTemplate(): string
    {
        $headers = [
            'iso2', 'iso3', 'name', 'numeric_code', 'phone_code', 'native_name',
            'capital', 'currency_code', 'currency_symbol', 'currency_name',
            'emoji', 'emoji_unicode', 'latitude', 'longitude', 'region',
            'subregion', 'nationality', 'status', 'sort_order',
        ];

        $sampleRow = [
            'IN', 'IND', 'India', '356', '+91', 'India',
            'New Delhi', 'INR', '₹', 'Indian Rupee',
            '🇮🇳', 'U+1F1EE U+1F1F3', '20.5937', '78.9629', 'Asia',
            'Southern Asia', 'Indian', 'active', '0',
        ];

        $csv = implode(',', $headers) . "\n";
        $csv .= implode(',', $sampleRow) . "\n";

        return $csv;
    }

    public function countByStatus(): array
    {
        return $this->countryRepo->countByStatus();
    }
}
