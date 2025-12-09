<?php
/**
 * Migration: create_showcases_table
 * Deskripsi: Membuat tabel `showcases` untuk menyimpan karya / project yang diunggah oleh pengguna.
 * Kolom penting:
 * - id: primary key
 * - user_id: foreign key ke `users.id` (pemilik showcase)
 * - title: judul showcase
 * - url_website: (opsional) URL terkait showcase
 * - description: deskripsi teks
 * - image_url: path / URL gambar utama
 * - category: (awal) menyimpan nama kategori sebagai string; terdapat migrasi tambahan untuk mengubahnya ke `category_id`.
 * - timestamps: created_at, updated_at
 * Catatan: Beberapa kolom dan optimisasi (status, logo_url, views_count) ditambahkan oleh migrasi terpisah.
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
        Schema::create('showcases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('url_website');
            $table->text('description')->nullable();
            $table->string('image_url');
            $table->string('category')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('showcases');
    }
};
