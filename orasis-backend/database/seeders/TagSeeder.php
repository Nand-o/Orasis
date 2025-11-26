<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tags yang digunakan di FilterBar frontend
        $tags = [
            'modern',
            'minimal', 
            'dark',
            'colorful',
            'professional',
            'creative',
            'clean',
            'responsive',
            'dashboard',
            'landing'
        ];
        
        foreach ($tags as $name) {
            Tag::firstOrCreate(['name' => $name]);
        }
    }
}
