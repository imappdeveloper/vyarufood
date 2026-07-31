<?php

declare(strict_types=1);

namespace App\Listeners\Inventory;

use Illuminate\Support\Facades\Log;

class LogInventoryActivity
{
    public function handle(mixed $event): void
    {
        $model = $event->model;
        $className = class_basename($model);
        Log::info("[inventory] {$className}", [
            'model_id' => $model->id,
            'model_uuid' => $model->uuid,
        ]);
    }
}
