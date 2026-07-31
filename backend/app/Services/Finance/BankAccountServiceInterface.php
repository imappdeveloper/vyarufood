<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\BankAccount;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BankAccountServiceInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?BankAccount;
    public function getByUuid(string $uuid): ?BankAccount;
    public function create(array $data): BankAccount;
    public function update(int $id, array $data): BankAccount;
    public function delete(int $id): bool;
    public function getDefault(): ?BankAccount;
    public function getAllActive(): Collection;
}
