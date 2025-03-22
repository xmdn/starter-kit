<?php

use Illuminate\Foundation\Application;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;

// use Illuminate\Http\Middleware\HandleCors;
// use App\Http\Middleware\CorsMiddleware;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Routing\Middleware\SubstituteBindings;
use App\Http\Middleware\IsAdmin;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Route::middleware(['auth:sanctum', 'throttle:60,1'])
            //     ->group(base_path('routes/api.php'));
    })
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            TrustProxies::class,  // Middleware to trust proxies for load-balanced apps
            SubstituteBindings::class,  // Essential for route binding
            // EnsureFrontendRequestsAreStateful::class,  // Required for Sanctum to handle stateful requests (cookies)
            // CorsMiddleware::class,
            // HandleCors::class,
            
            // IsAdmin::class,
        ]);

        $middleware->alias([
            'role' => IsAdmin::class,
        ]);
        // $middleware->web(append: [HandleInertiaRequests::class,]); // Inertia Middleware for Vue.js handle
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
