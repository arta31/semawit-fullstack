<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // UC01/UC03: membedakan Petani Mandiri (akun login aktif) vs Petani Pasif (dikelola Admin KUD).
            // Default true agar akun admin & petani lama yang sudah punya email tidak ikut terkunci.
            $table->boolean('akun_aktif')->default(true)->after('role');
        });

        // Petani lama yang belum pernah diaktifkan (belum punya email) dianggap masih Petani Pasif.
        \Illuminate\Support\Facades\DB::table('users')
            ->where('role', 'petani_lansia')
            ->whereNull('email')
            ->update(['akun_aktif' => false]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('akun_aktif');
        });
    }
};
