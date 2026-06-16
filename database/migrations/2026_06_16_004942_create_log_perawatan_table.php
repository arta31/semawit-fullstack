<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('log_perawatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profil_lahan_id')->constrained('profil_lahans')->onDelete('cascade');
            $table->string('jenis_perawatan', 50); // 'pupuk' atau 'racun'
            $table->decimal('jumlah_pengeluaran', 15, 2);
            $table->text('deskripsi')->nullable();
            $table->date('tanggal_transaksi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_perawatans');
    }
};