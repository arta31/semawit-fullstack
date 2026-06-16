<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataPanen extends Model
{
    protected $table = 'data_panens';

    protected $fillable = [
        'profil_lahan_id',
        'tanggal_panen',
        'berat_bersih_kg',
        'harga_per_kg',
        'total_pendapatan',
        'nominal_pupuk',
        'nominal_racun',
        'nominal_rumah_tangga',
        'status_pembayaran',
    ];

    protected $casts = [
        'tanggal_panen' => 'date',
        'berat_bersih_kg' => 'decimal:2',
        'harga_per_kg' => 'decimal:2',
        'total_pendapatan' => 'decimal:2',
        'nominal_pupuk' => 'decimal:2',
        'nominal_racun' => 'decimal:2',
        'nominal_rumah_tangga' => 'decimal:2',
    ];

    /**
     * Relasi balik ke Profil Lahan
     */
    public function profilLahan(): BelongsTo
    {
        return $this->belongsTo(ProfilLahan::class, 'profil_lahan_id');
    }
}