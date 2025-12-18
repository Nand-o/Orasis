<?php
/**
 * Migration: add_status_to_showcases_table
 * Deskripsi: Menambahkan kolom `status` pada tabel `showcases` untuk mendukung alur moderasi.
 * Kolom tambahan: status (enum/string) — contoh nilai: 'published', 'pending', 'rejected', 'draft'
 * Catatan: Perubahan ini digunakan untuk memisahkan konten yang harus dimoderasi sebelum tampil publik.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('showcases', function (Blueprint $table) {
            // Menambahkan kolom status setelah kolom category
            // Default 'pending' agar setiap upload baru harus dicek dulu
            $table->enum('status', ['pending', 'approved', 'rejected'])
                  ->default('pending')
                  ->after('category');
        });
    }

    public function down()
    {
        Schema::table('showcases', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
