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
        Schema::table('harga_referensis', function (Blueprint $table) {
            $table->unsignedInteger('stok')->default(0)->after('satuan'); // Stok gudang KUD (UC06)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('harga_referensis', function (Blueprint $table) {
            $table->dropColumn('stok');
        });
    }
};
