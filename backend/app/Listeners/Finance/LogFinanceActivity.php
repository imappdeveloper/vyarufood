<?php

declare(strict_types=1);

namespace App\Listeners\Finance;

use App\Events\Finance\ChartOfAccountCreated;
use App\Events\Finance\ChartOfAccountUpdated;
use App\Events\Finance\ChartOfAccountDeleted;
use App\Events\Finance\JournalEntryCreated;
use App\Events\Finance\JournalEntryUpdated;
use App\Events\Finance\JournalEntryPosted;
use App\Events\Finance\FinancialYearCreated;
use App\Events\Finance\FinancialYearUpdated;
use App\Events\Finance\FinancialYearClosed;
use Illuminate\Support\Facades\Log;

class LogFinanceActivity
{
    public function handle(
        ChartOfAccountCreated|ChartOfAccountUpdated|ChartOfAccountDeleted|
        JournalEntryCreated|JournalEntryUpdated|JournalEntryPosted|
        FinancialYearCreated|FinancialYearUpdated|FinancialYearClosed $event
    ): void {
        if (isset($event->account)) {
            $model = $event->account;
            $type = 'ChartOfAccount';
            $identifier = $model->code ?? $model->id;

            if ($event instanceof ChartOfAccountCreated) {
                $action = 'created';
            } elseif ($event instanceof ChartOfAccountUpdated) {
                $action = 'updated';
            } else {
                $action = 'deleted';
            }
        } elseif (isset($event->journal)) {
            $model = $event->journal;
            $type = 'JournalEntry';
            $identifier = $model->journal_number ?? $model->id;

            if ($event instanceof JournalEntryCreated) {
                $action = 'created';
            } elseif ($event instanceof JournalEntryUpdated) {
                $action = 'updated';
            } else {
                $action = 'posted';
            }
        } else {
            $model = $event->financialYear;
            $type = 'FinancialYear';
            $identifier = $model->year_label ?? $model->id;

            if ($event instanceof FinancialYearCreated) {
                $action = 'created';
            } elseif ($event instanceof FinancialYearUpdated) {
                $action = 'updated';
            } else {
                $action = 'closed';
            }
        }

        Log::info("[finance] {$type} {$action}", [
            'type' => $type,
            'model_id' => $model->id,
            'identifier' => $identifier,
        ]);
    }
}
