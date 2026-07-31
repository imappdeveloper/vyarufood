<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\GstTransaction;
use App\Repositories\Finance\GstTransactionRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GstService extends BaseService implements GstServiceInterface
{
    protected string $moduleName = 'Finance';

    public function __construct(
        private readonly GstTransactionRepositoryInterface $repo,
    ) {}

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repo->getPaginated($filters, $perPage);
    }

    public function addEntry(array $data): GstTransaction
    {
        return $this->transaction(function () use ($data) {
            $adminId = auth()->guard('admin')->id();
            $data['created_by'] = $adminId;

            if (! isset($data['total_tax'])) {
                $data['total_tax'] = ($data['cgst_amount'] ?? 0)
                    + ($data['sgst_amount'] ?? 0)
                    + ($data['igst_amount'] ?? 0)
                    + ($data['cess_amount'] ?? 0);
            }

            if (! isset($data['total_amount'])) {
                $data['total_amount'] = ($data['taxable_amount'] ?? 0) + $data['total_tax'];
            }

            $entry = $this->repo->create($data);

            $this->logInfo('GST transaction entry added', ['gst_id' => $entry->id, 'type' => $data['transaction_type'] ?? null]);

            return $entry;
        });
    }

    public function getGstSummary(int $financialYearId, ?string $fromDate, ?string $toDate): array
    {
        return $this->repo->getGstSummary($financialYearId, $fromDate, $toDate);
    }

    public function getInputTax(): array
    {
        return $this->repo->getInputTax();
    }

    public function getOutputTax(): array
    {
        return $this->repo->getOutputTax();
    }
}
