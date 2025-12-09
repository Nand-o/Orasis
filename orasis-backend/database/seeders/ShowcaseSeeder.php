<?php
/**
 * Seeder: ShowcaseSeeder
 * Deskripsi: Mengisi tabel `showcases` dari file CSV `database/data/showcase_data.csv`.
 * Format CSV: kolom minimal yang diharapkan termasuk title, category_name, description, tags(json/string), url_website, image_url, logo_url
 * Perilaku:
 * - Membaca CSV baris per baris, membuat atau mengambil (firstOrCreate) setiap showcase berdasarkan `title`.
 * - Menyinkronkan tag yang ditemukan pada kolom tags; tag dibuat menggunakan Tag::firstOrCreate().
 * - Menetapkan `status` = 'approved' untuk data seeded.
 * Catatan penting:
 * - Pastikan file `database/data/showcase_data.csv` tersedia sebelum menjalankan seeder.
 * - Seeder ini mengandalkan tabel `categories` untuk memetakan nama kategori ke `category_id`.
 */

namespace Database\Seeders;

use App\Models\Showcase;
use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ShowcaseSeeder extends Seeder
{
    /**
     * Get category ID by name
     */
    private function getCategoryId($categoryName)
    {
        $category = DB::table('categories')->where('name', $categoryName)->first();
        return $category ? $category->id : 1; 
    }
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvPath = base_path('database/data/showcase_data.csv');

        if (!File::exists($csvPath)) {
            $this->command->error("CSV file not found at: $csvPath");
            return;
        }

        $file = fopen($csvPath, "r");
        fgetcsv($file);

        $index = 0; 

        while (($data = fgetcsv($file, 2000, ",")) !== FALSE) {
            
            $rawTags = $data[3];
            $validJsonTags = str_replace("'", '"', $rawTags);
            $tagsArray = json_decode($validJsonTags) ?? [];

            $daysAgo = max(0, 21 - $index);
            $timestamp = now()->subDays($daysAgo);

            $logoUrl = $data[6] ?? null;
            if ($logoUrl && strlen($logoUrl) > 255) {
                $logoUrl = null;
            }

            $showcase = Showcase::firstOrCreate(
                [
                    'title' => $data[0] 
                ],
                [
                    'user_id'       => rand(2, 4),
                    'category_id'   => $this->getCategoryId($data[1]),
                    'description'   => $data[2],
                    'url_website'   => $data[4], 
                    'image_url'     => $data[5],
                    'logo_url'      => $logoUrl,
                    'status'        => 'approved',
                    'created_at'    => $timestamp,
                    'updated_at'    => $timestamp,
                ]
            );

            if (!empty($tagsArray)) {
                $tagIds = [];
                foreach ($tagsArray as $tagName) {
                    $cleanName = trim($tagName);
                    
                    $tag = Tag::firstOrCreate(
                        ['name' => $cleanName], 
                    );
                    
                    $tagIds[] = $tag->id;
                }
                
                $showcase->tags()->sync($tagIds);
            }

            $index++;
        }

        fclose($file);
        $this->command->info('Showcase data seeded from CSV successfully!');
    }
}
