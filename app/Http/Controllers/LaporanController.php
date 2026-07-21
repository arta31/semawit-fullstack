<?php

namespace App\Http\Controllers;

use App\Models\ProfilLahan;
use App\Models\DataPanen;
use App\Models\LogPerawatan;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf; // library

class LaporanController extends Controller
{
   /**
    * UC09 (Petani Mandiri): resolve lahan milik petani yang login lalu unduh laporan panennya sendiri
    */
   public function exportOwnLahanPdf()
   {
       $lahan = ProfilLahan::where('user_id', Auth::id())->first();
       if (!$lahan) {
           return redirect()->back()->with('error', 'Anda belum memiliki lahan terdaftar.');
       }

       return $this->exportLahanPdf($lahan->id);
   }

   /**
    * UC09 (Petani Mandiri): resolve lahan milik petani yang login lalu unduh laporan transaksi perawatannya sendiri
    */
   public function exportOwnPerawatanPdf()
   {
       $lahan = ProfilLahan::where('user_id', Auth::id())->first();
       if (!$lahan) {
           return redirect()->back()->with('error', 'Anda belum memiliki lahan terdaftar.');
       }

       return $this->exportPerawatanPdf($lahan->id);
   }

   public function exportLahanPdf(int $profil_lahan_id)
{
    // 9-10: Memuat relasi 'user' dan 'informasiPerawatan' secara eager-load
    $lahan = ProfilLahan::with(['user', 'informasiPerawatan'])->findOrFail($profil_lahan_id);

    // 12: Ambil riwayat panen (DataPanen) milik lahan ini
    $riwayatPanen = DataPanen::where('profil_lahan_id', $profil_lahan_id)
        ->orderBy('tanggal_panen', 'desc')
        ->get();

    // 19: Alt - Data Riwayat kosong -> langsung kembali tanpa membuat PDF
    if ($riwayatPanen->isEmpty()) {
        return redirect()->back()->with('error', 'Data riwayat panen untuk lahan ini masih kosong.');
    }

    // 14: Alt - data riwayat ada -> hitung ringkasan total
    $ringkasan = $this->hitungRingkasanTotal($riwayatPanen);

    // 15: loadView()
    $pdf = Pdf::loadView('reports.lahan_pdf', [
        'lahan' => $lahan,
        'riwayatPanen' => $riwayatPanen,
        'ringkasan' => $ringkasan,
        'tanggalCetak' => now()->format('d-m-Y H:i')
    ]);

    // 16-18: stream()
    return $pdf->stream("Laporan-Panen-{$lahan->nama_lahan}.pdf");
}

private function hitungRingkasanTotal($riwayatPanen): array
{
    return [
        'total_berat' => $riwayatPanen->sum('berat_bersih_kg'),
        'total_pendapatan' => $riwayatPanen->sum('total_pendapatan'),
        'total_tabungan_pupuk' => $riwayatPanen->sum('nominal_pupuk'),
        'total_tabungan_racun' => $riwayatPanen->sum('nominal_racun'),
        'total_rumah_tangga' => $riwayatPanen->sum('nominal_rumah_tangga'),
    ];
}

/**
 * UC09: Laporan riwayat transaksi perawatan lahan (pencairan tabungan pupuk/racun)
 */
public function exportPerawatanPdf(int $profil_lahan_id)
{
    $lahan = ProfilLahan::with(['user', 'informasiPerawatan'])->findOrFail($profil_lahan_id);

    $riwayatPerawatan = LogPerawatan::where('profil_lahan_id', $profil_lahan_id)
        ->orderBy('tanggal_transaksi', 'desc')
        ->get();

    if ($riwayatPerawatan->isEmpty()) {
        return redirect()->back()->with('error', 'Data riwayat transaksi perawatan untuk lahan ini masih kosong.');
    }

    $ringkasan = [
        'total_pupuk' => $riwayatPerawatan->where('jenis_perawatan', 'pupuk')->sum('jumlah_pengeluaran'),
        'total_racun' => $riwayatPerawatan->where('jenis_perawatan', 'racun')->sum('jumlah_pengeluaran'),
    ];
    $ringkasan['total_keseluruhan'] = $ringkasan['total_pupuk'] + $ringkasan['total_racun'];

    $pdf = Pdf::loadView('reports.perawatan_pdf', [
        'lahan' => $lahan,
        'riwayatPerawatan' => $riwayatPerawatan,
        'ringkasan' => $ringkasan,
        'tanggalCetak' => now()->format('d-m-Y H:i'),
    ]);

    return $pdf->stream("Laporan-Perawatan-{$lahan->nama_lahan}.pdf");
}
}