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
            $this->command->error("File CSV tidak ditemukan di: $csvPath");
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
                    'user_id'       => rand(1, 3),
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

        /*$showcases = [
            // E-commerce Designs
            [
                'user_id' => 1,
                'title' => 'Modern E-commerce Landing Page',
                'url_website' => 'https://www.apple.com',
                'description' => 'Clean and minimalist e-commerce design with focus on products and user experience.',
                'image_url' => 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop',
                'category' => 'E-commerce',
                'status' => 'approved',
                'status' => 'approved',
                'tags' => ['modern', 'minimal', 'clean', 'responsive'],
            ],
            [
                'user_id' => 2,
                'title' => 'Fashion Store Website',
                'url_website' => 'https://www.nike.com',
                'description' => 'Bold and stylish fashion e-commerce platform with immersive product showcases.',
                'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
                'category' => 'E-commerce',
                'status' => 'approved',
                'tags' => ['colorful', 'modern', 'responsive', 'creative'],
            ],
            [
                'user_id' => 3,
                'title' => 'Electronics Store Platform',
                'url_website' => 'https://www.samsung.com',
                'description' => 'Modern electronics e-commerce with product comparisons and tech specs.',
                'image_url' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
                'category' => 'E-commerce',
                'status' => 'approved',
                'tags' => ['modern', 'professional', 'clean', 'responsive'],
            ],
            
            // SaaS Platforms
            [
                'user_id' => 1,
                'title' => 'Project Management Dashboard',
                'url_website' => 'https://www.asana.com',
                'description' => 'Comprehensive SaaS dashboard for team collaboration and project tracking.',
                'image_url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
                'category' => 'SaaS',
                'status' => 'approved',
                'tags' => ['dashboard', 'professional', 'modern', 'clean'],
            ],
            [
                'user_id' => 3,
                'title' => 'Analytics Platform Interface',
                'url_website' => 'https://analytics.google.com',
                'description' => 'Data visualization and analytics SaaS platform with real-time insights.',
                'image_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'category' => 'SaaS',
                'status' => 'approved',
                'tags' => ['dashboard', 'modern', 'professional', 'dark'],
            ],
            [
                'user_id' => 2,
                'title' => 'Customer Support Software',
                'url_website' => 'https://www.zendesk.com',
                'description' => 'Modern help desk and customer support platform for businesses.',
                'image_url' => 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
                'category' => 'SaaS',
                'status' => 'approved',
                'tags' => ['modern', 'clean', 'professional', 'responsive'],
            ],
            
            // Portfolio Websites
            [
                'user_id' => 1,
                'title' => 'Creative Designer Portfolio',
                'url_website' => 'https://www.behance.net',
                'description' => 'Stunning portfolio website showcasing creative design work with smooth animations.',
                'image_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
                'category' => 'Portfolio',
                'status' => 'approved',
                'tags' => ['creative', 'colorful', 'modern', 'responsive'],
            ],
            [
                'user_id' => 3,
                'title' => 'Photography Portfolio',
                'url_website' => 'https://www.instagram.com',
                'description' => 'Elegant photography portfolio with fullscreen image galleries.',
                'image_url' => 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
                'category' => 'Portfolio',
                'status' => 'approved',
                'tags' => ['minimal', 'clean', 'modern', 'responsive'],
            ],
            [
                'user_id' => 2,
                'title' => 'Developer Portfolio',
                'url_website' => 'https://github.com',
                'description' => 'Minimalist developer portfolio highlighting projects and technical skills.',
                'image_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
                'category' => 'Portfolio',
                'status' => 'approved',
                'tags' => ['minimal', 'dark', 'professional', 'clean'],
            ],
            
            // Landing Pages
            [
                'user_id' => 1,
                'title' => 'Startup Product Launch',
                'url_website' => 'https://www.producthunt.com',
                'description' => 'High-converting landing page for startup product launch with clear CTAs.',
                'image_url' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
                'category' => 'Landing Page',
                'status' => 'approved',
                'tags' => ['landing', 'modern', 'colorful', 'clean'],
            ],
            [
                'user_id' => 3,
                'title' => 'Mobile App Landing Page',
                'url_website' => 'https://www.apple.com/app-store',
                'description' => 'Engaging mobile app landing page with app screenshots and features.',
                'image_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
                'category' => 'Landing Page',
                'status' => 'approved',
                'tags' => ['landing', 'modern', 'minimal', 'responsive'],
            ],
            [
                'user_id' => 2,
                'title' => 'SaaS Marketing Landing',
                'url_website' => 'https://www.salesforce.com',
                'description' => 'Professional SaaS marketing page with pricing tables and testimonials.',
                'image_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'category' => 'Landing Page',
                'status' => 'approved',
                'tags' => ['landing', 'professional', 'clean', 'modern'],
            ],
            
            // Dashboard Designs
            [
                'user_id' => 1,
                'title' => 'Admin Dashboard Template',
                'url_website' => 'https://www.figma.com',
                'description' => 'Comprehensive admin dashboard with charts, tables, and user management.',
                'image_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'category' => 'Dashboard',
                'status' => 'approved',
                'tags' => ['dashboard', 'professional', 'modern', 'dark'],
            ],
            [
                'user_id' => 2,
                'title' => 'E-commerce Admin Panel',
                'url_website' => 'https://www.shopify.com/admin',
                'description' => 'Feature-rich e-commerce admin panel for managing products and orders.',
                'image_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'category' => 'Dashboard',
                'status' => 'approved',
                'tags' => ['dashboard', 'professional', 'clean', 'modern'],
            ],
            [
                'user_id' => 3,
                'title' => 'Financial Dashboard UI',
                'url_website' => 'https://www.stripe.com/dashboard',
                'description' => 'Modern financial dashboard with revenue tracking and payment analytics.',
                'image_url' => 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=600&fit=crop',
                'category' => 'Dashboard',
                'status' => 'approved',
                'tags' => ['dashboard', 'professional', 'dark', 'modern'],
            ],
            
            // Mobile App Designs
            [
                'user_id' => 1,
                'title' => 'Fitness Tracker App',
                'url_website' => 'https://www.nike.com/ntc-app',
                'description' => 'Mobile fitness app with workout tracking, progress charts, and social features.',
                'image_url' => 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop',
                'category' => 'Mobile',
                'status' => 'approved',
                'tags' => ['modern', 'colorful', 'clean', 'responsive'],
            ],
            [
                'user_id' => 2,
                'title' => 'Banking Mobile App',
                'url_website' => 'https://www.example.com/banking',
                'description' => 'Secure mobile banking app with transactions, transfers, and account management.',
                'image_url' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
                'category' => 'Mobile',
                'status' => 'approved',
                'tags' => ['professional', 'dark', 'clean', 'modern'],
            ],
            [
                'user_id' => 3,
                'title' => 'Food Delivery App UI',
                'url_website' => 'https://www.ubereats.com',
                'description' => 'Intuitive food delivery app with restaurant browsing and order tracking.',
                'image_url' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
                'category' => 'Mobile',
                'status' => 'approved',
                'tags' => ['colorful', 'modern', 'clean', 'responsive'],
            ],
            [
                'user_id' => 1,
                'title' => 'Social Media App Design',
                'url_website' => 'https://www.instagram.com',
                'description' => 'Modern social media app with stories, reels, and messaging features.',
                'image_url' => 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
                'category' => 'Mobile',
                'status' => 'approved',
                'tags' => ['colorful', 'modern', 'creative', 'responsive'],
            ],
            [
                'user_id' => 2,
                'title' => 'Travel Booking App',
                'url_website' => 'https://www.airbnb.com',
                'description' => 'Travel and hotel booking mobile app with interactive maps and reviews.',
                'image_url' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
                'category' => 'Mobile',
                'status' => 'approved',
                'tags' => ['modern', 'clean', 'colorful', 'responsive'],
            ],
            [
                'user_id' => 3,
                'title' => 'Music Streaming App',
                'url_website' => 'https://www.spotify.com',
                'description' => 'Music streaming app with playlists, podcasts, and personalized recommendations.',
                'image_url' => 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
                'category' => 'Mobile',
                'status' => 'approved',
                'tags' => ['dark', 'modern', 'colorful', 'creative'],
            ],
            
            // PENDING SHOWCASES - Waiting for Admin Review
            [
                'user_id' => 2, // Regular user (not admin)
                'title' => 'Fitness Tracking App Redesign',
                'url_website' => 'https://www.nike.com/ntc-app',
                'description' => 'Modern fitness tracking application with workout plans, progress tracking, and social features. Built with React Native and features smooth animations.',
                'image_url' => 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
                'category' => 'Mobile',
                'status' => 'pending',
                'tags' => ['modern', 'clean', 'colorful', 'responsive'],
            ],
            [
                'user_id' => 3, // Regular user
                'title' => 'Real Estate Marketplace Platform',
                'url_website' => 'https://www.zillow.com',
                'description' => 'Comprehensive real estate platform with property listings, 3D tours, mortgage calculator, and agent connections. Features advanced search filters and map integration.',
                'image_url' => 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
                'category' => 'E-commerce',
                'status' => 'pending',
                'tags' => ['modern', 'professional', 'clean', 'responsive'],
            ],
            [
                'user_id' => 2, // Regular user
                'title' => 'Online Learning Platform Dashboard',
                'url_website' => 'https://www.coursera.org',
                'description' => 'Interactive e-learning platform with video courses, quizzes, progress tracking, and certificates. Includes instructor dashboard and student analytics.',
                'image_url' => 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
                'category' => 'SaaS',
                'status' => 'pending',
                'tags' => ['modern', 'clean', 'professional', 'responsive'],
            ],
            [
                'user_id' => 3, // Regular user
                'title' => 'Cryptocurrency Exchange Interface',
                'url_website' => 'https://www.coinbase.com',
                'description' => 'Professional crypto trading platform with real-time charts, order book, portfolio tracking, and secure wallet management. Dark theme optimized for traders.',
                'image_url' => 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop',
                'category' => 'Dashboard',
                'status' => 'pending',
                'tags' => ['dark', 'modern', 'professional', 'dashboard'],
            ],
            [
                'user_id' => 2, // Regular user
                'title' => 'Restaurant Booking & Menu App',
                'url_website' => 'https://www.opentable.com',
                'description' => 'Elegant restaurant discovery and booking app with digital menus, reviews, and reservation management. Features beautiful food photography and smooth UX.',
                'image_url' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
                'category' => 'Mobile',
                'status' => 'pending',
                'tags' => ['modern', 'clean', 'colorful', 'responsive'],
            ],
        ];

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
        }*/
    }
}
