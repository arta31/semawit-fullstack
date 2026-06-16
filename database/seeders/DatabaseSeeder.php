<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Set / Suntik Akun Admin KUD Default ke Database
        User::create([
            'name' => 'Admin KUD Semawit',
            'email' => 'admin@semawit.com',
            'phone_number' => '081234567890', // No HP resmi KUD
            'role' => 'admin_kud',
            'password' => Hash::make('password123'), // Password default admin
        ]);

        // 2. Set / Suntik Contoh Akun Petani (Opsional untuk Uji Coba)
        User::create([
            'name' => 'Pak Wakijo (Petani)',
            'email' => 'wakijo@sawit.com',
            'phone_number' => '089876543210',
            'role' => 'petani_lansia',
            'password' => Hash::make('petani123'), // Password default petani
        ]);
    }
}