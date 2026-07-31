<?php

declare(strict_types=1);

namespace App\Events\Supplier;

use App\Models\SupplierDocument;
use App\Support\BaseEvent;

class SupplierDocumentUploaded extends BaseEvent
{
    public function __construct(public readonly SupplierDocument $document) {}
}
