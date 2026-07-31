<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\BankReconciliation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BankReconciliationRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?BankReconciliation;
    public function getByUuid(string $uuid): ?BankReconciliation;
    public function create(array $data): BankReconciliation;
    public function update(int $id, array $data): BankReconciliation;
    public function delete(int $id): bool;
    public function getPendingForBankAccount(int $bankAccountId): Collection;
    public function completeReconciliation(int $id, int $reconciledBy): BankReconciliation;
}
