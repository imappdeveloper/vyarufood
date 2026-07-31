<?php

declare(strict_types=1);

namespace App\Services\Finance;

use App\Models\JournalEntry;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface JournalServiceInterface
{
    public function getPaginatedJournals(array $filters, int $perPage): LengthAwarePaginator;
    public function getJournalById(int $id): ?JournalEntry;
    public function getJournalByUuid(string $uuid): ?JournalEntry;
    public function createJournal(array $data): JournalEntry;
    public function postJournal(string $uuid, int $postedBy): JournalEntry;
    public function reverseJournal(string $uuid, string $reason): JournalEntry;
    public function bulkPost(array $ids, int $postedBy): int;
    public function getTrialBalance(int $financialYearId, ?string $asOfDate): array;
    public function getProfitAndLoss(int $financialYearId, ?string $fromDate, ?string $toDate): array;
    public function getBalanceSheet(int $financialYearId, ?string $asOfDate): array;
    public function getCashFlow(int $financialYearId, ?string $fromDate, ?string $toDate): array;
    public function getDashboardStats(): array;
}
