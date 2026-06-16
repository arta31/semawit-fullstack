<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <-- PASTIKAN BARIS INI ADA

class ProfilLahan extends Model
{
    protected $table = 'profil_lahans';

    protected $fillable = [
    'user_id',
    'nama_lahan',
    'luas_lahan_hektar',
    'jumlah_pohon',
    'frekuensi_pemupukan_tahunan', // <-- TAMBAHKAN BARIS INI
    'lokasi_koordinat',
];

    /**
     * Relasi ke model User (Setiap lahan dimiliki oleh satu User/Petani)
     */
    public function user(): BelongsTo 
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function informasiPerawatan()
    {
        return $this->hasOne(InformasiPerawatan::class, 'profil_lahan_id');
    }
}