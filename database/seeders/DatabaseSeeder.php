<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

    public function run(): void
{
    // 1. Bersihkan data lama jika ada untuk menghindari duplikasi unik
    \App\Models\User::whereIn('email', ['admin@semawit.com', 'wakijo@sawit.com'])->delete();
    \App\Models\HargaReferensi::truncate();

    // 2. Suntik Akun Admin KUD Default
    \App\Models\User::create([
        'name' => 'Admin KUD Semawit',
        'email' => 'admin@semawit.com',
        'phone_number' => '085263678310',
        'role' => 'admin_kud',
        'password' => \Illuminate\Support\Facades\Hash::make('password123'),
    ]);

    // 3. Suntik Produk Referensi Pupuk KUD
    \App\Models\HargaReferensi::create([
        'nama_produk' => 'Pupuk NPK Mahkota',
        'jenis' => 'pupuk',
        'harga_per_satuan' => 350000.00,
        'satuan' => 'Sak',
        'deskripsi' => 'Rekomendasi terbaik untuk pertumbuhan pohon sawit usia 3-10 tahun.',
    ]);

    \App\Models\HargaReferensi::create([
        'nama_produk' => 'Pupuk Urea Kaltim',
        'jenis' => 'pupuk',
        'harga_per_satuan' => 280000.00,
        'satuan' => 'Sak',
        'deskripsi' => 'Membantu menyuburkan daun dan merangsang pembuahan lebat.',
    ]);

    // 4. Suntik Produk Referensi Racun KUD
    \App\Models\HargaReferensi::create([
        'nama_produk' => 'Gramoxone Cair',
        'jenis' => 'racun',
        'harga_per_satuan' => 850000.00,
        'satuan' => 'Liter',
        'deskripsi' => 'Racun rumput kontak yang sangat cepat membasmi gulma kebun.',
    ]);

    \App\Models\HargaReferensi::create([
        'nama_produk' => 'Roundup Biosorb',
        'jenis' => 'racun',
        'harga_per_satuan' => 120000.00,
        'satuan' => 'Liter',
        'deskripsi' => 'Racun rumput sistemik membasmi alang-alang hingga ke akar.',
    ]);
}
}