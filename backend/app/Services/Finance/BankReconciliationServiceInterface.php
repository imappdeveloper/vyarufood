<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\BankReconciliation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BankReconciliationServiceInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?BankReconciliation;
    public function getByUuid(string $uuid): ?BankReconciliation;
    public function create(array $data): BankReconciliation;
    public function completeReconciliation(string $uuid, int $reconciledBy): BankReconciliation;
}
