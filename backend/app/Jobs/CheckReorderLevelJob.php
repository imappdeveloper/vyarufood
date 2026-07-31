<?php
declare(strict_types=1);

namespace App\Jobs;

use App\Models\InventoryItem;
use App\Events\Inventory\LowStockTriggered;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckReorderLevelJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;

    public function handle(): void
    {
        $lowStockItems = InventoryItem::active()
            ->whereColumn('current_stock', '<=', 'reorder_level')
            ->where('reorder_level', '>', 0)
            ->get();

        foreach ($lowStockItems as $item) {
            LowStockTriggered::dispatch($item);
        }
    }
}
