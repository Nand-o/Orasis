<?php
/**
 * Migration: create_collection_showcase_table
 * Deskripsi: Pivot table many-to-many antara `collections` dan `showcases`.
 * Kolom penting: collection_id (FK ke collections.id), showcase_id (FK ke showcases.id)
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
        Schema::create('collection_showcase', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')->constrained()->onDelete('cascade');
            $table->foreignId('showcase_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collection_showcase');
    }
};
