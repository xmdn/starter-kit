<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip CORS middleware for this specific route
        if ($request->is('api/sanctum/csrf-cookie') || $request->is('api/logout')) {
            return $next($request);
        }

        return $next($request)
                ->header('Access-Control-Allow-Origin', '*')  // Change '*' to specific domains if needed
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
