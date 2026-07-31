<?php

declare(strict_types=1);

namespace App\Repositories\Customer;

use App\DTOs\Customer\CustomerDTO;
use App\Enums\StatusEnum;
use App\Models\Customer;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerRepository extends BaseRepository implements CustomerRepositoryInterface
{
    protected function model(): Customer
    {
        return new Customer;
    }

    public function getPaginated(array $filters, int $perPage, string $sort, string $order): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['country', 'state', 'city', 'area'])
            ->search($filters['search'] ?? null);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_blocked']) && $filters['is_blocked'] !== '') {
            $query->where('is_blocked', filter_var($filters['is_blocked'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['gender'])) {
            $query->where('gender', $filters['gender']);
        }

        if (! empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (! empty($filters['email_verified'])) {
            $query->where('email_verified', filter_var($filters['email_verified'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['phone_verified'])) {
            $query->where('phone_verified', filter_var($filters['phone_verified'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to'] . ' 23:59:59');
        }

        $perPage = min($perPage, 100);

        return $query->orderBy($sort, $order)->paginate($perPage);
    }

    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->with(['country', 'state', 'city', 'area'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActive(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->where('status', StatusEnum::Active)
            ->where('is_blocked', false)
            ->orderBy('first_name', 'asc')
            ->get();
    }

    public function findById(int $id): ?Customer
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Customer
    {
        return $this->model->where('uuid', $uuid)
            ->with(['country', 'state', 'city', 'area', 'referrer', 'referrals'])
            ->first();
    }

    public function findByEmail(string $email): ?Customer
    {
        return $this->model->where('email', $email)->first();
    }

    public function findByPhone(string $phone): ?Customer
    {
        return $this->model->where('phone', $phone)->first();
    }

    public function findByReferralCode(string $referralCode): ?Customer
    {
        return $this->model->where('referral_code', $referralCode)->first();
    }

    public function create(CustomerDTO $dto, int $createdBy): Customer
    {
        $data = $dto->toArray();
        $data['created_by'] = $createdBy;
        $data['updated_by'] = $createdBy;

        if (empty($data['referral_code'])) {
            $data['referral_code'] = $this->generateReferralCode($data['first_name'] ?? '', $data['last_name'] ?? '');
        }

        if (! empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        return $this->model->create($data);
    }

    public function update(Customer $customer, array $data, int $updatedBy): Customer
    {
        $data['updated_by'] = $updatedBy;

        if (isset($data['password']) && $data['password'] !== null) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $customer->update($data);

        return $customer->fresh();
    }

    public function softDelete(Customer $customer, int $deletedBy): bool
    {
        $customer->deleted_by = $deletedBy;
        $customer->save();

        return $customer->delete();
    }

    public function restore(int $id): bool
    {
        $customer = $this->model->withTrashed()->find($id);

        if (! $customer) {
            return false;
        }

        return $customer->restore();
    }

    public function forceDelete(Customer $customer): bool
    {
        return $customer->forceDelete();
    }

    public function setStatus(Customer $customer, string $status): Customer
    {
        $customer->status = $status;
        $customer->save();

        return $customer->fresh();
    }

    public function block(Customer $customer, ?string $reason = null): Customer
    {
        $customer->is_blocked = true;
        $customer->block_reason = $reason;
        $customer->status = StatusEnum::Suspended;
        $customer->save();

        return $customer->fresh();
    }

    public function unblock(Customer $customer): Customer
    {
        $customer->is_blocked = false;
        $customer->block_reason = null;
        $customer->status = StatusEnum::Active;
        $customer->save();

        return $customer->fresh();
    }

    public function bulkDelete(array $ids): int
    {
        return $this->model->whereIn('id', $ids)->delete();
    }

    public function bulkSetStatus(array $ids, string $status): int
    {
        return $this->model->whereIn('id', $ids)->update(['status' => $status]);
    }

    public function import(array $rows): array
    {
        $successes = 0;
        $failures = [];
        $createdBy = auth()->guard('admin')->id();

        foreach ($rows as $index => $row) {
            try {
                $dto = CustomerDTO::fromArray($row);
                $this->create($dto, $createdBy);
                $successes++;
            } catch (\Exception $e) {
                $failures[] = [
                    'row' => $index + 1,
                    'error' => $e->getMessage(),
                    'data' => $row,
                ];
            }
        }

        return [
            'successes' => $successes,
            'failures' => $failures,
            'total' => count($rows),
        ];
    }

    public function getForExport(?array $filters = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = $this->model->query()->with(['country', 'state', 'city', 'area']);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        return $query->orderBy('first_name', 'asc')->get();
    }

    public function countByStatus(): array
    {
        return $this->model->query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    public function countBlocked(): int
    {
        return $this->model->query()->where('is_blocked', true)->count();
    }

    public function hasOrders(int $customerId): bool
    {
        return false;
    }

    public function search(?string $search): \Illuminate\Database\Eloquent\Collection
    {
        return $this->model->query()
            ->search($search)
            ->orderBy('first_name', 'asc')
            ->limit(25)
            ->get();
    }

    private function generateReferralCode(string $firstName, string $lastName): string
    {
        $prefix = strtoupper(substr($firstName, 0, 2) . substr($lastName, 0, 2));
        if (strlen($prefix) < 4) {
            $prefix = str_pad($prefix, 4, 'X');
        }

        do {
            $code = $prefix . strtoupper(substr(uniqid(), -6));
        } while ($this->findByReferralCode($code));

        return $code;
    }
}
