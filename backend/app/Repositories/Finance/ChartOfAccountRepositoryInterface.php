<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\ChartOfAccount;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ChartOfAccountRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getAllActive(): Collection;
    public function getById(int $id): ?ChartOfAccount;
    public function getByUuid(string $uuid): ?ChartOfAccount;
    public function create(array $data): ChartOfAccount;
    public function update(int $id, array $data): ChartOfAccount;
    public function delete(int $id): bool;
    public function getByAccountType(string $type): Collection;
    public function getAccountTree(): Collection;
    public function updateBalance(int $id, float $debitAmount, float $creditAmount): void;
}
