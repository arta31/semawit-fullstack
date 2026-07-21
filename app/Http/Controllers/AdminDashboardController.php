<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DataPanen;
use App\Models\InformasiPerawatan;
use App\Models\LogPerawatan;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    // 1: aksesMenuDashboard -> 2: index()
    public function index()
    {
        try {
            // 3-4: where() -> User (hitung total petani anggota)
            $totalPetani = User::where('role', 'petani_lansia')->count();

            // 5-6: sum() -> DataPanen (total berat timbangan panen)
            $totalBerat = DataPanen::sum('berat_bersih_kg') ?: 0;

            // 7-8: sum() -> InformasiPerawatan (total saldo tabungan pupuk & racun / Sinking Fund)
            $totalPupuk = InformasiPerawatan::sum('saldo_pupuk_saat_ini') ?: 0;
            $totalRacun = InformasiPerawatan::sum('saldo_racun_saat_ini') ?: 0;

            // 9-10: sum() -> LogPerawatan (total pengeluaran perawatan yang sudah dicairkan)
            $totalPengeluaran = LogPerawatan::sum('jumlah_pengeluaran') ?: 0;

            // 11-12: with() -> DataPanen (aktivitas panen terakhir beserta relasi lahan & petani)
            $recentPanens = DataPanen::with('profilLahan.user')
                ->latest()
                ->take(5)
                ->get();
        } catch (\Exception $e) {
            // sd Koneksi Terputus: gagal memuat data dari database, dasbor tetap tampil dengan metrik kosong
            Log::error('Gagal memuat data Dashboard Admin: ' . $e->getMessage());

            $totalPetani = $totalBerat = $totalPupuk = $totalRacun = $totalPengeluaran = 0;
            $recentPanens = collect();
        }

        // 13: return ke View (14: formatRupiah() & 15: renderKPICardsDanTabel() dieksekusi di sisi client)
        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_petani' => $totalPetani,
                'total_berat_kg' => (float) $totalBerat,
                'total_tabungan_rp' => (float) ($totalPupuk + $totalRacun),
                'total_pengeluaran_rp' => (float) $totalPengeluaran,
            ],
            'recentPanens' => $recentPanens,
        ]);
    }
}
