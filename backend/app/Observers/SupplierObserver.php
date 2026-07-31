<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Supplier;
use App\Support\BaseObserver;
use App\Support\CacheManager;

class SupplierObserver extends BaseObserver
{
    public function created(Supplier $supplier): void
    {
        CacheManager::flush('supplier');
        activity('supplier')->performedOn($supplier)->event('created')->log("Supplier '{$supplier->company_name}' created");
    }

    public function updated(Supplier $supplier): void
    {
        CacheManager::flush('supplier');
        $changes = $supplier->getChanges();
        unset($changes['updated_at']);
        activity('supplier')->performedOn($supplier)->event('updated')
            ->withProperties(['old' => $supplier->getOriginal(), 'attributes' => $changes])->log("Supplier '{$supplier->company_name}' updated");
    }

    public function deleted(Supplier $supplier): void
    {
        CacheManager::flush('supplier');
        activity('supplier')->performedOn($supplier)->event('deleted')->log("Supplier '{$supplier->company_name}' deleted");
    }

    public function restored(Supplier $supplier): void
    {
        CacheManager::flush('supplier');
        activity('supplier')->performedOn($supplier)->event('restored')->log("Supplier '{$supplier->company_name}' restored");
    }
}
