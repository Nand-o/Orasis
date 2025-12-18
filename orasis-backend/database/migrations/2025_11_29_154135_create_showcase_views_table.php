<?php
/**
 * Migration: create_showcase_views_table
 * Deskripsi: Menyimpan log kunjungan (views) untuk setiap showcase.
 * Kolom penting: id, showcase_id (FK), user_id (nullable), ip_address, user_agent, created_at
 * Catatan: Digunakan untuk menghitung views unik dan mencegah double-count dalam periode tertentu.
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
        Schema::create('showcase_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('showcase_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('ip_address', 45); // IPv6 compatible
            $table->string('user_agent')->nullable();
            $table->timestamp('viewed_at');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('showcase_id');
            $table->index('viewed_at');
            $table->index(['showcase_id', 'ip_address', 'viewed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('showcase_views');
    }
};
