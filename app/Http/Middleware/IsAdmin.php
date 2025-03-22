<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // return dd(!Auth::check());
        // Check if the authenticated user is an admin
        if (!Auth::check() || !Auth::user()->whichRole() === 'admin') {
            // Redirect to login or show unauthorized error if not an admin
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
