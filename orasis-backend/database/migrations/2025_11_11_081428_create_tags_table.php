<?php
/**
 * Migration: create_tags_table
 * Deskripsi: Membuat tabel `tags` untuk menyimpan tag yang dapat dikaitkan ke showcases.
 * Kolom penting: id, name, slug, timestamps
 * Catatan: Tag digunakan melalui relasi many-to-many (pivot `showcase_tag`).
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
        Schema::create('tags', function (Blueprint $table) {
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
        Schema::dropIfExists('tags');
    }
};
