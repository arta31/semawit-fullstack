<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('informasi_perawatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_lahan_id')->constrained('profil_lahans')->onDelete('cascade');
            $table->decimal('target_tabungan_pupuk', 15, 2)->default(0.00);
            $table->decimal('target_tabungan_racun', 15, 2)->default(0.00);
            $table->decimal('persen_pupuk', 5, 2)->default(15.00);
            $table->decimal('persen_racun', 5, 2)->default(10.00);
            $table->decimal('persen_rumah_tangga', 5, 2)->default(75.00);
            $table->decimal('saldo_pupuk_saat_ini', 15, 2)->default(0.00);
            $table->decimal('saldo_racun_saat_ini', 15, 2)->default(0.00);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('informasi_perawatans');
    }
};