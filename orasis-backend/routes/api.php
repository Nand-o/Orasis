<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShowcaseController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

// public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// showcase & tags (read only)
Route::get('/showcases', [ShowcaseController::class, 'index']);
Route::get('/showcases/{id}', [ShowcaseController::class, 'show']);
Route::get('/tags', [TagController::class, 'index']);

// protected routes (harus login)
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // user collection/wishlist
    // Route::apiResource('collections', CollectionController::class);

    // admin routes
    Route::middleware('is.admin')->group(function () {
        // Admin bisa Create/Update/Delete Showcase & Tags
        Route::apiResource('showcases', ShowcaseController::class)->except(['index', 'show']);
        Route::apiResource('tags', TagController::class)->except(['index']);
        
        // Admin kelola User
        Route::apiResource('users', UserController::class);
    });
});


