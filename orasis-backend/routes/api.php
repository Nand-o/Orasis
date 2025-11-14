<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShowcaseController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;

// fitur buat user auth nanti
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// CRUD ADMIN FITUR

// endpoint showcase
Route::apiResource('showcases', ShowcaseController::class);

// endpoint untuk Tag
Route::apiResource('tags', TagController::class);

// endpoint user
Route::apiResource('users', UserController::class);