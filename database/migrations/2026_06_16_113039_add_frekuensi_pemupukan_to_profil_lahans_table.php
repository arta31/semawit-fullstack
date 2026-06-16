<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profil_lahans', function (Blueprint $table) {
            // Menambahkan kolom frekuensi pemupukan tahunan (default 2 kali setahun)
            $table->integer('frekuensi_pemupukan_tahunan')->default(2)->after('jumlah_pohon');
        });
    }

    public function down(): void
    {
        Schema::table('profil_lahans', function (Blueprint $table) {
            $table->dropColumn('frekuensi_pemupukan_tahunan');
        });
    }
};