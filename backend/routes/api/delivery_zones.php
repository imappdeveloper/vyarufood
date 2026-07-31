<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Master\DeliveryZoneController;

Route::prefix('delivery-zones')->middleware(['auth:admin', 'role:super-admin'])->group(function () {
    Route::get('/', [DeliveryZoneController::class, 'index']);
    Route::get('/export', [DeliveryZoneController::class, 'export']);
    Route::get('/sample-template', [DeliveryZoneController::class, 'downloadSampleTemplate']);
    Route::post('/import', [DeliveryZoneController::class, 'import']);
    Route::post('/bulk-delete', [DeliveryZoneController::class, 'bulkDelete']);
    Route::post('/bulk-set-status', [DeliveryZoneController::class, 'bulkSetStatus']);
    Route::get('/{id}', [DeliveryZoneController::class, 'show']);
    Route::post('/', [DeliveryZoneController::class, 'store']);
    Route::put('/{id}', [DeliveryZoneController::class, 'update']);
    Route::delete('/{id}', [DeliveryZoneController::class, 'destroy']);
    Route::post('/{id}/restore', [DeliveryZoneController::class, 'restore']);
    Route::delete('/{id}/force-delete', [DeliveryZoneController::class, 'forceDelete']);
    Route::post('/{id}/set-default', [DeliveryZoneController::class, 'setDefault']);
});

Route::post('/check-service-area', [DeliveryZoneController::class, 'checkServiceArea']);
