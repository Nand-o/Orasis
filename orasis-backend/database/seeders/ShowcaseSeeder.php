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
        $showcases = [
            // E-commerce Designs
            [
                'user_id' => 1,
                'title' => 'Modern E-commerce Landing Page',
                'url_website' => 'https://www.apple.com',
                'description' => 'Clean and minimalist e-commerce design with focus on products and user experience.',
                'image_url' => 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop',
                'category' => 'E-commerce',
            ],
            [
                'user_id' => 2,
                'title' => 'Fashion Store Website',
                'url_website' => 'https://www.nike.com',
                'description' => 'Bold and stylish fashion e-commerce platform with immersive product showcases.',
                'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
                'category' => 'E-commerce',
            ],
            [
                'user_id' => 3,
                'title' => 'Electronics Store Platform',
                'url_website' => 'https://www.samsung.com',
                'description' => 'Modern electronics e-commerce with product comparisons and tech specs.',
                'image_url' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
                'category' => 'E-commerce',
            ],
            
            // SaaS Platforms
            [
                'user_id' => 1,
                'title' => 'Project Management Dashboard',
                'url_website' => 'https://www.asana.com',
                'description' => 'Comprehensive SaaS dashboard for team collaboration and project tracking.',
                'image_url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
                'category' => 'SaaS',
            ],
            [
                'user_id' => 3,
                'title' => 'Analytics Platform Interface',
                'url_website' => 'https://analytics.google.com',
                'description' => 'Data visualization and analytics SaaS platform with real-time insights.',
                'image_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'category' => 'SaaS',
            ],
            [
                'user_id' => 2,
                'title' => 'Customer Support Software',
                'url_website' => 'https://www.zendesk.com',
                'description' => 'Modern help desk and customer support platform for businesses.',
                'image_url' => 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
                'category' => 'SaaS',
            ],
            
            // Portfolio Websites
            [
                'user_id' => 1,
                'title' => 'Creative Designer Portfolio',
                'url_website' => 'https://www.behance.net',
                'description' => 'Stunning portfolio website showcasing creative design work with smooth animations.',
                'image_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
                'category' => 'Portfolio',
            ],
            [
                'user_id' => 3,
                'title' => 'Photography Portfolio',
                'url_website' => 'https://www.instagram.com',
                'description' => 'Elegant photography portfolio with fullscreen image galleries.',
                'image_url' => 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
                'category' => 'Portfolio',
            ],
            [
                'user_id' => 2,
                'title' => 'Developer Portfolio',
                'url_website' => 'https://github.com',
                'description' => 'Minimalist developer portfolio highlighting projects and technical skills.',
                'image_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
                'category' => 'Portfolio',
            ],
            
            // Landing Pages
            [
                'user_id' => 1,
                'title' => 'Startup Product Launch',
                'url_website' => 'https://www.producthunt.com',
                'description' => 'High-converting landing page for startup product launch with clear CTAs.',
                'image_url' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
                'category' => 'Landing Page',
            ],
            [
                'user_id' => 3,
                'title' => 'Mobile App Landing Page',
                'url_website' => 'https://www.apple.com/app-store',
                'description' => 'Engaging mobile app landing page with app screenshots and features.',
                'image_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
                'category' => 'Landing Page',
            ],
            [
                'user_id' => 2,
                'title' => 'SaaS Marketing Landing',
                'url_website' => 'https://www.salesforce.com',
                'description' => 'Professional SaaS marketing page with pricing tables and testimonials.',
                'image_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'category' => 'Landing Page',
            ],
            
            // Dashboard Designs
            [
                'user_id' => 1,
                'title' => 'Admin Dashboard Template',
                'url_website' => 'https://www.figma.com',
                'description' => 'Comprehensive admin dashboard with charts, tables, and user management.',
                'image_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                'category' => 'Dashboard',
            ],
            [
                'user_id' => 2,
                'title' => 'E-commerce Admin Panel',
                'url_website' => 'https://www.shopify.com/admin',
                'description' => 'Feature-rich e-commerce admin panel for managing products and orders.',
                'image_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                'category' => 'Dashboard',
            ],
            [
                'user_id' => 3,
                'title' => 'Financial Dashboard UI',
                'url_website' => 'https://www.stripe.com/dashboard',
                'description' => 'Modern financial dashboard with revenue tracking and payment analytics.',
                'image_url' => 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=600&fit=crop',
                'category' => 'Dashboard',
            ],
            
            // Mobile App Designs
            [
                'user_id' => 1,
                'title' => 'Fitness Tracker App',
                'url_website' => 'https://www.nike.com/ntc-app',
                'description' => 'Mobile fitness app with workout tracking, progress charts, and social features.',
                'image_url' => 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop',
                'category' => 'Mobile',
            ],
            [
                'user_id' => 2,
                'title' => 'Banking Mobile App',
                'url_website' => 'https://www.example.com/banking',
                'description' => 'Secure mobile banking app with transactions, transfers, and account management.',
                'image_url' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
                'category' => 'Mobile',
            ],
            [
                'user_id' => 3,
                'title' => 'Food Delivery App UI',
                'url_website' => 'https://www.ubereats.com',
                'description' => 'Intuitive food delivery app with restaurant browsing and order tracking.',
                'image_url' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
                'category' => 'Mobile',
            ],
            [
                'user_id' => 1,
                'title' => 'Social Media App Design',
                'url_website' => 'https://www.instagram.com',
                'description' => 'Modern social media app with stories, reels, and messaging features.',
                'image_url' => 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
                'category' => 'Mobile',
            ],
            [
                'user_id' => 2,
                'title' => 'Travel Booking App',
                'url_website' => 'https://www.airbnb.com',
                'description' => 'Travel and hotel booking mobile app with interactive maps and reviews.',
                'image_url' => 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
                'category' => 'Mobile',
            ],
            [
                'user_id' => 3,
                'title' => 'Music Streaming App',
                'url_website' => 'https://www.spotify.com',
                'description' => 'Music streaming app with playlists, podcasts, and personalized recommendations.',
                'image_url' => 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
                'category' => 'Mobile',
            ],
        ];

        foreach ($showcases as $item) {
            Showcase::create($item);
        }
    }
}
