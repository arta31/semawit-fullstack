<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InformasiPerawatan extends Model
{
    protected $table = 'informasi_perawatans';

    protected $fillable = [
        'profil_lahan_id',
        'target_tabungan_pupuk',
        'target_tabungan_racun',
        'persen_pupuk',
        'persen_racun',
        'persen_rumah_tangga',
        'saldo_pupuk_saat_ini',
        'saldo_racun_saat_ini',
    ];

    protected $casts = [
        'target_tabungan_pupuk' => 'decimal:2',
        'target_tabungan_racun' => 'decimal:2',
        'persen_pupuk' => 'decimal:2',
        'persen_racun' => 'decimal:2',
        'persen_rumah_tangga' => 'decimal:2',
        'saldo_pupuk_saat_ini' => 'decimal:2',
        'saldo_racun_saat_ini' => 'decimal:2',
    ];

    /**
     * Relasi balik ke Profil Lahan
     */
    public function profilLahan(): BelongsTo
    {
        return $this->belongsTo(ProfilLahan::class, 'profil_lahan_id');
    }
}