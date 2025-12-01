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
        Schema::table('showcases', function (Blueprint $table) {
            // Drop old category column
            $table->dropColumn('category');
            
            // Add new category_id foreign key
            $table->foreignId('category_id')->nullable()->after('image_url')->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('showcases', function (Blueprint $table) {
            // Drop foreign key and category_id column
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
            
            // Add back old category column
            $table->string('category')->nullable();
        });
    }
};
