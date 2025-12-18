<?php
/**
 * Provider: AppServiceProvider
 * Deskripsi: Tempat untuk mendaftarkan layanan (services) aplikasi dan melakukan bootstrapping umum.
 * Catatan: Pada proyek ini file ini saat ini kosong kecuali stub standar Laravel.
 * Gunakan metode `register()` untuk binding container dan `boot()` untuk event/observer atau macro yang perlu dieksekusi saat aplikasi mulai.
 */

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Tempat mendaftarkan binding service container bila diperlukan.
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Tempat bootstrap seperti observer model, custom validation, atau macro.
    }
}
