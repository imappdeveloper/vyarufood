<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Master\PincodeController;

Route::prefix('pincodes')->middleware(['auth:admin', 'role:super-admin'])->group(function () {
    Route::get('/', [PincodeController::class, 'index']);
    Route::get('/export', [PincodeController::class, 'export']);
    Route::get('/sample-template', [PincodeController::class, 'downloadSampleTemplate']);
    Route::post('/import', [PincodeController::class, 'import']);
    Route::post('/bulk-delete', [PincodeController::class, 'bulkDelete']);
    Route::post('/bulk-set-status', [PincodeController::class, 'bulkSetStatus']);
    Route::get('/{id}', [PincodeController::class, 'show']);
    Route::post('/', [PincodeController::class, 'store']);
    Route::put('/{id}', [PincodeController::class, 'update']);
    Route::delete('/{id}', [PincodeController::class, 'destroy']);
    Route::post('/{id}/restore', [PincodeController::class, 'restore']);
    Route::delete('/{id}/force-delete', [PincodeController::class, 'forceDelete']);
    Route::post('/{id}/set-default', [PincodeController::class, 'setDefault']);
});
