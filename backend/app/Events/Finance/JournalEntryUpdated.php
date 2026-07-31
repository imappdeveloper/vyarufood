<?php

declare(strict_types=1);

namespace App\Events\Finance;

use App\Models\JournalEntry;
use Illuminate\Foundation\Events\Dispatchable;

class JournalEntryUpdated
{
    use Dispatchable;

    public function __construct(public JournalEntry $journal) {}
}
