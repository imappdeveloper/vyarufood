<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\FinancialYear;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class FinancialYearRepository extends BaseRepository implements FinancialYearRepositoryInterface
{
    protected function model(): FinancialYear
    {
        return new FinancialYear;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where('year_name', 'like', "%{$s}%")
            )
            ->when($filters['is_current'] ?? null, fn (Builder $q, $v) => $q->where('is_current', $v))
            ->when($filters['is_closed'] ?? null, fn (Builder $q, $v) => $q->where('is_closed', $v));

        $sortBy = $filters['sort_by'] ?? 'start_date';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowed = ['year_name', 'start_date', 'end_date', 'is_current', 'is_closed', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderByDesc('start_date');
        }

        return $query->paginate($perPage);
    }

    public function getById(int $id): ?FinancialYear
    {
        return $this->model->with([
            'journalEntries', 'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?FinancialYear
    {
        return $this->model->where('uuid', $uuid)->with([
            'journalEntries', 'createdBy', 'updatedBy',
        ])->first();
    }

    public function create(array $data): FinancialYear
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): FinancialYear
    {
        $record = $this->model->findOrFail($id);
        $record->update($data);
        return $record->fresh();
    }

    public function delete(int $id): bool
    {
        $record = $this->model->find($id);
        return $record ? $record->delete() : false;
    }

    public function getCurrent(): ?FinancialYear
    {
        return $this->model->where('is_current', true)
            ->where('is_closed', false)
            ->first();
    }

    public function closeYear(int $id, int $closedBy, ?string $remarks): FinancialYear
    {
        $record = $this->model->findOrFail($id);

        if ($record->is_closed) {
            throw new \InvalidArgumentException('Financial year is already closed.');
        }

        $record->update([
            'is_closed' => true,
            'is_current' => false,
            'closed_at' => now(),
            'closed_by' => $closedBy,
        ]);

        return $record->fresh();
    }
}
