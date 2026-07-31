<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\GstTransaction;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class GstTransactionRepository extends BaseRepository implements GstTransactionRepositoryInterface
{
    protected function model(): GstTransaction
    {
        return new GstTransaction;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['journalEntry', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('invoice_number', 'like', "%{$s}%")
                       ->orWhere('party_name', 'like', "%{$s}%")
                       ->orWhere('party_gstin', 'like', "%{$s}%")
                       ->orWhere('hsn_code', 'like', "%{$s}%");
                })
            )
            ->when($filters['transaction_type'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_type', $v))
            ->when($filters['gstin_type'] ?? null, fn (Builder $q, string $v) => $q->where('gstin_type', $v))
            ->when($filters['filing_period'] ?? null, fn (Builder $q, string $v) => $q->where('filing_period', $v))
            ->when($filters['filing_year'] ?? null, fn (Builder $q, $v) => $q->where('filing_year', $v))
            ->when($filters['is_reconciled'] ?? null, fn (Builder $q, $v) => $q->where('is_reconciled', $v))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->where('transaction_date', '<=', $v));

        $sortBy = $filters['sort_by'] ?? 'transaction_date';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowed = ['transaction_date', 'invoice_date', 'party_name', 'taxable_amount', 'total_tax', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderByDesc('transaction_date');
        }

        return $query->paginate($perPage);
    }

    public function addEntry(array $data): GstTransaction
    {
        return $this->model->create($data);
    }

    public function getGstSummary(int $financialYearId, string $type): array
    {
        $query = $this->model->query()
            ->select(
                'filing_period',
                DB::raw('COUNT(*) as transaction_count'),
                DB::raw('SUM(taxable_amount) as total_taxable_amount'),
                DB::raw('SUM(cgst_amount) as total_cgst'),
                DB::raw('SUM(sgst_amount) as total_sgst'),
                DB::raw('SUM(igst_amount) as total_igst'),
                DB::raw('SUM(cess_amount) as total_cess'),
                DB::raw('SUM(total_tax) as total_tax'),
                DB::raw('SUM(total_amount) as total_amount')
            )
            ->where('gstin_type', $type)
            ->where('filing_year', $financialYearId)
            ->groupBy('filing_period')
            ->orderBy('filing_period', 'asc');

        $periodWise = $query->get()->toArray();

        $totalsQuery = $this->model->query()
            ->select(
                DB::raw('COUNT(*) as transaction_count'),
                DB::raw('SUM(taxable_amount) as total_taxable_amount'),
                DB::raw('SUM(cgst_amount) as total_cgst'),
                DB::raw('SUM(sgst_amount) as total_sgst'),
                DB::raw('SUM(igst_amount) as total_igst'),
                DB::raw('SUM(cess_amount) as total_cess'),
                DB::raw('SUM(total_tax) as total_tax'),
                DB::raw('SUM(total_amount) as total_amount')
            )
            ->where('gstin_type', $type)
            ->where('filing_year', $financialYearId);

        $totals = (array) $totalsQuery->first();

        return [
            'type' => $type,
            'financial_year_id' => $financialYearId,
            'totals' => [
                'transaction_count' => (int) ($totals['transaction_count'] ?? 0),
                'total_taxable_amount' => (float) ($totals['total_taxable_amount'] ?? 0),
                'total_cgst' => (float) ($totals['total_cgst'] ?? 0),
                'total_sgst' => (float) ($totals['total_sgst'] ?? 0),
                'total_igst' => (float) ($totals['total_igst'] ?? 0),
                'total_cess' => (float) ($totals['total_cess'] ?? 0),
                'total_tax' => (float) ($totals['total_tax'] ?? 0),
                'total_amount' => (float) ($totals['total_amount'] ?? 0),
            ],
            'period_wise' => $periodWise,
        ];
    }
}
