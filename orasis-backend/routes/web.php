<?php

/**
 * Web Routes
 *
 * Routes yang berkaitan dengan tampilan web tradisional (blade/views).
 * Untuk aplikasi SPA Orasis, hampir semua trafik API ditangani melalui
 * `routes/api.php`. File ini tetap menyimpan route dasar untuk halaman
 * server-rendered jika diperlukan (contoh: landing page fallback).
 */

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
