<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\BankAccount;
use App\Repositories\Finance\BankAccountRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BankAccountService extends BaseService implements BankAccountServiceInterface
{
    protected string $moduleName = 'Finance';

    public function __construct(
        private readonly BankAccountRepositoryInterface $repo,
    ) {}

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getById(int $id): ?BankAccount
    {
        return $this->repo->getById($id);
    }

    public function getByUuid(string $uuid): ?BankAccount
    {
        return $this->repo->getByUuid($uuid);
    }

    public function create(array $data): BankAccount
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;
            $data['updated_by'] = $adminId;

            if (! empty($data['is_default']) && $data['is_default']) {
                BankAccount::where('is_default', true)->update(['is_default' => false]);
            }

            $account = $this->repo->create($data);

            $this->logInfo('Bank account created', ['bank_account_id' => $account->id, 'bank_name' => $account->bank_name]);

            return $account;
        });
    }

    public function update(int $id, array $data): BankAccount
    {
        return $this->transaction(function () use ($id, $data) {
            $account = $this->repo->getById($id);

            if (! $account) {
                throw new \RuntimeException('Bank account not found.');
            }

            $adminId = auth()->guard('admin')->id();
            $data['updated_by'] = $adminId;

            if (! empty($data['is_default']) && $data['is_default']) {
                BankAccount::where('is_default', true)
                    ->where('id', '!=', $id)
                    ->update(['is_default' => false]);
            }

            $this->repo->update($id, $data);

            $this->logInfo('Bank account updated', ['bank_account_id' => $id]);

            return $this->repo->getById($id);
        });
    }

    public function delete(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $account = $this->repo->getById($id);

            if (! $account) {
                throw new \RuntimeException('Bank account not found.');
            }

            $this->repo->delete($id);

            $this->logInfo('Bank account deleted', ['bank_account_id' => $id]);

            return true;
        });
    }

    public function getDefault(): ?BankAccount
    {
        return $this->repo->getDefault();
    }

    public function getAllActive(): Collection
    {
        return $this->repo->getAllActive();
    }
}
