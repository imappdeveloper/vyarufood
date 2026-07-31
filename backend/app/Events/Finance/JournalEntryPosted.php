<?php

declare(strict_types=1);

namespace App\Events\Finance;

use App\Models\JournalEntry;
use Illuminate\Foundation\Events\Dispatchable;

class JournalEntryPosted
{
    use Dispatchable;

    public function __construct(public JournalEntry $journal) {}
}
