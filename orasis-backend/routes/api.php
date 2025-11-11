<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShowcaseController;
use App\Http\Controllers\TagController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// -- CRUD UNTUK ADMIN FITUR (TUGAS MINGGU KE-3) --

// Ini secara otomatis membuat 7 endpoint untuk Showcase (index, show, store, update, destroy, dll)
Route::apiResource('showcases', ShowcaseController::class);

// Ini membuat endpoint untuk Tag
Route::apiResource('tags', TagController::class);

// Catatan: Rute untuk 'Collection' akan kita buat di Minggu ke-4
// karena sangat bergantung pada Autentikasi Pengguna.