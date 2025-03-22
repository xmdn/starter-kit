<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('{any?}', function() {
    return view('application');
})->where('any', '.*');

// Route::get('/', function () {
//     return Inertia::render('home'); // This loads `resources/js/Pages/Home.vue`
// });

// Route::get('/test', function () {
//     return Inertia::render('Testing'); // This loads `resources/js/Pages/Home.vue`
// });

// Route::get('/another', function () {
//     return view('application');
// });
