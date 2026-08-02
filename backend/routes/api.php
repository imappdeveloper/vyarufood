<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Dashboard\DashboardController;
use App\Http\Controllers\Api\V1\Admin\WeeklyMenuController;
use App\Http\Controllers\Api\V1\Admin\WeeklyMenuItemController;
use App\Http\Controllers\Api\V1\Admin\CustomerMealSelectionController;

Route::prefix('v1')->group(function () {
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'version' => config('app.version', '1.0.0'),
        ]);
    });

    Route::post('/admin/login', [AuthController::class, 'login']);
    Route::post('/admin/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/admin/reset-password', [AuthController::class, 'resetPassword']);

    Route::prefix('admin')->middleware('auth:admin')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/profile/photo', [AuthController::class, 'updateProfilePhoto']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAllDevices']);

        Route::prefix('dashboard')->group(function () {
            Route::get('/summary', [DashboardController::class, 'summary']);
            Route::get('/revenue', [DashboardController::class, 'revenue']);
            Route::get('/orders', [DashboardController::class, 'orders']);
            Route::get('/customers', [DashboardController::class, 'customers']);
            Route::get('/subscriptions', [DashboardController::class, 'subscriptions']);
            Route::get('/inventory', [DashboardController::class, 'inventory']);
            Route::get('/charts', [DashboardController::class, 'charts']);
            Route::get('/recent-orders', [DashboardController::class, 'recentOrders']);
            Route::get('/recent-customers', [DashboardController::class, 'recentCustomers']);
            Route::get('/system-health', [DashboardController::class, 'systemHealth']);
            Route::get('/export/summary', [DashboardController::class, 'exportSummary']);
            Route::get('/export/revenue', [DashboardController::class, 'exportRevenue']);
        });

        Route::prefix('countries')->middleware('can:country.view')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'index']);
            Route::get('/export', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'export'])->withoutMiddleware('can:country.view')->middleware('can:country.export');
            Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'downloadTemplate'])->withoutMiddleware('can:country.view')->middleware('can:country.export');
            Route::post('/import', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'import'])->withoutMiddleware('can:country.view')->middleware('can:country.import');
            Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'bulkDelete'])->withoutMiddleware('can:country.view')->middleware('can:country.delete');
            Route::patch('/bulk-status', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'bulkStatus'])->withoutMiddleware('can:country.view')->middleware('can:country.update');
            Route::get('/{country}', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'show'])->middleware('can:view,country');
            Route::post('/', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'store'])->withoutMiddleware('can:country.view')->middleware('can:country.create');
            Route::put('/{country}', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'update'])->withoutMiddleware('can:country.view')->middleware('can:country.update');
            Route::delete('/{country}', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'destroy'])->withoutMiddleware('can:country.view')->middleware('can:country.delete');
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'restore'])->withoutMiddleware('can:country.view')->middleware('can:country.restore');
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'forceDelete'])->withoutMiddleware('can:country.view')->middleware('can:country.delete');
            Route::patch('/{country}/status', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'setStatus'])->withoutMiddleware('can:country.view')->middleware('can:country.update');
            Route::patch('/{country}/default', [\App\Http\Controllers\Api\V1\Master\CountryController::class, 'setDefault'])->withoutMiddleware('can:country.view')->middleware('can:country.update');
        });

        Route::prefix('states')->middleware('can:state.view')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'index']);
            Route::get('/export', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'export'])->withoutMiddleware('can:state.view')->middleware('can:state.export');
            Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'downloadTemplate'])->withoutMiddleware('can:state.view')->middleware('can:state.export');
            Route::post('/import', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'import'])->withoutMiddleware('can:state.view')->middleware('can:state.import');
            Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'bulkDelete'])->withoutMiddleware('can:state.view')->middleware('can:state.delete');
            Route::patch('/bulk-status', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'bulkStatus'])->withoutMiddleware('can:state.view')->middleware('can:state.update');
            Route::get('/by-country/{countryUuid}', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'byCountry']);
            Route::get('/{state}', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'show'])->middleware('can:view,state');
            Route::post('/', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'store'])->withoutMiddleware('can:state.view')->middleware('can:state.create');
            Route::put('/{state}', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'update'])->withoutMiddleware('can:state.view')->middleware('can:state.update');
            Route::delete('/{state}', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'destroy'])->withoutMiddleware('can:state.view')->middleware('can:state.delete');
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'restore'])->withoutMiddleware('can:state.view')->middleware('can:state.restore');
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'forceDelete'])->withoutMiddleware('can:state.view')->middleware('can:state.delete');
            Route::patch('/{state}/status', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'setStatus'])->withoutMiddleware('can:state.view')->middleware('can:state.update');
            Route::patch('/{state}/default', [\App\Http\Controllers\Api\V1\Master\StateController::class, 'setDefault'])->withoutMiddleware('can:state.view')->middleware('can:state.update');
        });

        Route::prefix('cities')->middleware('can:city.view')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'index']);
            Route::get('/export', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'export'])->withoutMiddleware('can:city.view')->middleware('can:city.export');
            Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'downloadTemplate'])->withoutMiddleware('can:city.view')->middleware('can:city.export');
            Route::post('/import', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'import'])->withoutMiddleware('can:city.view')->middleware('can:city.import');
            Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'bulkDelete'])->withoutMiddleware('can:city.view')->middleware('can:city.delete');
            Route::patch('/bulk-status', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'bulkStatus'])->withoutMiddleware('can:city.view')->middleware('can:city.update');
            Route::get('/by-country/{countryUuid}', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'byCountry']);
            Route::get('/by-state/{stateUuid}', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'byState']);
            Route::get('/{city}', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'show'])->middleware('can:view,city');
            Route::post('/', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'store'])->withoutMiddleware('can:city.view')->middleware('can:city.create');
            Route::put('/{city}', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'update'])->withoutMiddleware('can:city.view')->middleware('can:city.update');
            Route::delete('/{city}', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'destroy'])->withoutMiddleware('can:city.view')->middleware('can:city.delete');
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'restore'])->withoutMiddleware('can:city.view')->middleware('can:city.restore');
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'forceDelete'])->withoutMiddleware('can:city.view')->middleware('can:city.delete');
            Route::patch('/{city}/status', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'setStatus'])->withoutMiddleware('can:city.view')->middleware('can:city.update');
            Route::patch('/{city}/default', [\App\Http\Controllers\Api\V1\Master\CityController::class, 'setDefault'])->withoutMiddleware('can:city.view')->middleware('can:city.update');
        });

        Route::prefix('areas')->middleware('can:area.view')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'index']);
            Route::get('/export', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'export'])->withoutMiddleware('can:area.view')->middleware('can:area.export');
            Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'downloadTemplate'])->withoutMiddleware('can:area.view')->middleware('can:area.export');
            Route::post('/import', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'import'])->withoutMiddleware('can:area.view')->middleware('can:area.import');
            Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'bulkDelete'])->withoutMiddleware('can:area.view')->middleware('can:area.delete');
            Route::patch('/bulk-status', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'bulkStatus'])->withoutMiddleware('can:area.view')->middleware('can:area.update');
            Route::get('/by-city/{cityUuid}', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'byCity']);
            Route::get('/{area}', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'show'])->middleware('can:view,area');
            Route::post('/', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'store'])->withoutMiddleware('can:area.view')->middleware('can:area.create');
            Route::put('/{area}', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'update'])->withoutMiddleware('can:area.view')->middleware('can:area.update');
            Route::delete('/{area}', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'destroy'])->withoutMiddleware('can:area.view')->middleware('can:area.delete');
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'restore'])->withoutMiddleware('can:area.view')->middleware('can:area.restore');
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'forceDelete'])->withoutMiddleware('can:area.view')->middleware('can:area.delete');
            Route::patch('/{area}/status', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'setStatus'])->withoutMiddleware('can:area.view')->middleware('can:area.update');
            Route::patch('/{area}/service', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'setService'])->withoutMiddleware('can:area.view')->middleware('can:area.service');
            Route::patch('/{area}/default', [\App\Http\Controllers\Api\V1\Master\AreaController::class, 'setDefault'])->withoutMiddleware('can:area.view')->middleware('can:area.update');
        });

        Route::prefix('delivery-zones')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'index']);
            Route::get('/export', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'export']);
            Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'downloadSampleTemplate']);
            Route::post('/import', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'import']);
            Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'bulkDelete']);
            Route::post('/bulk-set-status', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'bulkSetStatus']);
            Route::get('/{deliveryZone}', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'show']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'store']);
            Route::put('/{deliveryZone}', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'update']);
            Route::delete('/{deliveryZone}', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'destroy']);
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'restore']);
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'forceDelete']);
            Route::post('/{deliveryZone}/set-default', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'setDefault']);

            Route::prefix('/{deliveryZone}/slots')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\DeliverySlotController::class, 'index']);
                Route::get('/available', [\App\Http\Controllers\Api\V1\Master\DeliverySlotController::class, 'getAvailableSlots']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\DeliverySlotController::class, 'store']);
                Route::get('/{slot}', [\App\Http\Controllers\Api\V1\Master\DeliverySlotController::class, 'show']);
                Route::put('/{slot}', [\App\Http\Controllers\Api\V1\Master\DeliverySlotController::class, 'update']);
                Route::delete('/{slot}', [\App\Http\Controllers\Api\V1\Master\DeliverySlotController::class, 'destroy']);
                Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\DeliverySlotController::class, 'restore']);
                Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\DeliverySlotController::class, 'forceDelete']);
            });
        });

            Route::prefix('pincodes')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'index']);
                Route::get('/export', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'export']);
                Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'downloadSampleTemplate']);
                Route::post('/import', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'import']);
                Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'bulkDelete']);
                Route::post('/bulk-set-status', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'bulkSetStatus']);
                Route::get('/{pincode}', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'show']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'store']);
                Route::put('/{pincode}', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'update']);
                Route::delete('/{pincode}', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'destroy']);
                Route::post('/{pincode}/restore', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'restore']);
                Route::delete('/{pincode}/force-delete', [\App\Http\Controllers\Api\V1\Master\PincodeController::class, 'forceDelete']);
            });

            Route::prefix('customers')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'index']);
                Route::get('/export', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'export']);
                Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'downloadSampleTemplate']);
                Route::post('/import', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'import']);
                Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'bulkDelete']);
                Route::post('/bulk-set-status', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'bulkSetStatus']);
                Route::get('/stats', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'stats']);
                Route::get('/search', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'search']);
                Route::post('/{customer}/wallet/adjust', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'adjustWallet']);
                Route::get('/{customer}/wallet/transactions', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'walletTransactions']);
                Route::get('/{customer}', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'show']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'store']);
                Route::put('/{customer}', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'update']);
                Route::delete('/{customer}', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'destroy']);
                Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'restore']);
                Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'forceDelete']);
                Route::patch('/{customer}/status', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'setStatus']);
                Route::post('/{customer}/block', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'block']);
                Route::post('/{customer}/unblock', [\App\Http\Controllers\Api\V1\Customer\CustomerController::class, 'unblock']);
            });

            Route::prefix('customer-addresses')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'index']);
                Route::get('/export', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'export']);
                Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'downloadSampleTemplate']);
                Route::post('/import', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'import']);
                Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'bulkDelete']);
                Route::post('/bulk-set-status', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'bulkSetStatus']);
                Route::post('/check-service', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'checkService']);
                Route::get('/stats', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'stats']);
                Route::get('/search', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'search']);
                Route::get('/{customerAddress}', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'show']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'store']);
                Route::put('/{customerAddress}', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'update']);
                Route::delete('/{customerAddress}', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'destroy']);
                Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'restore']);
                Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'forceDelete']);
                Route::patch('/{customerAddress}/default', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'setDefault']);
                Route::patch('/{customerAddress}/verify', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'verify']);
                Route::patch('/{customerAddress}/status', [\App\Http\Controllers\Api\V1\Customer\CustomerAddressController::class, 'setStatus']);
            });

            Route::prefix('kitchens')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'index']);
                Route::get('/export', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'export']);
                Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'downloadSampleTemplate']);
                Route::post('/import', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'import']);
                Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'bulkDelete']);
                Route::post('/bulk-set-status', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'bulkSetStatus']);
                Route::get('/stats', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'stats']);
                Route::get('/search', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'search']);
                Route::get('/{kitchen}', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'show']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'store']);
                Route::put('/{kitchen}', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'update']);
                Route::delete('/{kitchen}', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'destroy']);
                Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'restore']);
                Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'forceDelete']);
                Route::patch('/{kitchen}/default', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'setDefault']);
                Route::patch('/{kitchen}/status', [\App\Http\Controllers\Api\V1\Master\KitchenController::class, 'setStatus']);
            });

            Route::prefix('kitchen-working-days')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\KitchenWorkingDayController::class, 'index']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\KitchenWorkingDayController::class, 'store']);
                Route::get('/default-schedule', [\App\Http\Controllers\Api\V1\Master\KitchenWorkingDayController::class, 'getDefaultSchedule']);
                Route::get('/{workingDay}', [\App\Http\Controllers\Api\V1\Master\KitchenWorkingDayController::class, 'show']);
                Route::put('/{workingDay}', [\App\Http\Controllers\Api\V1\Master\KitchenWorkingDayController::class, 'update']);
                Route::delete('/{workingDay}', [\App\Http\Controllers\Api\V1\Master\KitchenWorkingDayController::class, 'destroy']);
                Route::post('/bulk-update', [\App\Http\Controllers\Api\V1\Master\KitchenWorkingDayController::class, 'bulkUpdate']);
            });

            Route::prefix('kitchen-holidays')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\KitchenHolidayController::class, 'index']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\KitchenHolidayController::class, 'store']);
                Route::get('/calendar', [\App\Http\Controllers\Api\V1\Master\KitchenHolidayController::class, 'calendar']);
                Route::get('/{holiday}', [\App\Http\Controllers\Api\V1\Master\KitchenHolidayController::class, 'show']);
                Route::put('/{holiday}', [\App\Http\Controllers\Api\V1\Master\KitchenHolidayController::class, 'update']);
                Route::delete('/{holiday}', [\App\Http\Controllers\Api\V1\Master\KitchenHolidayController::class, 'destroy']);
            });

            Route::prefix('kitchen-capacity')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\KitchenCapacityController::class, 'index']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\KitchenCapacityController::class, 'store']);
                Route::get('/stats', [\App\Http\Controllers\Api\V1\Master\KitchenCapacityController::class, 'stats']);
                Route::get('/{capacity}', [\App\Http\Controllers\Api\V1\Master\KitchenCapacityController::class, 'show']);
                Route::put('/{capacity}', [\App\Http\Controllers\Api\V1\Master\KitchenCapacityController::class, 'update']);
                Route::delete('/{capacity}', [\App\Http\Controllers\Api\V1\Master\KitchenCapacityController::class, 'destroy']);
                Route::post('/bulk-update', [\App\Http\Controllers\Api\V1\Master\KitchenCapacityController::class, 'bulkUpdate']);
            });

            Route::prefix('production-schedules')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\ProductionScheduleController::class, 'index']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\ProductionScheduleController::class, 'store']);
                Route::post('/generate-plan', [\App\Http\Controllers\Api\V1\Master\ProductionScheduleController::class, 'generatePlan']);
                Route::get('/stats', [\App\Http\Controllers\Api\V1\Master\ProductionScheduleController::class, 'stats']);
                Route::get('/{schedule}', [\App\Http\Controllers\Api\V1\Master\ProductionScheduleController::class, 'show']);
                Route::put('/{schedule}', [\App\Http\Controllers\Api\V1\Master\ProductionScheduleController::class, 'update']);
                Route::delete('/{schedule}', [\App\Http\Controllers\Api\V1\Master\ProductionScheduleController::class, 'destroy']);
                Route::patch('/{schedule}/completed', [\App\Http\Controllers\Api\V1\Master\ProductionScheduleController::class, 'markCompleted']);
            });

            Route::prefix('meal-categories')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'index']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'store']);
                Route::get('/stats', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'stats']);
                Route::get('/search', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'search']);
                Route::post('/import', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'import']);
                Route::get('/export', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'export']);
                Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'downloadSampleTemplate']);
                Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'bulkDelete']);
                Route::post('/bulk-set-status', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'bulkSetStatus']);
                Route::get('/{mealCategory}', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'show']);
                Route::put('/{mealCategory}', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'update']);
                Route::delete('/{mealCategory}', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'destroy']);
                Route::patch('/{mealCategory}/status', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'setStatus']);
                Route::patch('/{mealCategory}/default', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'setDefault']);
                Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'restore']);
                Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\MealCategoryController::class, 'forceDelete']);
            });

            Route::prefix('meal-types')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'index']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'store']);
                Route::get('/stats', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'stats']);
                Route::get('/search', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'search']);
                Route::post('/import', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'import']);
                Route::get('/export', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'export']);
                Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'downloadSampleTemplate']);
                Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'bulkDelete']);
                Route::post('/bulk-set-status', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'bulkSetStatus']);
                Route::get('/{mealType}', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'show']);
                Route::put('/{mealType}', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'update']);
                Route::delete('/{mealType}', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'destroy']);
                Route::patch('/{mealType}/status', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'setStatus']);
                Route::patch('/{mealType}/default', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'setDefault']);
                Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'restore']);
                Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\MealTypeController::class, 'forceDelete']);
            });

            Route::prefix('meals')->group(function () {
                Route::get('/', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'index']);
                Route::get('/stats', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'stats']);
                Route::get('/search', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'search']);
                Route::get('/export', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'export']);
                Route::get('/sample-template', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'downloadSampleTemplate']);
                Route::post('/import', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'import']);
                Route::post('/bulk-delete', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'bulkDelete']);
                Route::post('/bulk-set-status', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'bulkSetStatus']);
                Route::post('/bulk-update-price', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'bulkUpdatePrice']);
                Route::post('/bulk-update-category', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'bulkUpdateCategory']);
                Route::get('/{meal}', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'show']);
                Route::post('/', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'store']);
                Route::put('/{meal}', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'update']);
                Route::delete('/{meal}', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'destroy']);
                Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'restore']);
                Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'forceDelete']);
                Route::patch('/{meal}/status', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'setStatus']);
                Route::patch('/{meal}/featured', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'setFeatured']);
                Route::patch('/{meal}/recommended', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'setRecommended']);
                Route::patch('/{meal}/bestseller', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'setBestseller']);
                Route::patch('/{meal}/new', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'setNewFlag']);
                Route::post('/{meal}/duplicate', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'duplicate']);
                Route::post('/{meal}/image', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'uploadImage']);
                Route::post('/{meal}/gallery', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'uploadGallery']);
                Route::delete('/{meal}/image', [\App\Http\Controllers\Api\V1\Master\MealController::class, 'deleteImage']);
            });

            Route::prefix('weekly-menus')->group(function (): void {
                Route::get('/', [WeeklyMenuController::class, 'index']);
                Route::post('/', [WeeklyMenuController::class, 'store']);
                Route::get('/stats', [WeeklyMenuController::class, 'getStats']);
                Route::get('/upcoming', [WeeklyMenuController::class, 'getUpcoming']);
                Route::get('/published', [WeeklyMenuController::class, 'getPublished']);
                Route::get('/by-week', [WeeklyMenuController::class, 'getByWeek']);
                Route::post('/copy-previous', [WeeklyMenuController::class, 'copyPreviousWeek']);
                Route::post('/auto-generate', [WeeklyMenuController::class, 'autoGenerate']);
                Route::get('/{uuid}', [WeeklyMenuController::class, 'show']);
                Route::put('/{uuid}', [WeeklyMenuController::class, 'update']);
                Route::delete('/{uuid}', [WeeklyMenuController::class, 'destroy']);
                Route::post('/{uuid}/restore', [WeeklyMenuController::class, 'restore']);
                Route::post('/{uuid}/publish', [WeeklyMenuController::class, 'publish']);
                Route::post('/{uuid}/unpublish', [WeeklyMenuController::class, 'unpublish']);
            });

            Route::prefix('weekly-menu-items')->group(function (): void {
                Route::get('/', [WeeklyMenuItemController::class, 'index']);
                Route::post('/', [WeeklyMenuItemController::class, 'store']);
                Route::get('/by-date', [WeeklyMenuItemController::class, 'getByDate']);
                Route::get('/defaults', [WeeklyMenuItemController::class, 'getDefaults']);
                Route::post('/bulk', [WeeklyMenuItemController::class, 'bulkStore']);
                Route::post('/reorder', [WeeklyMenuItemController::class, 'reorder']);
                Route::post('/assign-defaults', [WeeklyMenuItemController::class, 'assignDefaults']);
                Route::get('/{uuid}', [WeeklyMenuItemController::class, 'show']);
                Route::put('/{uuid}', [WeeklyMenuItemController::class, 'update']);
                Route::delete('/{uuid}', [WeeklyMenuItemController::class, 'destroy']);
            });

            Route::prefix('customer-meal-selections')->group(function (): void {
                Route::get('/', [CustomerMealSelectionController::class, 'index']);
                Route::post('/', [CustomerMealSelectionController::class, 'store']);
                Route::get('/summary', [CustomerMealSelectionController::class, 'getSelectionSummary']);
                Route::get('/by-date', [CustomerMealSelectionController::class, 'getSelectionsByDate']);
                Route::get('/customer', [CustomerMealSelectionController::class, 'getCustomerSelections']);
                Route::post('/can-select', [CustomerMealSelectionController::class, 'canSelect']);
                Route::post('/skip', [CustomerMealSelectionController::class, 'skipMeal']);
                Route::post('/bulk-defaults', [CustomerMealSelectionController::class, 'bulkAssignDefaults']);
                Route::get('/{uuid}', [CustomerMealSelectionController::class, 'show']);
                Route::put('/{uuid}', [CustomerMealSelectionController::class, 'update']);
                Route::delete('/{uuid}', [CustomerMealSelectionController::class, 'destroy']);
            });

        Route::prefix('monthly-menus')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'getStats']);
            Route::post('/copy-previous', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'copyPrevious']);
            Route::get('/{monthlyMenu}', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'show']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'store']);
            Route::put('/{monthlyMenu}', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'update']);
            Route::delete('/{monthlyMenu}', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'destroy']);
            Route::post('/{monthlyMenu}/restore', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'restore']);
            Route::post('/{monthlyMenu}/publish', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'publish']);
            Route::post('/{monthlyMenu}/unpublish', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'unpublish']);
            Route::post('/{monthlyMenu}/approve', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'approve']);
            Route::post('/{monthlyMenu}/duplicate', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'duplicate']);
            Route::post('/{monthlyMenu}/generate-weekly', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'generateWeekly']);
            Route::get('/{monthlyMenu}/forecast', [\App\Http\Controllers\Api\V1\Admin\MonthlyMenuController::class, 'getForecast']);
        });

        Route::prefix('menu-templates')->group(function () {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\MenuTemplateController::class, 'index']);
            Route::get('/{menuTemplate}', [\App\Http\Controllers\Api\V1\Admin\MenuTemplateController::class, 'show']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\MenuTemplateController::class, 'store']);
            Route::put('/{menuTemplate}', [\App\Http\Controllers\Api\V1\Admin\MenuTemplateController::class, 'update']);
            Route::delete('/{menuTemplate}', [\App\Http\Controllers\Api\V1\Admin\MenuTemplateController::class, 'destroy']);
            Route::post('/{menuTemplate}/restore', [\App\Http\Controllers\Api\V1\Admin\MenuTemplateController::class, 'restore']);
            Route::post('/{menuTemplate}/duplicate', [\App\Http\Controllers\Api\V1\Admin\MenuTemplateController::class, 'duplicate']);
            Route::patch('/{menuTemplate}/default', [\App\Http\Controllers\Api\V1\Admin\MenuTemplateController::class, 'setDefault']);
        });

        Route::prefix('subscription-plans')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'getStats']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'show']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'store']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'destroy']);
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'restore']);
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'forceDelete']);
            Route::patch('/{uuid}/status', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'setStatus']);
            Route::patch('/{uuid}/popular', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'togglePopular']);
            Route::patch('/{uuid}/recommended', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'toggleRecommended']);
            Route::post('/{uuid}/duplicate', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'duplicate']);
            Route::post('/import', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'import']);
            Route::get('/export/download', [\App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController::class, 'export']);
        });

        Route::prefix('customer-subscriptions')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'getStats']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'destroy']);
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'restore']);
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'forceDelete']);
            Route::post('/{uuid}/activate', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'activate']);
            Route::post('/{uuid}/suspend', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'suspend']);
            Route::post('/{uuid}/force-resume', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'forceResume']);
            Route::post('/{uuid}/resume', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'resume']);
            Route::post('/{uuid}/cancel', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'cancel']);
            Route::post('/{uuid}/renew', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'renew']);
            Route::post('/{uuid}/skip', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'skip']);
            Route::post('/{uuid}/pause', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'pause']);
            Route::post('/{uuid}/upgrade', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'upgrade']);
            Route::post('/{uuid}/downgrade', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'downgrade']);
            Route::post('/{uuid}/approve-upgrade/{historyId}', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'approveUpgrade']);
            Route::post('/{uuid}/adjust-meals', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'adjustMeals']);
            Route::post('/{uuid}/adjust-wallet', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'adjustWallet']);
            Route::get('/{uuid}/timeline', [\App\Http\Controllers\Api\V1\Admin\CustomerSubscriptionController::class, 'getTimeline']);
        });

        Route::prefix('orders')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'getStats']);
            Route::get('/dashboard-stats', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'getDashboardStats']);
            Route::get('/today-summary', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'getTodaySummary']);
            Route::post('/generate-daily', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'generateOrders']);
            Route::post('/bulk-status', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'bulkUpdateStatus']);
            Route::post('/import', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'import']);
            Route::get('/export', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'export']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'destroy']);
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'restore']);
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'forceDelete']);
            Route::patch('/{uuid}/confirm', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'confirm']);
            Route::patch('/{uuid}/prepare', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'prepare']);
            Route::patch('/{uuid}/ready', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'ready']);
            Route::patch('/{uuid}/dispatch', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'dispatch']);
            Route::patch('/{uuid}/deliver', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'deliver']);
            Route::patch('/{uuid}/update-payment-status', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'updatePaymentStatus']);
            Route::post('/{uuid}/cancel', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'cancel']);
            Route::post('/{uuid}/refund', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'refund']);
            Route::post('/{uuid}/duplicate', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'duplicate']);
            Route::get('/{uuid}/timeline', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'getTimeline']);
        });

        Route::prefix('production-batches')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'getStats']);
            Route::get('/summary', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'getProductionSummary']);
            Route::post('/generate-from-orders', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'generateFromOrders']);
            Route::post('/bulk-start', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'bulkStart']);
            Route::post('/bulk-complete', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'bulkComplete']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'destroy']);
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'restore']);
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'forceDelete']);
            Route::patch('/{uuid}/start', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'start']);
            Route::patch('/{uuid}/pause', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'pause']);
            Route::patch('/{uuid}/complete', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'complete']);
            Route::post('/{uuid}/cancel', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'cancel']);
            Route::put('/{uuid}/items', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'updateItems']);
            Route::put('/{uuid}/items/{itemId}/wastage', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'updateWastage']);
            Route::get('/{uuid}/packing-list', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'getPackingList']);
            Route::post('/{uuid}/pack/{packingId}', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'packMeal']);
            Route::get('/{uuid}/timeline', [\App\Http\Controllers\Api\V1\Admin\ProductionBatchController::class, 'getTimeline']);
        });

        Route::prefix('recipes')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'getStats']);
            Route::get('/food-cost-report', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'getFoodCostReport']);
            Route::get('/consumption-history', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'getConsumptionLogs']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'destroy']);
            Route::post('/{uuid}/clone', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'clone']);
            Route::get('/{uuid}/versions', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'getVersions']);
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'restore']);
            Route::delete('/{uuid}/force-delete', [\App\Http\Controllers\Api\V1\Admin\RecipeController::class, 'forceDelete']);
        });

        Route::prefix('purchase-requests')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'getStats']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'destroy']);
            Route::patch('/{uuid}/approve', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'approve']);
            Route::patch('/{uuid}/reject', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'reject']);
            Route::post('/{uuid}/cancel', [\App\Http\Controllers\Api\V1\Admin\PurchaseRequestController::class, 'cancel']);
        });

        Route::prefix('purchase-orders')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'getStats']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'destroy']);
            Route::patch('/{uuid}/approve', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'approve']);
            Route::patch('/{uuid}/close', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'close']);
            Route::post('/{uuid}/cancel', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'cancel']);
            Route::post('/convert-from-request/{requestUuid}', [\App\Http\Controllers\Api\V1\Admin\PurchaseOrderController::class, 'convertFromRequest']);
        });

        Route::prefix('goods-receipts')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\GoodsReceiptController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\GoodsReceiptController::class, 'getStats']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\GoodsReceiptController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\GoodsReceiptController::class, 'show']);
        });

            Route::prefix('suppliers')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'getStats']);
            Route::get('/dashboard-stats', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'getDashboardStats']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'destroy']);
            Route::patch('/{uuid}/status', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'changeStatus']);
            Route::patch('/{uuid}/blacklist', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'blacklist']);
            Route::post('/{uuid}/restore', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'restore']);
            Route::get('/{uuid}/products', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'getProducts']);
            Route::post('/{uuid}/products', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'storeProduct']);
            Route::put('/products/{productUuid}', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'updateProduct']);
            Route::delete('/products/{productUuid}', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'destroyProduct']);
            Route::get('/{uuid}/documents', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'getDocuments']);
            Route::post('/{uuid}/documents', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'storeDocument']);
            Route::delete('/documents/{documentUuid}', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'destroyDocument']);
            Route::get('/{uuid}/contacts', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'getContacts']);
            Route::post('/{uuid}/contacts', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'storeContact']);
            Route::put('/contacts/{contactUuid}', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'updateContact']);
            Route::delete('/contacts/{contactUuid}', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'destroyContact']);
            Route::get('/{uuid}/price-history', [\App\Http\Controllers\Api\V1\Admin\SupplierController::class, 'getPriceHistory']);
        });

        Route::get('/units', function () {
            return response()->json([
                'success' => true,
                'data' => \App\Models\Unit::orderBy('name')->get(),
            ]);
        });

        Route::prefix('inventory')->group(function (): void {
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'stats']);
            Route::get('/dashboard-stats', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'dashboardStats']);
            Route::get('/low-stock', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'lowStock']);
            Route::get('/expiring', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'expiring']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'store']);
            Route::get('/ledger', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'ledger']);
            Route::get('/transactions', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'transactions']);
            Route::get('/adjustments', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'adjustments']);
            Route::post('/adjustments', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'storeAdjustment']);
            Route::get('/audits', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'audits']);
            Route::post('/audits', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'storeAudit']);
            Route::patch('/audits/{uuid}/approve', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'approveAudit']);
            Route::patch('/audits/{uuid}/reject', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'rejectAudit']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'destroy']);

            // Batches
            Route::get('/batches/all', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'batches']);
            Route::post('/batches', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'storeBatch']);
            Route::get('/batches/{uuid}', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'showBatch']);
            Route::delete('/batches/{uuid}', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'destroyBatch']);

            // Adjustments approve
            Route::patch('/adjustments/{uuid}/approve', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'approveAdjustment']);
        });

        // === EXPENSE MANAGEMENT ===
        Route::prefix('expenses')->group(function (): void {
            // Categories
            Route::get('/categories', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'categories']);
            Route::get('/categories/active', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'activeCategories']);
            Route::post('/categories', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'storeCategory']);
            Route::get('/categories/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'showCategory']);
            Route::put('/categories/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'updateCategory']);
            Route::delete('/categories/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'destroyCategory']);

            // Expenses
            Route::get('/', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'index']);
            Route::get('/stats', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'stats']);
            Route::get('/dashboard-stats', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'dashboardStats']);
            Route::get('/pending-approvals', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'pendingApprovals']);
            Route::get('/monthly-summary', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'monthlySummary']);
            Route::get('/category-summary', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'categorySummary']);
            Route::get('/recurring-due', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'recurringDue']);
            Route::post('/', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'store']);
            Route::get('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'show']);
            Route::put('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'update']);
            Route::delete('/{uuid}', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'destroy']);
            Route::patch('/{uuid}/approve', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'approve']);
            Route::patch('/{uuid}/reject', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'reject']);
            Route::patch('/{uuid}/mark-paid', [\App\Http\Controllers\Api\V1\Admin\ExpenseController::class, 'markPaid']);
        });

        // === FINANCE & ACCOUNTING ===
        Route::prefix('finance')->group(function (): void {
            // Dashboard
            Route::get('/dashboard-stats', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'dashboardStats']);

            // Chart of Accounts
            Route::get('/accounts', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'accounts']);
            Route::post('/accounts', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'storeAccount']);
            Route::get('/accounts/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'showAccount']);
            Route::put('/accounts/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'updateAccount']);
            Route::delete('/accounts/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'destroyAccount']);

            // Journal Entries
            Route::get('/journals', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'journals']);
            Route::post('/journals', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'storeJournal']);
            Route::get('/journals/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'showJournal']);
            Route::patch('/journals/{uuid}/post', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'postJournal']);
            Route::patch('/journals/{uuid}/reverse', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'reverseJournal']);
            Route::patch('/journals/bulk-post', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'bulkPost']);

            // Reports
            Route::get('/trial-balance', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'trialBalance']);
            Route::get('/profit-loss', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'profitLoss']);
            Route::get('/balance-sheet', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'balanceSheet']);
            Route::get('/cash-flow', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'cashFlow']);

            // Financial Years
            Route::get('/financial-years', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'financialYears']);
            Route::post('/financial-years', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'storeFinancialYear']);
            Route::get('/financial-years/current', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'currentFinancialYear']);
            Route::get('/financial-years/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'showFinancialYear']);
            Route::patch('/financial-years/{uuid}/close', [\App\Http\Controllers\Api\V1\Admin\FinanceController::class, 'closeFinancialYear']);

            // Ledgers
            Route::get('/ledgers/customer/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceLedgerController::class, 'customerLedger']);
            Route::get('/ledgers/supplier/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceLedgerController::class, 'supplierLedger']);
            Route::get('/ledgers/cash-book', [\App\Http\Controllers\Api\V1\Admin\FinanceLedgerController::class, 'cashBook']);
            Route::get('/ledgers/bank-book', [\App\Http\Controllers\Api\V1\Admin\FinanceLedgerController::class, 'bankBook']);

            // Bank Accounts
            Route::get('/bank-accounts', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'bankAccounts']);
            Route::post('/bank-accounts', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'storeBankAccount']);
            Route::get('/bank-accounts/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'showBankAccount']);
            Route::put('/bank-accounts/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'updateBankAccount']);
            Route::delete('/bank-accounts/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'destroyBankAccount']);

            // Bank Reconciliation
            Route::get('/reconciliations', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'reconciliations']);
            Route::post('/reconciliations', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'storeReconciliation']);
            Route::get('/reconciliations/{uuid}', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'showReconciliation']);
            Route::patch('/reconciliations/{uuid}/complete', [\App\Http\Controllers\Api\V1\Admin\FinanceBankController::class, 'completeReconciliation']);

            // GST
            Route::get('/gst', [\App\Http\Controllers\Api\V1\Admin\GstController::class, 'index']);
            Route::post('/gst', [\App\Http\Controllers\Api\V1\Admin\GstController::class, 'store']);
            Route::get('/gst/summary', [\App\Http\Controllers\Api\V1\Admin\GstController::class, 'summary']);
            Route::get('/gst/input-tax', [\App\Http\Controllers\Api\V1\Admin\GstController::class, 'inputTax']);
            Route::get('/gst/output-tax', [\App\Http\Controllers\Api\V1\Admin\GstController::class, 'outputTax']);
            Route::get('/gst/{uuid}', [\App\Http\Controllers\Api\V1\Admin\GstController::class, 'show']);
        });
    });
});

Route::post('/v1/check-service-area', [\App\Http\Controllers\Api\V1\Master\DeliveryZoneController::class, 'checkServiceArea']);

Route::get('/v1/maintenance-status', function () {
    $enabled = \Illuminate\Support\Facades\DB::table('system_settings')
        ->where('setting_key', 'maintenance_mode')
        ->where('setting_value', 'true')
        ->where('status', 'active')
        ->exists();
    $message = \Illuminate\Support\Facades\DB::table('system_settings')
        ->where('setting_key', 'maintenance_message')
        ->value('setting_value');
    return response()->json([
        'success' => true,
        'data' => [
            'maintenance_mode' => $enabled,
            'message' => $message ?: 'We are currently under scheduled maintenance. Please check back shortly.',
        ],
    ]);
});

Route::prefix('v1/customer')->middleware('customer.maintenance')->group(function () {
    $controller = \App\Http\Controllers\Api\V1\Customer\CustomerBrowseController::class;
    Route::get('/categories', [$controller, 'getCategories']);
    Route::get('/categories/{slug}', [$controller, 'getCategoryBySlug']);
    Route::get('/meal-types', [$controller, 'getMealTypes']);
    Route::get('/meals', [$controller, 'getMeals']);
    Route::get('/meals/{slug}/related', [$controller, 'getRelatedMeals']);
    Route::get('/meals/{slug}', [$controller, 'getMealBySlug']);
    Route::get('/subscription-plans', [$controller, 'getSubscriptionPlans']);
    Route::get('/subscription-plans/{slug}', [$controller, 'getSubscriptionPlanBySlug']);
    Route::get('/weekly-menu/current', [$controller, 'getCurrentWeekMenu']);

    // Home page endpoints
    Route::get('/home/reviews', [$controller, 'getHomeReviews']);
    Route::get('/home/stats', [$controller, 'getHomeStats']);
    Route::get('/company-info', [$controller, 'getCompanyInfo']);
    Route::post('/contact', [$controller, 'submitContact']);
    Route::get('/cms/{slug}', [$controller, 'getCmsPage']);
    Route::get('/check-pincode/{pincode}', [$controller, 'checkPincode']);

    $kitchenCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerKitchenController::class;
    Route::get('/kitchen/holiday-status', [$kitchenCtrl, 'holidayStatus']);

    $pincodeCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerPincodeController::class;
    Route::post('/request-service', [$pincodeCtrl, 'requestService']);

    // Public review routes (no auth needed — customer resolved from session if available)
    $reviewCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerReviewController::class;
    Route::get('/meals/{slug}/reviews', [$reviewCtrl, 'getMealReviews']);
});

Route::prefix('v1/customer')->middleware('customer.maintenance')->group(function () {
    // Location lookups (authenticated, for address form)
    Route::middleware(['auth:customer', 'customer.active'])->group(function () {
        $custAddrCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerFrontAddressController::class;
        Route::get('/location/countries', [$custAddrCtrl, 'getCountries']);
        Route::get('/location/states/{countryUuid}', [$custAddrCtrl, 'getStates']);
        Route::get('/location/cities/{stateUuid}', [$custAddrCtrl, 'getCities']);
        Route::get('/location/areas/{cityUuid}', [$custAddrCtrl, 'getAreas']);
        Route::get('/location/pincodes/{cityUuid}', [$custAddrCtrl, 'getPincodes']);
    });

    $auth = \App\Http\Controllers\Api\V1\Customer\CustomerAuthController::class;

    // Guest routes
    Route::post('/register', [$auth, 'register']);
    Route::post('/login', [$auth, 'login']);
    Route::post('/google-login', [$auth, 'google']);
    Route::post('/send-otp', [$auth, 'sendOtp']);
    Route::post('/register-send-otp', [$auth, 'registerSendOtp']);
    Route::post('/verify-login-otp', [$auth, 'guestVerifyOtp']);
    Route::post('/register-verify-otp', [$auth, 'guestRegisterVerifyOtp']);
    Route::post('/forgot-password', [$auth, 'forgotPassword']);
    Route::post('/reset-password', [$auth, 'resetPassword']);

    // Authenticated customer routes
    Route::middleware(['auth:customer', 'customer.active'])->group(function () use ($auth) {
        Route::post('/logout', [$auth, 'logout']);
        Route::get('/profile', [$auth, 'profile']);
        Route::put('/profile', [$auth, 'updateProfile']);
        Route::post('/profile/photo', [$auth, 'uploadProfilePhoto']);
        Route::delete('/profile/photo', [$auth, 'deleteProfilePhoto']);
        Route::delete('/account', [$auth, 'deleteAccount']);
        Route::post('/verify-otp', [$auth, 'verifyOtp']);
        Route::post('/resend-otp', [$auth, 'resendOtp']);
        Route::post('/change-password', [$auth, 'changePassword']);

        // Customer cart
        $cartCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerCartController::class;
        Route::get('/cart', [$cartCtrl, 'getCart']);
        Route::get('/cart/count', [$cartCtrl, 'getCartCount']);
        Route::post('/cart/items', [$cartCtrl, 'addItem']);
        Route::put('/cart/items/{itemId}', [$cartCtrl, 'updateItem']);
        Route::delete('/cart/items/{itemId}', [$cartCtrl, 'removeItem']);
        Route::delete('/cart', [$cartCtrl, 'clearCart']);
        Route::post('/cart/coupon/apply', [$cartCtrl, 'applyCoupon']);
        Route::post('/cart/coupon/remove', [$cartCtrl, 'removeCoupon']);
        Route::post('/cart/wallet/apply', [$cartCtrl, 'applyWallet']);
        Route::post('/cart/wallet/remove', [$cartCtrl, 'removeWallet']);

        // Customer checkout & orders
        $orderCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerOrderController::class;
        Route::get('/checkout/summary', [$orderCtrl, 'getCheckoutSummary']);
        Route::post('/checkout/place-order', [$orderCtrl, 'placeOrder']);
        Route::get('/orders', [$orderCtrl, 'getOrders']);
        Route::get('/orders/{uuid}', [$orderCtrl, 'getOrder']);
        Route::post('/orders/{uuid}/cancel', [$orderCtrl, 'cancelOrder']);
        Route::post('/orders/{uuid}/reorder', [$orderCtrl, 'reorder']);
        Route::get('/orders/{uuid}/invoice', [$orderCtrl, 'downloadInvoice']);

        // Customer addresses (self-service)
        $custAddrCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerFrontAddressController::class;
        Route::get('/addresses', [$custAddrCtrl, 'index']);
        Route::post('/addresses', [$custAddrCtrl, 'store']);
        Route::get('/addresses/{uuid}', [$custAddrCtrl, 'show']);
        Route::put('/addresses/{uuid}', [$custAddrCtrl, 'update']);
        Route::delete('/addresses/{uuid}', [$custAddrCtrl, 'destroy']);
        Route::patch('/addresses/{uuid}/default', [$custAddrCtrl, 'setDefault']);

        // Customer payment
        $paymentCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerPaymentController::class;
        Route::post('/payment/create-order', [$paymentCtrl, 'createPaymentOrder']);
        Route::post('/payment/verify', [$paymentCtrl, 'verifyPayment']);
        Route::post('/payment/wallet-pay', [$paymentCtrl, 'payFromWallet']);
        Route::get('/payment/wallet-balance', [$paymentCtrl, 'getWalletBalance']);

        // Customer subscriptions
        $subCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerSubscriptionController::class;
        Route::get('/my-subscriptions', [$subCtrl, 'getMySubscriptions']);
        Route::post('/subscriptions/purchase', [$subCtrl, 'purchaseSubscription']);
        Route::get('/my-subscriptions/{uuid}', [$subCtrl, 'getMySubscription']);
        Route::post('/my-subscriptions/{uuid}/pause', [$subCtrl, 'pauseSubscription']);
        Route::post('/my-subscriptions/{uuid}/resume', [$subCtrl, 'resumeSubscription']);
        Route::post('/my-subscriptions/{uuid}/skip', [$subCtrl, 'skipMeal']);
        Route::post('/my-subscriptions/{uuid}/upgrade', [$subCtrl, 'upgradeSubscription']);
        Route::post('/my-subscriptions/{uuid}/renew', [$subCtrl, 'renewSubscription']);
        Route::post('/my-subscriptions/{uuid}/cancel', [$subCtrl, 'cancelSubscription']);
        Route::get('/my-subscriptions/{uuid}/timeline', [$subCtrl, 'getTimeline']);

        // Customer reviews
        $reviewCtrl = \App\Http\Controllers\Api\V1\Customer\CustomerReviewController::class;
        Route::get('/reviews', [$reviewCtrl, 'getMyReviews']);
        Route::post('/reviews', [$reviewCtrl, 'createReview']);
        Route::put('/reviews/{uuid}', [$reviewCtrl, 'updateReview']);
        Route::delete('/reviews/{uuid}', [$reviewCtrl, 'deleteReview']);
        Route::get('/orders/{uuid}/review-eligibility', [$reviewCtrl, 'getReviewEligibility']);
        Route::get('/meals/{slug}/review-eligibility', [$reviewCtrl, 'checkEligibilityByMeal']);
    });
});
