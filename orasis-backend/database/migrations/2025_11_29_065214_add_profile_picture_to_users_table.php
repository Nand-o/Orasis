<?php
/**
 * Migration: add_profile_picture_to_users_table
 * Deskripsi: Menambahkan kolom `profile_picture` di tabel `users` untuk menyimpan path/URL foto profil.
 * Catatan: Kolom ini biasanya berisi path ke direktori storage/public atau URL lengkap bila disimpan di CDN.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_picture')->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('profile_picture');
        });
    }
};
