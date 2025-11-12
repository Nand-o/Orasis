<?php

namespace Database\Seeders;

use App\Models\Showcase;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShowcaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ADD URL 
        $showcases = [
            [
                'user_id' => 1,
                'title' => 'Minimalist Portfolio Website',
                'url_website' => 'https://dribbble.com/shots/portfolio-minimalist',
                'description' => 'A clean and modern portfolio layout for designers.',
                'image_url' => 'https://placehold.co/600x400?text=Portfolio+Web',
                'category' => 'Web Design',
            ],
            [
                'user_id' => 2,
                'title' => 'Mobile App Dashboard UI',
                'url_website' => 'https://dribbble.com/shots/mobile-dashboard-ui',
                'description' => 'Dashboard interface for mobile productivity apps.',
                'image_url' => 'https://placehold.co/600x400?text=Dashboard+UI',
                'category' => 'App Design',
            ],
            [
                'user_id' => 3,
                'title' => 'Creative Poster Design',
                'url_website' => 'https://behance.net/gallery/creative-poster-design',
                'description' => 'Poster concept for an art exhibition with bold typography.',
                'image_url' => 'https://placehold.co/600x400?text=Poster+Design',
                'category' => 'Graphic Design',
            ],
        ];

        foreach ($showcases as $item) {
            Showcase::create($item);
        }
    }
}
