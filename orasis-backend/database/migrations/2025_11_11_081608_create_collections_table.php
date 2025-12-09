<?php
/**
 * Migration: create_collections_table
 * Deskripsi: Membuat tabel `collections` untuk menyimpan kumpulan (koleksi) showcase yang dibuat pengguna.
 * Kolom penting: id, user_id (pemilik), name, description, timestamps
 * Catatan: Koleksi dikaitkan ke showcases melalui pivot `collection_showcase`.
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
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collections');
    }
};
