<?php

declare(strict_types=1);

namespace App\Listeners\Purchase;

use Illuminate\Support\Facades\Log;

class LogPurchaseActivity
{
    public function handle(mixed $event): void
    {
        $model = $event->model ?? null;
        $className = class_basename($event::class);

        Log::info("[purchase] {$className}", [
            'model_id' => $model?->id,
            'model_uuid' => $model?->uuid,
            'model_number' => $model->request_number ?? $model->po_number ?? $model->grn_number ?? null,
        ]);
    }
}
