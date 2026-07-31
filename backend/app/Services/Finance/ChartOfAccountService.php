<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\ChartOfAccount;
use App\Repositories\Finance\ChartOfAccountRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ChartOfAccountService extends BaseService implements ChartOfAccountServiceInterface
{
    protected string $moduleName = 'Finance';

    public function __construct(
        private readonly ChartOfAccountRepositoryInterface $repo,
    ) {}

    public function getPaginatedCategories(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function getActiveCategories(): Collection
    {
        return $this->repo->getAllActive();
    }

    public function getCategoryById(int $id): ?ChartOfAccount
    {
        return $this->repo->getById($id);
    }

    public function getCategoryByUuid(string $uuid): ?ChartOfAccount
    {
        return $this->repo->getByUuid($uuid);
    }

    public function createCategory(array $data): ChartOfAccount
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;
            $data['updated_by'] = $adminId;

            $category = $this->repo->create($data);

            $this->logInfo('Chart of account created', ['account_id' => $category->id, 'code' => $category->account_code]);

            return $category;
        });
    }

    public function updateCategory(int $id, array $data): ChartOfAccount
    {
        return $this->transaction(function () use ($id, $data) {
            $category = $this->repo->getById($id);

            if (! $category) {
                throw new \RuntimeException('Chart of account not found.');
            }

            $adminId = auth()->guard('admin')->id();
            $data['updated_by'] = $adminId;

            $this->repo->update($id, $data);

            $this->logInfo('Chart of account updated', ['account_id' => $id]);

            return $this->repo->getById($id);
        });
    }

    public function deleteCategory(int $id): bool
    {
        return $this->transaction(function () use ($id) {
            $category = $this->repo->getById($id);

            if (! $category) {
                throw new \RuntimeException('Chart of account not found.');
            }

            if ($category->is_system) {
                throw new \RuntimeException('System accounts cannot be deleted.');
            }

            $this->repo->delete($id);

            $this->logInfo('Chart of account deleted', ['account_id' => $id]);

            return true;
        });
    }

    public function getAccountTree(): Collection
    {
        return $this->repo->getAccountTree();
    }

    public function getByAccountType(string $type): Collection
    {
        return $this->repo->getByAccountType($type);
    }
}
