<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShowcaseController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

// public route
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// protected route
Route::middleware('auth:sanctum')->group(function () {
    
    // endpoint untuk mengambil data user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // endpoint logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // admin route
    // Rute ini harus login and admin
    Route::middleware('is.admin')->group(function () {

    // endpoint showcase
    Route::apiResource('showcases', ShowcaseController::class);

    // endpoint untuk Tag
    Route::apiResource('tags', TagController::class);

    // endpoint user
    Route::apiResource('users', UserController::class);
    });
});


