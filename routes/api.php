<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostsController;

// CSRF Token Route
Route::get('/sanctum/csrf-cookie', [AuthController::class, 'getCsrfToken']);

// Authentication Routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Register route for handling registration
Route::post('/register', [AuthController::class, 'register'])->name('register');


Route::get('/anot', function () {
    return dd('fdfdfdf');
});

Route::middleware(['auth:sanctum' , 'role'])->group(function () {
    Route::get('/posts', [PostsController::class, 'index']); // Get posts
    Route::post('/posts', [PostsController::class, 'store']); // Create post
    Route::put('/posts/{id}', [PostsController::class, 'update']); // Edit post
    Route::delete('/posts/{id}', [PostsController::class, 'destroy']); // Delete post
});
