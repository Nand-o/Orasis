<?php
/**
 * Migration: add_views_count_to_showcases_table
 * Deskripsi: Menambahkan kolom `views_count` pada tabel `showcases` untuk menyimpan angka hitungan sederhana.
 * Catatan: Selain `showcase_views` yang menyimpan detail per-view, kolom ini berguna untuk agregasi cepat.
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
            $table->unsignedBigInteger('views_count')->default(0)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('showcases', function (Blueprint $table) {
            $table->dropColumn('views_count');
        });
    }
};
