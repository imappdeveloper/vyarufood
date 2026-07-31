<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CheckCustomerMaintenance
{
    public function handle(Request $request, Closure $next): Response
    {
        $maintenanceMode = DB::table('system_settings')
            ->where('setting_key', 'maintenance_mode')
            ->where('setting_value', 'true')
            ->where('status', 'active')
            ->exists();

        if ($maintenanceMode) {
            $message = DB::table('system_settings')
                ->where('setting_key', 'maintenance_message')
                ->value('setting_value');

            return response()->json([
                'success' => false,
                'maintenance_mode' => true,
                'message' => $message ?: 'We are currently under scheduled maintenance. Please check back shortly.',
            ], 503);
        }

        return $next($request);
    }
}
