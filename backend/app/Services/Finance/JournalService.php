<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\JournalEntry;
use App\Repositories\Finance\ChartOfAccountRepositoryInterface;
use App\Repositories\Finance\JournalEntryRepositoryInterface;
use App\Repositories\Finance\FinancialYearRepositoryInterface;
use App\Support\BaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class JournalService extends BaseService implements JournalServiceInterface
{
    protected string $moduleName = 'Finance';

    public function __construct(
        private readonly JournalEntryRepositoryInterface $journalRepo,
        private readonly ChartOfAccountRepositoryInterface $chartRepo,
        private readonly FinancialYearRepositoryInterface $fyRepo,
    ) {}

    public function getPaginatedJournals(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->journalRepo->getPaginated($filters, $perPage);
    }

    public function getJournalById(int $id): ?JournalEntry
    {
        return $this->journalRepo->getById($id);
    }

    public function getJournalByUuid(string $uuid): ?JournalEntry
    {
        return $this->journalRepo->getByUuid($uuid);
    }

    public function createJournal(array $data): JournalEntry
    {
        return $this->transaction(function () use ($data) {
            $lines = $data['lines'] ?? [];

            if (empty($lines)) {
                throw new \RuntimeException('Journal must have at least one line.');
            }

            $totalDebit = array_sum(array_map(fn ($line) => (float) ($line['debit_amount'] ?? 0), $lines));
            $totalCredit = array_sum(array_map(fn ($line) => (float) ($line['credit_amount'] ?? 0), $lines));

            if (abs($totalDebit - $totalCredit) > 0.01) {
                throw new \RuntimeException('Total debit and credit must be equal. Debit: ' . $totalDebit . ', Credit: ' . $totalCredit);
            }

            $financialYear = $this->fyRepo->getCurrent();

            if (! $financialYear) {
                throw new \RuntimeException('No active financial year found.');
            }

            if ($financialYear->is_closed) {
                throw new \RuntimeException('Cannot create journal in a closed financial year.');
            }

            $adminId = auth()->guard('admin')->id();

            $journalData = [
                'journal_number' => $this->journalRepo->getNextJournalNumber(),
                'financial_year_id' => $financialYear->id,
                'journal_date' => $data['journal_date'] ?? now()->toDateString(),
                'entry_type' => $data['entry_type'] ?? 'general',
                'reference_type' => $data['reference_type'] ?? null,
                'reference_id' => $data['reference_id'] ?? null,
                'description' => $data['description'] ?? null,
                'total_debit' => round($totalDebit, 2),
                'total_credit' => round($totalCredit, 2),
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ];

            $journal = $this->journalRepo->create($journalData);

            foreach ($lines as $index => $line) {
                $lineData = [
                    'journal_entry_id' => $journal->id,
                    'account_id' => $line['account_id'],
                    'line_number' => $index + 1,
                    'description' => $line['description'] ?? null,
                    'debit_amount' => round((float) ($line['debit_amount'] ?? 0), 2),
                    'credit_amount' => round((float) ($line['credit_amount'] ?? 0), 2),
                    'cost_center' => $line['cost_center'] ?? null,
                    'project_id' => $line['project_id'] ?? null,
                ];

                \App\Models\JournalEntryLine::create($lineData);

                $debitAmt = (float) ($line['debit_amount'] ?? 0);
                $creditAmt = (float) ($line['credit_amount'] ?? 0);

                if ($debitAmt > 0 || $creditAmt > 0) {
                    $this->chartRepo->updateBalance($line['account_id'], $debitAmt, $creditAmt);
                }
            }

            $this->logInfo('Journal created', ['journal_id' => $journal->id, 'number' => $journal->journal_number]);

            return $journal->fresh(['lines.account', 'financialYear']);
        });
    }

    public function postJournal(string $uuid, int $postedBy): JournalEntry
    {
        return $this->transaction(function () use ($uuid, $postedBy) {
            $journal = $this->journalRepo->getByUuid($uuid);

            if (! $journal) {
                throw new \RuntimeException('Journal entry not found.');
            }

            if ($journal->posting_status === 'posted') {
                throw new \RuntimeException('Journal entry is already posted.');
            }

            if (abs($journal->total_debit - $journal->total_credit) > 0.01) {
                throw new \RuntimeException('Journal debit and credit are not balanced.');
            }

            $this->journalRepo->postJournal($journal->id, $postedBy);

            $this->logInfo('Journal posted', ['journal_id' => $journal->id, 'posted_by' => $postedBy]);

            return $this->journalRepo->getById($journal->id)->fresh(['lines.account', 'financialYear']);
        });
    }

    public function reverseJournal(string $uuid, string $reason): JournalEntry
    {
        return $this->transaction(function () use ($uuid, $reason) {
            $journal = $this->journalRepo->getByUuid($uuid);

            if (! $journal) {
                throw new \RuntimeException('Journal entry not found.');
            }

            if ($journal->posting_status !== 'posted') {
                throw new \RuntimeException('Only posted journals can be reversed.');
            }

            $reversed = $this->journalRepo->reverseJournal($journal->id, $reason);

            $this->logInfo('Journal reversed', ['journal_id' => $journal->id, 'reason' => $reason]);

            return $reversed->fresh(['lines.account', 'financialYear']);
        });
    }

    public function bulkPost(array $ids, int $postedBy): int
    {
        return $this->transaction(function () use ($ids, $postedBy) {
            $postedCount = 0;

            foreach ($ids as $id) {
                $journal = $this->journalRepo->getById($id);

                if (! $journal || $journal->posting_status === 'posted') {
                    continue;
                }

                if (abs($journal->total_debit - $journal->total_credit) > 0.01) {
                    continue;
                }

                $this->journalRepo->postJournal($journal->id, $postedBy);
                $postedCount++;
            }

            $this->logInfo('Bulk journals posted', ['count' => $postedCount]);

            return $postedCount;
        });
    }

    public function getTrialBalance(int $financialYearId, ?string $asOfDate): array
    {
        return $this->journalRepo->getTrialBalance($financialYearId, $asOfDate);
    }

    public function getProfitAndLoss(int $financialYearId, ?string $fromDate, ?string $toDate): array
    {
        return $this->journalRepo->getProfitAndLoss($financialYearId, $fromDate, $toDate);
    }

    public function getBalanceSheet(int $financialYearId, ?string $asOfDate): array
    {
        return $this->journalRepo->getBalanceSheet($financialYearId, $asOfDate);
    }

    public function getCashFlow(int $financialYearId, ?string $fromDate, ?string $toDate): array
    {
        return $this->journalRepo->getCashFlow($financialYearId, $fromDate, $toDate);
    }

    public function getDashboardStats(): array
    {
        $now = now();

        $totalJournals = JournalEntry::whereYear('journal_date', $now->year)
            ->whereMonth('journal_date', $now->month)
            ->count();

        $postedCount = JournalEntry::whereYear('journal_date', $now->year)
            ->whereMonth('journal_date', $now->month)
            ->where('posting_status', 'posted')
            ->count();

        $draftCount = JournalEntry::whereYear('journal_date', $now->year)
            ->whereMonth('journal_date', $now->month)
            ->where('posting_status', '!=', 'posted')
            ->count();

        $totalDebit = (float) JournalEntry::whereYear('journal_date', $now->year)
            ->whereMonth('journal_date', $now->month)
            ->sum('total_debit');

        $totalCredit = (float) JournalEntry::whereYear('journal_date', $now->year)
            ->whereMonth('journal_date', $now->month)
            ->sum('total_credit');

        $pendingCount = JournalEntry::where('posting_status', '!=', 'posted')->count();

        return [
            'total_journals_this_month' => $totalJournals,
            'posted_count' => $postedCount,
            'draft_count' => $draftCount,
            'total_debit' => round($totalDebit, 2),
            'total_credit' => round($totalCredit, 2),
            'pending_count' => $pendingCount,
        ];
    }
}
