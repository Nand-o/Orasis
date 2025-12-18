<?php
/**
 * Migration: create_personal_access_tokens_table
 * Deskripsi: Tabel standar Laravel Sanctum untuk menyimpan token akses pribadi.
 * Kolom penting: id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at
 * Catatan: Jangan ubah skema ini kecuali ada kebutuhan khusus untuk integrasi token.
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
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
