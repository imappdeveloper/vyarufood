<?php

declare(strict_types=1);

namespace App\Services\SystemSetting;

use App\Models\SystemSetting;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface SystemSettingServiceInterface
{
    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator;

    public function getAll(): Collection;

    public function getByGroup(string $group): Collection;

    public function getByUuid(string $uuid): ?SystemSetting;

    public function create(array $data): SystemSetting;

    public function update(SystemSetting $setting, array $data): SystemSetting;

    public function bulkUpdate(array $settings): array;

    public function delete(SystemSetting $setting): bool;

    public function getValue(string $key, mixed $default = null): mixed;

    public function setValue(string $key, mixed $value, ?string $group = null): SystemSetting;

    public function getGroupCount(): array;

    public function getStatusCount(): array;

    public function search(string $query): Collection;

    public function getAutoloadedSettings(): Collection;

    public function refreshCache(): void;
}
