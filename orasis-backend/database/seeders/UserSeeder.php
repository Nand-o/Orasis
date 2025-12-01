<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only create if not exists
        User::firstOrCreate(
            ['email' => 'admin@orasis.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'faris@orasis.com'],
            [
                'name' => 'Faris Maulana',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        User::firstOrCreate(
            ['email' => 'ernando@orasis.com'],
            [
                'name' => 'Ernando Febrian',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        User::firstOrCreate(
            ['email' => 'candra@orasis.com'],
            [
                'name' => 'Candra Afriansyah',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );
    }
}
