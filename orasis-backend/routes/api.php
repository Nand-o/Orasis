<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShowcaseController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminShowcaseController;
use App\Http\Controllers\CollectionController;

// === PUBLIC route ===
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Lihat Showcase (yang approved) & Tag
Route::get('/showcases', [ShowcaseController::class, 'index']);
Route::get('/showcases/{id}', [ShowcaseController::class, 'show']);
Route::get('/tags', [TagController::class, 'index']);


// === PROTECTED route ===
Route::middleware('auth:sanctum')->group(function () {

    // Profil & Logout
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::post('/logout', [AuthController::class, 'logout']);

    // User Action: Upload, Edit, Hapus Punya Sendiri
    Route::post('/showcases', [ShowcaseController::class, 'store']);
    Route::put('/showcases/{id}', [ShowcaseController::class, 'update']);
    Route::delete('/showcases/{id}', [ShowcaseController::class, 'destroy']);

    // === COLLECTION MANAGEMENT (Fitur User) ===
    Route::apiResource('collections', CollectionController::class);

    // Fitur Bookmark (Masukin/Keluarin item)
    Route::post('/collections/{collection}/showcases', [CollectionController::class, 'addShowcase']);
    Route::delete('/collections/{collection}/showcases/{showcase}', [CollectionController::class, 'removeShowcase']);

    // === KHUSUS ADMIN ===
    Route::middleware('is.admin')->group(function () {
        
        // Moderasi Showcase
        Route::get('/admin/showcases/pending', [AdminShowcaseController::class, 'indexPending']);
        Route::patch('/admin/showcases/{id}/status', [AdminShowcaseController::class, 'updateStatus']);

        // Manajemen User (Full CRUD)
        Route::apiResource('users', UserController::class);

        // Manajemen Tag (Create/Update/Delete hanya admin)
        Route::post('/tags', [TagController::class, 'store']);
        Route::put('/tags/{id}', [TagController::class, 'update']);
        Route::delete('/tags/{id}', [TagController::class, 'destroy']);
    });
});