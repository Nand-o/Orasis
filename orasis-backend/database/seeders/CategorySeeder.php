<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'E-commerce', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Portfolio', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Blog', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Corporate', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Landing Page', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'SaaS', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Dashboard', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Social Media', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Education', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Entertainment', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mobile', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('categories')->insert($categories);
    }
}
