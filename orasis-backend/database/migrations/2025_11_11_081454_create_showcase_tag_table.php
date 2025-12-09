<?php
/**
 * Migration: create_showcase_tag_table
 * Deskripsi: Pivot table many-to-many antara `showcases` dan `tags`.
 * Kolom penting: showcase_id (FK ke showcases.id), tag_id (FK ke tags.id)
 * Catatan: Biasanya tidak memerlukan timestamps, hanya relasi.
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
        Schema::create('showcase_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('showcase_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('showcase_tag');
    }
};
