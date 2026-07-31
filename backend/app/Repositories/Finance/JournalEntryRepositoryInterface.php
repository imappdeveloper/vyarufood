<?php

declare(strict_types=1);

namespace App\Repositories\Finance;

use App\Models\JournalEntry;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface JournalEntryRepositoryInterface
{
    public function getPaginated(array $filters, int $perPage): LengthAwarePaginator;
    public function getById(int $id): ?JournalEntry;
    public function getByUuid(string $uuid): ?JournalEntry;
    public function create(array $data): JournalEntry;
    public function postJournal(int $id, int $postedBy): JournalEntry;
    public function reverseJournal(int $id, string $reason): JournalEntry;
    public function getByFinancialYear(int $fyId): Collection;
    public function getByReference(string $referenceType, int $referenceId): ?JournalEntry;
    public function getNextJournalNumber(): string;
    public function getTrialBalance(int $financialYearId, ?string $asOfDate): array;
    public function getProfitAndLoss(int $financialYearId, ?string $fromDate, ?string $toDate): array;
    public function getBalanceSheet(int $financialYearId, ?string $asOfDate): array;
    public function getCashFlow(int $financialYearId, ?string $fromDate, ?string $toDate): array;
}
