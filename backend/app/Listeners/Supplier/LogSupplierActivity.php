<?php

declare(strict_types=1);

namespace App\Listeners\Supplier;

use App\Support\BaseListener;
use App\Events\Supplier\{SupplierCreated, SupplierUpdated, SupplierDeleted, SupplierRestored, SupplierStatusChanged, SupplierBlacklisted, SupplierPriceUpdated, SupplierDocumentUploaded};

class LogSupplierActivity extends BaseListener
{
    public function handle(object $event): void
    {
        $description = match (true) {
            $event instanceof SupplierCreated => "Supplier '{$event->supplier->company_name}' created",
            $event instanceof SupplierUpdated => "Supplier '{$event->supplier->company_name}' updated",
            $event instanceof SupplierDeleted => "Supplier '{$event->supplier->company_name}' deleted",
            $event instanceof SupplierRestored => "Supplier '{$event->supplier->company_name}' restored",
            $event instanceof SupplierStatusChanged => "Supplier '{$event->supplier->company_name}' status changed from {$event->oldStatus} to {$event->newStatus}",
            $event instanceof SupplierBlacklisted => "Supplier '{$event->supplier->company_name}' blacklisted" . ($event->reason ? ": {$event->reason}" : ''),
            $event instanceof SupplierPriceUpdated => "Supplier product price updated for product ID {$event->product->id}",
            $event instanceof SupplierDocumentUploaded => "Document uploaded for supplier '{$event->document->supplier->company_name}'",
            default => 'Supplier event',
        };

        activity('supplier')->performedOn($event->supplier ?? $event->product ?? $event->document ?? null)
            ->event(class_basename($event))->log($description);
    }
}
