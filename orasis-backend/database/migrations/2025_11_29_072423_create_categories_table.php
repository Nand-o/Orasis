<?php
/**
 * Migration: create_categories_table
 * Deskripsi: Tabel `categories` berisi daftar kategori yang bisa dikaitkan ke showcases.
 * Kolom penting: id, name, slug, timestamps
 * Catatan: Beberapa migrasi mengubah cara kategori disimpan pada tabel `showcases` (dari string ke `category_id`).
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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
