<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Auth\Admin;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->isActive()) {
            auth()->guard('admin')->logout();
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated. Please contact administrator.',
            ], 403);
        }

        return $next($request);
    }
}
