<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\ChartOfAccount;
use App\Models\JournalEntry;
use App\Models\JournalEntryLine;
use App\Support\BaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class JournalEntryRepository extends BaseRepository implements JournalEntryRepositoryInterface
{
    protected function model(): JournalEntry
    {
        return new JournalEntry;
    }

    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator
    {
        $perPage = min($perPage, 100);

        $query = $this->newQuery()
            ->with(['financialYear', 'createdBy'])
            ->when($filters['search'] ?? null, fn (Builder $q, string $s) =>
                $q->where(function (Builder $q2) use ($s) {
                    $q2->where('journal_number', 'like', "%{$s}%")
                       ->orWhere('description', 'like', "%{$s}%");
                })
            )
            ->when($filters['financial_year_id'] ?? null, fn (Builder $q, $v) => $q->where('financial_year_id', $v))
            ->when($filters['entry_type'] ?? null, fn (Builder $q, string $v) => $q->where('entry_type', $v))
            ->when($filters['posting_status'] ?? null, fn (Builder $q, $v) => $q->where('posting_status', $v))
            ->when($filters['reference_type'] ?? null, fn (Builder $q, string $v) => $q->where('reference_type', $v))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $v) => $q->where('journal_date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $v) => $q->where('journal_date', '<=', $v));

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $allowed = ['journal_number', 'journal_date', 'total_debit', 'total_credit', 'posting_status', 'created_at'];
        if (in_array($sortBy, $allowed)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderByDesc('created_at');
        }

        return $query->paginate($perPage);
    }

    public function getById(int $id): ?JournalEntry
    {
        return $this->model->with([
            'financialYear', 'lines.account', 'postedBy', 'createdBy', 'updatedBy',
        ])->find($id);
    }

    public function getByUuid(string $uuid): ?JournalEntry
    {
        return $this->model->where('uuid', $uuid)->with([
            'financialYear', 'lines.account', 'postedBy', 'createdBy', 'updatedBy',
        ])->first();
    }

    public function create(array $data): JournalEntry
    {
        return DB::transaction(function () use ($data) {
            $lines = $data['lines'] ?? [];
            unset($data['lines']);

            $entry = $this->model->create($data);

            foreach ($lines as $index => $line) {
                $entry->lines()->create([
                    'account_id' => $line['account_id'],
                    'line_number' => $index + 1,
                    'description' => $line['description'] ?? null,
                    'debit_amount' => $line['debit_amount'] ?? 0,
                    'credit_amount' => $line['credit_amount'] ?? 0,
                    'cost_center' => $line['cost_center'] ?? null,
                    'project_id' => $line['project_id'] ?? null,
                ]);
            }

            return $entry->fresh(['lines.account']);
        });
    }

    public function postJournal(int $id, int $postedBy): JournalEntry
    {
        return DB::transaction(function () use ($id, $postedBy) {
            $entry = $this->model->with('lines.account')->findOrFail($id);

            $totalDebit = $entry->lines->sum('debit_amount');
            $totalCredit = $entry->lines->sum('credit_amount');

            if (round((float) $totalDebit, 2) !== round((float) $totalCredit, 2)) {
                throw new \InvalidArgumentException('Debit and credit totals must be equal.');
            }

            $entry->update([
                'total_debit' => $totalDebit,
                'total_credit' => $totalCredit,
                'posting_status' => 'posted',
                'posted_at' => now(),
                'posted_by' => $postedBy,
            ]);

            foreach ($entry->lines as $line) {
                $account = $line->account;
                $debitAmount = (float) $line->debit_amount;
                $creditAmount = (float) $line->credit_amount;
                $newBalance = (float) $account->current_balance + $debitAmount - $creditAmount;
                $account->update(['current_balance' => $newBalance]);
            }

            return $entry->fresh(['lines.account', 'postedBy']);
        });
    }

    public function reverseJournal(int $id, string $reason): JournalEntry
    {
        return DB::transaction(function () use ($id, $reason) {
            $original = $this->model->with('lines.account')->findOrFail($id);

            if ($original->posting_status !== 'posted') {
                throw new \InvalidArgumentException('Only posted journals can be reversed.');
            }

            foreach ($original->lines as $line) {
                $account = $line->account;
                $debitAmount = (float) $line->debit_amount;
                $creditAmount = (float) $line->credit_amount;
                $newBalance = (float) $account->current_balance - $debitAmount + $creditAmount;
                $account->update(['current_balance' => $newBalance]);
            }

            $reversalLines = $original->lines->map(fn ($line) => [
                'account_id' => $line->account_id,
                'description' => $line->description,
                'debit_amount' => $line->credit_amount,
                'credit_amount' => $line->debit_amount,
                'cost_center' => $line->cost_center,
                'project_id' => $line->project_id,
            ])->toArray();

            $reversal = $this->model->create([
                'journal_number' => $this->getNextJournalNumber(),
                'financial_year_id' => $original->financial_year_id,
                'journal_date' => now()->toDateString(),
                'entry_type' => 'reversal',
                'reference_type' => $original->reference_type,
                'reference_id' => $original->reference_id,
                'description' => "Reversal of {$original->journal_number}: {$reason}",
                'total_debit' => $original->total_credit,
                'total_credit' => $original->total_debit,
                'posting_status' => 'posted',
                'posted_at' => now(),
                'posted_by' => auth()->id(),
            ]);

            foreach ($reversalLines as $index => $line) {
                $reversal->lines()->create([
                    'account_id' => $line['account_id'],
                    'line_number' => $index + 1,
                    'description' => $line['description'],
                    'debit_amount' => $line['debit_amount'],
                    'credit_amount' => $line['credit_amount'],
                    'cost_center' => $line['cost_center'],
                    'project_id' => $line['project_id'],
                ]);

                $account = ChartOfAccount::findOrFail($line['account_id']);
                $debitAmount = (float) $line['debit_amount'];
                $creditAmount = (float) $line['credit_amount'];
                $newBalance = (float) $account->current_balance + $debitAmount - $creditAmount;
                $account->update(['current_balance' => $newBalance]);
            }

            return $reversal->fresh(['lines.account', 'postedBy']);
        });
    }

    public function getByFinancialYear(int $fyId): Collection
    {
        return $this->model->with(['lines.account', 'createdBy'])
            ->where('financial_year_id', $fyId)
            ->orderByDesc('journal_date')
            ->get();
    }

    public function getByReference(string $referenceType, int $referenceId): ?JournalEntry
    {
        return $this->model->with(['lines.account'])
            ->where('reference_type', $referenceType)
            ->where('reference_id', $referenceId)
            ->first();
    }

    public function getNextJournalNumber(): string
    {
        $date = now()->format('Ym');
        $prefix = "JRN-{$date}-";

        $last = $this->model->where('journal_number', 'LIKE', "{$prefix}%")
            ->orderByDesc('journal_number')
            ->first();

        if ($last) {
            $lastNumber = (int) substr($last->journal_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }

        return $prefix . $nextNumber;
    }

    public function getTrialBalance(int $financialYearId, ?string $asOfDate): array
    {
        $query = JournalEntryLine::query()
            ->select(
                'account_id',
                DB::raw('SUM(debit_amount) as total_debit'),
                DB::raw('SUM(credit_amount) as total_credit')
            )
            ->join('journal_entries', 'journal_entry_lines.journal_entry_id', '=', 'journal_entries.id')
            ->where('journal_entries.financial_year_id', $financialYearId)
            ->where('journal_entries.posting_status', 'posted');

        if ($asOfDate) {
            $query->where('journal_entries.journal_date', '<=', $asOfDate);
        }

        $lines = $query->groupBy('account_id')->get();

        $accounts = ChartOfAccount::whereIn('id', $lines->pluck('account_id'))
            ->get()
            ->keyBy('id');

        $trialBalance = [];
        $totalDebit = 0;
        $totalCredit = 0;

        foreach ($lines as $line) {
            $account = $accounts->get($line->account_id);
            if (!$account) {
                continue;
            }

            $debit = (float) $line->total_debit;
            $credit = (float) $line->total_credit;

            $trialBalance[] = [
                'account_id' => $line->account_id,
                'account_code' => $account->account_code,
                'account_name' => $account->account_name,
                'account_type' => $account->account_type,
                'debit' => $debit,
                'credit' => $credit,
            ];

            $totalDebit += $debit;
            $totalCredit += $credit;
        }

        return [
            'accounts' => $trialBalance,
            'total_debit' => $totalDebit,
            'total_credit' => $totalCredit,
            'is_balanced' => round($totalDebit, 2) === round($totalCredit, 2),
        ];
    }

    public function getProfitAndLoss(int $financialYearId, ?string $fromDate, ?string $toDate): array
    {
        $query = JournalEntryLine::query()
            ->select(
                'account_id',
                DB::raw('SUM(debit_amount) as total_debit'),
                DB::raw('SUM(credit_amount) as total_credit')
            )
            ->join('journal_entries', 'journal_entry_lines.journal_entry_id', '=', 'journal_entries.id')
            ->join('chart_of_accounts', 'journal_entry_lines.account_id', '=', 'chart_of_accounts.id')
            ->where('journal_entries.financial_year_id', $financialYearId)
            ->where('journal_entries.posting_status', 'posted')
            ->whereIn('chart_of_accounts.account_type', ['income', 'expense']);

        if ($fromDate) {
            $query->where('journal_entries.journal_date', '>=', $fromDate);
        }
        if ($toDate) {
            $query->where('journal_entries.journal_date', '<=', $toDate);
        }

        $lines = $query->groupBy('account_id')->get();

        $accountIds = $lines->pluck('account_id');
        $accounts = ChartOfAccount::whereIn('id', $accountIds)->get()->keyBy('id');

        $income = 0;
        $expenses = 0;
        $incomeItems = [];
        $expenseItems = [];

        foreach ($lines as $line) {
            $account = $accounts->get($line->account_id);
            if (!$account) {
                continue;
            }

            $netAmount = (float) $line->total_credit - (float) $line->total_debit;

            if ($account->account_type === 'income') {
                $income += $netAmount;
                $incomeItems[] = [
                    'account_id' => $line->account_id,
                    'account_code' => $account->account_code,
                    'account_name' => $account->account_name,
                    'amount' => $netAmount,
                ];
            } else {
                $expenses += abs($netAmount);
                $expenseItems[] = [
                    'account_id' => $line->account_id,
                    'account_code' => $account->account_code,
                    'account_name' => $account->account_name,
                    'amount' => abs($netAmount),
                ];
            }
        }

        return [
            'income' => $incomeItems,
            'total_income' => $income,
            'expenses' => $expenseItems,
            'total_expenses' => $expenses,
            'net_profit' => $income - $expenses,
        ];
    }

    public function getBalanceSheet(int $financialYearId, ?string $asOfDate): array
    {
        $query = JournalEntryLine::query()
            ->select(
                'account_id',
                DB::raw('SUM(debit_amount) as total_debit'),
                DB::raw('SUM(credit_amount) as total_credit')
            )
            ->join('journal_entries', 'journal_entry_lines.journal_entry_id', '=', 'journal_entries.id')
            ->join('chart_of_accounts', 'journal_entry_lines.account_id', '=', 'chart_of_accounts.id')
            ->where('journal_entries.financial_year_id', $financialYearId)
            ->where('journal_entries.posting_status', 'posted')
            ->whereIn('chart_of_accounts.account_type', ['asset', 'liability', 'equity']);

        if ($asOfDate) {
            $query->where('journal_entries.journal_date', '<=', $asOfDate);
        }

        $lines = $query->groupBy('account_id')->get();

        $accountIds = $lines->pluck('account_id');
        $accounts = ChartOfAccount::whereIn('id', $accountIds)->get()->keyBy('id');

        $assets = 0;
        $liabilities = 0;
        $equity = 0;
        $assetItems = [];
        $liabilityItems = [];
        $equityItems = [];

        foreach ($lines as $line) {
            $account = $accounts->get($line->account_id);
            if (!$account) {
                continue;
            }

            $netAmount = (float) $line->total_debit - (float) $line->total_credit;

            $item = [
                'account_id' => $line->account_id,
                'account_code' => $account->account_code,
                'account_name' => $account->account_name,
                'amount' => abs($netAmount),
            ];

            switch ($account->account_type) {
                case 'asset':
                    $assets += abs($netAmount);
                    $assetItems[] = $item;
                    break;
                case 'liability':
                    $liabilities += abs($netAmount);
                    $liabilityItems[] = $item;
                    break;
                case 'equity':
                    $equity += abs($netAmount);
                    $equityItems[] = $item;
                    break;
            }
        }

        return [
            'assets' => $assetItems,
            'total_assets' => $assets,
            'liabilities' => $liabilityItems,
            'total_liabilities' => $liabilities,
            'equity' => $equityItems,
            'total_equity' => $equity,
            'is_balanced' => round($assets, 2) === round($liabilities + $equity, 2),
        ];
    }

    public function getCashFlow(int $financialYearId, ?string $fromDate, ?string $toDate): array
    {
        $cashAccountCodes = ['1010', '1020'];

        $query = JournalEntryLine::query()
            ->select(
                'account_id',
                DB::raw('SUM(debit_amount) as total_debit'),
                DB::raw('SUM(credit_amount) as total_credit')
            )
            ->join('journal_entries', 'journal_entry_lines.journal_entry_id', '=', 'journal_entries.id')
            ->join('chart_of_accounts', 'journal_entry_lines.account_id', '=', 'chart_of_accounts.id')
            ->where('journal_entries.financial_year_id', $financialYearId)
            ->where('journal_entries.posting_status', 'posted')
            ->whereIn('chart_of_accounts.account_code', $cashAccountCodes);

        if ($fromDate) {
            $query->where('journal_entries.journal_date', '>=', $fromDate);
        }
        if ($toDate) {
            $query->where('journal_entries.journal_date', '<=', $toDate);
        }

        $lines = $query->groupBy('account_id')->get();

        $totalInflow = 0;
        $totalOutflow = 0;
        $movements = [];

        foreach ($lines as $line) {
            $debit = (float) $line->total_debit;
            $credit = (float) $line->total_credit;

            $totalInflow += $debit;
            $totalOutflow += $credit;

            $movements[] = [
                'account_id' => $line->account_id,
                'inflow' => $debit,
                'outflow' => $credit,
                'net' => $debit - $credit,
            ];
        }

        return [
            'movements' => $movements,
            'total_inflow' => $totalInflow,
            'total_outflow' => $totalOutflow,
            'net_cash_flow' => $totalInflow - $totalOutflow,
            'operating' => $totalInflow - $totalOutflow,
            'investing' => 0,
            'financing' => 0,
        ];
    }
}
