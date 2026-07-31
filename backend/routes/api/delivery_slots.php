<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Master\DeliverySlotController;
use App\Http\Controllers\Api\V1\Master\DeliveryZoneController;

Route::prefix('delivery-zones/{zoneId}/slots')->middleware(['auth:admin', 'role:super-admin'])->group(function () {
    Route::get('/', [DeliverySlotController::class, 'index']);
    Route::get('/available', [DeliverySlotController::class, 'getAvailableSlots']);
    Route::get('/{id}', [DeliverySlotController::class, 'show']);
    Route::post('/', [DeliverySlotController::class, 'store']);
    Route::put('/{id}', [DeliverySlotController::class, 'update']);
    Route::delete('/{id}', [DeliveryZoneController::class, 'destroy']);
    Route::post('/{id}/restore', [DeliverySlotController::class, 'restore']);
    Route::delete('/{id}/force-delete', [DeliverySlotController::class, 'forceDelete']);
});
