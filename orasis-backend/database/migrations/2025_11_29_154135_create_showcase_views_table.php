<?php

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
