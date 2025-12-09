<?php
/**
 * Seeder: CollectionSeeder
 * Deskripsi: Membuat beberapa contoh koleksi (collections) untuk pengguna tertentu.
 * Catatan: Menggunakan `Collection::firstOrCreate()` sehingga seeder ini idempotent (aman dijalankan berulang).
 */

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collections = [
            ['user_id' => 1, 'name' => 'Poster'],
            ['user_id' => 2, 'name' => 'UI Inspirations'],
            ['user_id' => 3, 'name' => 'Poster Favourites'],
        ];

        foreach ($collections as $item) {
            Collection::firstOrCreate(
                ['user_id' => $item['user_id'], 'name' => $item['name']]
            );
        }
    }
}
