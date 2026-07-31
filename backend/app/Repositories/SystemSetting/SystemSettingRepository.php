<?php

declare(strict_types=1);

namespace App\Repositories\SystemSetting;

use App\Models\SystemSetting;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SystemSettingRepository extends BaseRepository implements SystemSettingRepositoryInterface
{
    protected function model(): SystemSetting
    {
        return new SystemSetting;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->newQuery()->with('updater');

        if (!empty($filters['group'])) {
            $query->where('setting_group', $filters['group']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['data_type'])) {
            $query->where('data_type', $filters['data_type']);
        }

        if (!empty($filters['is_encrypted'])) {
            $query->where('is_encrypted', $filters['is_encrypted']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('setting_key', 'like', "%{$filters['search']}%")
                    ->orWhere('setting_group', 'like', "%{$filters['search']}%")
                    ->orWhere('remarks', 'like', "%{$filters['search']}%");
            });
        }

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->newQuery()->orderBy('setting_group')->orderBy('setting_key')->get();
    }

    public function getByGroup(string $group): Collection
    {
        return $this->newQuery()
            ->where('setting_group', $group)
            ->where('status', 'active')
            ->orderBy('setting_key')
            ->get();
    }

    public function getByKey(string $key): ?SystemSetting
    {
        return $this->newQuery()->where('setting_key', $key)->first();
    }

    public function getAutoloaded(): Collection
    {
        return $this->newQuery()
            ->where('autoload', true)
            ->where('status', 'active')
            ->orderBy('setting_group')
            ->orderBy('setting_key')
            ->get();
    }

    public function findById(int $id): ?SystemSetting
    {
        return $this->newQuery()->find($id);
    }

    public function findByUuid(string $uuid): ?SystemSetting
    {
        return $this->newQuery()->where('uuid', $uuid)->first();
    }

    public function create(array $data): SystemSetting
    {
        $data['uuid'] = \Illuminate\Support\Str::uuid();
        $setting = $this->newQuery()->create($data);

        if (!empty($data['setting_value']) && !empty($data['is_encrypted'])) {
            $setting->setRawValue($data['setting_value']);
            $setting->save();
        }

        return $setting->fresh();
    }

    public function update(SystemSetting $setting, array $data): SystemSetting
    {
        if (array_key_exists('setting_value', $data)) {
            $setting->setRawValue($data['setting_value']);
            unset($data['setting_value']);
        }

        $setting->update($data);

        return $setting->fresh();
    }

    public function bulkUpdate(array $settings): array
    {
        $results = [];

        foreach ($settings as $item) {
            $setting = $this->getByKey($item['setting_key']);
            if ($setting) {
                $this->update($setting, ['setting_value' => $item['setting_value'] ?? null]);
                $results[] = ['setting_key' => $item['setting_key'], 'status' => 'updated'];
            } else {
                $results[] = ['setting_key' => $item['setting_key'], 'status' => 'not_found'];
            }
        }

        return $results;
    }

    public function delete(SystemSetting $setting): bool
    {
        return $setting->delete();
    }

    public function getValue(string $key, mixed $default = null): mixed
    {
        $setting = $this->getByKey($key);

        if (!$setting) {
            return $default;
        }

        return $setting->value ?? $default;
    }

    public function setValue(string $key, mixed $value, ?string $group = null): SystemSetting
    {
        $setting = $this->getByKey($key);

        if ($setting) {
            $setting->setRawValue((string) $value);
            $setting->save();

            return $setting->fresh();
        }

        // Infer group from key prefix, default to 'general'
        $group ??= match (true) {
            str_starts_with($key, 'company_') => 'company',
            str_starts_with($key, 'maintenance_') => 'general',
            str_starts_with($key, 'branding_') => 'branding',
            str_starts_with($key, 'seo_') => 'seo',
            str_starts_with($key, 'payment_') => 'payment',
            str_starts_with($key, 'notification_') => 'notification',
            str_starts_with($key, 'backup_') => 'backup',
            default => 'general',
        };

        return $this->create([
            'setting_key' => $key,
            'setting_value' => (string) $value,
            'setting_group' => $group,
        ]);
    }

    public function getGroupCount(): array
    {
        return $this->newQuery()
            ->selectRaw('setting_group, COUNT(*) as count')
            ->groupBy('setting_group')
            ->pluck('count', 'setting_group')
            ->toArray();
    }

    public function getStatusCount(): array
    {
        return $this->newQuery()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function search(string $query): Collection
    {
        return $this->newQuery()
            ->where('setting_key', 'like', "%{$query}%")
            ->orWhere('setting_group', 'like', "%{$query}%")
            ->orWhere('remarks', 'like', "%{$query}%")
            ->orderBy('setting_key')
            ->get();
    }

    public function existsByKey(string $key, ?int $excludeId = null): bool
    {
        $query = $this->newQuery()->where('setting_key', $key);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
