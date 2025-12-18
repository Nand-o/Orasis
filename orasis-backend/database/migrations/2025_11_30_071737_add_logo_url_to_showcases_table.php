<?php
/**
 * Migration: add_logo_url_to_showcases_table
 * Deskripsi: Menambahkan kolom `logo_url` pada tabel `showcases` untuk menyimpan path/logo perusahaan/brand terkait.
 * Catatan: Logo berguna untuk tampilan daftar atau preview pada UI.
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
        Schema::table('showcases', function (Blueprint $table) {
            $table->string('logo_url')->nullable()->after('image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('showcases', function (Blueprint $table) {
            $table->dropColumn('logo_url');
        });
    }
};
