<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_panens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_lahan_id')->constrained('profil_lahans')->onDelete('cascade');
            $table->date('tanggal_panen');
            $table->decimal('berat_bersih_kg', 10, 2);
            $table->decimal('harga_per_kg', 10, 2);
            $table->decimal('total_pendapatan', 15, 2);
            $table->decimal('nominal_pupuk', 15, 2);
            $table->decimal('nominal_racun', 15, 2);
            $table->decimal('nominal_rumah_tangga', 15, 2);
            $table->string('status_pembayaran', 50)->default('pending'); // 'pending', 'dibayarkan'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_panens');
    }
};