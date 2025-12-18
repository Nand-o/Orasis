<?php

/**
 * Console Routes
 *
 * Mendefinisikan perintah artisan custom untuk project ini. Contoh di bawah
 * hanya merupakan contoh bawaan Laravel untuk menampilkan kutipan inspiratif.
 */

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
