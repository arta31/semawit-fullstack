<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HargaReferensi extends Model
{
    use HasFactory;

    protected $table = 'harga_referensis';

    protected $fillable = [
        'nama_produk',
        'jenis',
        'harga_per_satuan',
        'satuan',
        'gambar_produk_path',
        'deskripsi',
    ];

    protected $casts = [
        'harga_per_satuan' => 'decimal:2',
    ];
}