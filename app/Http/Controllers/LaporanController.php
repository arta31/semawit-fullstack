<?php

namespace App\Http\Controllers;

use App\Models\ProfilLahan;
use App\Models\DataPanen;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
   public function exportLahanPdf($profil_lahan_id)
{
    // Memuat relasi 'user' dan 'informasiPerawatan' secara eager-load
    $lahan = ProfilLahan::with(['user', 'informasiPerawatan'])->findOrFail($profil_lahan_id);
    
    $riwayatPanen = DataPanen::where('profil_lahan_id', $profil_lahan_id)
        ->orderBy('tanggal_panen', 'desc')
        ->get();

    $ringkasan = [
        'total_berat' => $riwayatPanen->sum('berat_bersih_kg'),
        'total_pendapatan' => $riwayatPanen->sum('total_pendapatan'),
        'total_tabungan_pupuk' => $riwayatPanen->sum('nominal_pupuk'),
        'total_tabungan_racun' => $riwayatPanen->sum('nominal_racun'),
        'total_rumah_tangga' => $riwayatPanen->sum('nominal_rumah_tangga'),
    ];

    $pdf = Pdf::loadView('reports.lahan_pdf', [
        'lahan' => $lahan,
        'riwayatPanen' => $riwayatPanen,
        'ringkasan' => $ringkasan,
        'tanggalCetak' => now()->format('d-m-Y H:i')
    ]);

    return $pdf->stream("Laporan-Panen-Lahan-{$lahan->nama_lahan}.pdf");
}
}