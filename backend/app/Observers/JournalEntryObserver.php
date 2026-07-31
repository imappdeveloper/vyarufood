<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\JournalEntry;
use App\Events\Finance\JournalEntryCreated;
use App\Events\Finance\JournalEntryUpdated;
use App\Events\Finance\JournalEntryPosted;

class JournalEntryObserver
{
    public function created(JournalEntry $journalEntry): void
    {
        event(new JournalEntryCreated($journalEntry));
    }

    public function updated(JournalEntry $journalEntry): void
    {
        event(new JournalEntryUpdated($journalEntry));

        if ($journalEntry->wasChanged('posting_status') && $journalEntry->posting_status === 'posted') {
            event(new JournalEntryPosted($journalEntry));
        }
    }
}
