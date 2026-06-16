<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('harga_referensis', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk'); // Contoh: "Pupuk NPK Mahkota"
            $table->string('jenis', 50); // 'pupuk' atau 'racun'
            $table->decimal('harga_per_satuan', 15, 2); // Harga real-time KUD
            $table->string('satuan', 50); // Contoh: "Sak" atau "Liter"
            $table->string('gambar_produk_path')->nullable(); // Opsional untuk Card View
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('harga_referensis');
    }
};