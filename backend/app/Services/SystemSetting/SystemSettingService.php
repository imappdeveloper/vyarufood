<?php

declare(strict_types=1);

namespace App\Services\SystemSetting;

use App\Models\SystemSetting;
use App\Repositories\SystemSetting\SystemSettingRepositoryInterface;
use App\Support\BaseService;
use App\Support\CacheManager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SystemSettingService extends BaseService implements SystemSettingServiceInterface
{
    protected string $moduleName = 'system_setting';

    public function __construct(
        protected SystemSettingRepositoryInterface $settingRepo,
    ) {}

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        return $this->settingRepo->getPaginated($filters, $perPage, $sort, $order);
    }

    public function getAll(): Collection
    {
        return CacheManager::remember(
            CacheManager::cacheKey('system_setting', 'all'),
            3600,
            fn () => $this->settingRepo->getAll(),
        );
    }

    public function getByGroup(string $group): Collection
    {
        return CacheManager::remember(
            CacheManager::cacheKey('system_setting', 'group', $group),
            3600,
            fn () => $this->settingRepo->getByGroup($group),
        );
    }

    public function getByUuid(string $uuid): ?SystemSetting
    {
        return $this->settingRepo->findByUuid($uuid);
    }

    public function create(array $data): SystemSetting
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['updated_by'] = $adminId;

            $setting = $this->settingRepo->create($data);

            $this->logActivity('setting_created', $setting, [
                'setting_key' => $setting->setting_key,
                'setting_group' => $setting->setting_group,
            ]);

            $this->refreshCache();

            return $setting;
        });
    }

    public function update(SystemSetting $setting, array $data): SystemSetting
    {
        return $this->transaction(function () use ($setting, $data) {
            $adminId = auth()->guard('admin')->id();
            $data['updated_by'] = $adminId;

            $oldValue = $setting->setting_value;

            $setting = $this->settingRepo->update($setting, $data);

            $this->logActivity('setting_updated', $setting, [
                'setting_key' => $setting->setting_key,
                'old_value' => $oldValue,
                'new_value' => $setting->setting_value,
            ]);

            $this->refreshCache();

            return $setting;
        });
    }

    public function bulkUpdate(array $settings): array
    {
        return $this->transaction(function () use ($settings) {
            $adminId = auth()->guard('admin')->id();

            foreach ($settings as &$item) {
                $item['updated_by'] = $adminId;
            }

            $results = $this->settingRepo->bulkUpdate($settings);

            $this->logActivity('settings_bulk_updated', null, [
                'count' => count($results),
            ]);

            $this->refreshCache();

            return $results;
        });
    }

    public function delete(SystemSetting $setting): bool
    {
        return $this->transaction(function () use ($setting) {
            $key = $setting->setting_key;

            $result = $this->settingRepo->delete($setting);

            $this->logActivity('setting_deleted', null, [
                'setting_key' => $key,
            ]);

            $this->refreshCache();

            return $result;
        });
    }

    public function getValue(string $key, mixed $default = null): mixed
    {
        return CacheManager::remember(
            CacheManager::cacheKey('system_setting', 'value', $key),
            3600,
            fn () => $this->settingRepo->getValue($key, $default),
        );
    }

    public function setValue(string $key, mixed $value, ?string $group = null): SystemSetting
    {
        $setting = $this->settingRepo->setValue($key, $value, $group);

        $this->refreshCache();

        return $setting;
    }

    public function getGroupCount(): array
    {
        return $this->settingRepo->getGroupCount();
    }

    public function getStatusCount(): array
    {
        return $this->settingRepo->getStatusCount();
    }

    public function search(string $query): Collection
    {
        return $this->settingRepo->search($query);
    }

    public function getAutoloadedSettings(): Collection
    {
        return CacheManager::remember(
            CacheManager::cacheKey('system_setting', 'autoloaded'),
            3600,
            fn () => $this->settingRepo->getAutoloaded(),
        );
    }

    public function refreshCache(): void
    {
        CacheManager::flush('system_setting');
    }
}
