<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogPerawatan extends Model
{
    protected $table = 'log_perawatans';

    protected $fillable = [
        'profil_lahan_id',
        'jenis_perawatan',
        'jumlah_pengeluaran',
        'deskripsi',
        'tanggal_transaksi',
    ];

    protected $casts = [
        'jumlah_pengeluaran' => 'decimal:2',
        'tanggal_transaksi' => 'date',
    ];

    /**
     * Relasi balik ke Profil Lahan
     */
    public function profilLahan(): BelongsTo
    {
        return $this->belongsTo(ProfilLahan::class, 'profil_lahan_id');
    }
}