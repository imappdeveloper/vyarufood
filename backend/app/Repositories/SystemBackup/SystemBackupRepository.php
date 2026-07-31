<?php

declare(strict_types=1);

namespace App\Repositories\SystemBackup;

use App\Models\SystemBackup;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class SystemBackupRepository extends BaseRepository implements SystemBackupRepositoryInterface
{
    protected function model(): SystemBackup
    {
        return new SystemBackup;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->newQuery()->with('creator');

        if (!empty($filters['backup_type'])) {
            $query->where('backup_type', $filters['backup_type']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('backup_name', 'like', "%{$filters['search']}%")
                    ->orWhere('backup_type', 'like', "%{$filters['search']}%");
            });
        }

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->newQuery()->with('creator')->orderByDesc('created_at')->get();
    }

    public function findById(int $id): ?SystemBackup
    {
        return $this->newQuery()->with('creator')->find($id);
    }

    public function findByUuid(string $uuid): ?SystemBackup
    {
        return $this->newQuery()->with('creator')->where('uuid', $uuid)->first();
    }

    public function create(array $data): SystemBackup
    {
        $data['uuid'] = Str::uuid();
        $data['started_at'] = now();

        return $this->newQuery()->create($data);
    }

    public function update(SystemBackup $backup, array $data): SystemBackup
    {
        $backup->update($data);

        return $backup->fresh('creator');
    }

    public function delete(SystemBackup $backup): bool
    {
        if ($backup->file_path && file_exists(storage_path('app/' . $backup->file_path))) {
            unlink(storage_path('app/' . $backup->file_path));
        }

        return $backup->delete();
    }

    public function getCompletedByType(string $type): Collection
    {
        return $this->newQuery()
            ->where('backup_type', $type)
            ->where('status', 'completed')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getLatestCompleted(?string $type = null): ?SystemBackup
    {
        $query = $this->newQuery()
            ->where('status', 'completed');

        if ($type) {
            $query->where('backup_type', $type);
        }

        return $query->orderByDesc('completed_at')->first();
    }

    public function getStatusCount(): array
    {
        return $this->newQuery()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function getTypeCount(): array
    {
        return $this->newQuery()
            ->selectRaw('backup_type, COUNT(*) as count')
            ->groupBy('backup_type')
            ->pluck('count', 'backup_type')
            ->toArray();
    }

    public function getTotalSize(): int
    {
        return (int) $this->newQuery()
            ->where('status', 'completed')
            ->sum('file_size');
    }

    public function getOlderThan(int $days): Collection
    {
        return $this->newQuery()
            ->where('status', 'completed')
            ->where('created_at', '<', now()->subDays($days))
            ->get();
    }

    public function search(string $query): Collection
    {
        return $this->newQuery()
            ->where('backup_name', 'like', "%{$query}%")
            ->orWhere('backup_type', 'like', "%{$query}%")
            ->orderByDesc('created_at')
            ->get();
    }
}
