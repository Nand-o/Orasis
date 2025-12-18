<?php
/**
 * Seeder: DatabaseSeeder
 * Deskripsi: Seeder utama yang memanggil seeder-seeder lain untuk mengisi data awal aplikasi.
 * Urutan: User -> Category -> Tag -> Showcase -> Collection
 * Catatan: ShowcaseSeeder membaca data dari `database/data/showcase_data.csv` sehingga pastikan file CSV tersedia jika ingin mengisi data showcase.
 */

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            TagSeeder::class,
            ShowcaseSeeder::class,
            CollectionSeeder::class
        ]);
    }
}
