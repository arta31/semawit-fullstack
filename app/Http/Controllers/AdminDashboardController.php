<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DataPanen;
use App\Models\InformasiPerawatan;
use App\Models\LogPerawatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Tampilkan halaman Dashboard Admin KUD beserta agregasi datanya
     */
    public function index()
    {
        try {
            // 1. Hitung total metrik dari database
            $totalPetani = User::where('role', 'petani_lansia')->count();
            $totalBerat = DataPanen::sum('berat_bersih_kg') ?: 0;

            $totalPupuk = InformasiPerawatan::sum('saldo_pupuk_saat_ini') ?: 0;
            $totalRacun = InformasiPerawatan::sum('saldo_racun_saat_ini') ?: 0;

            $totalPengeluaran = LogPerawatan::sum('jumlah_pengeluaran') ?: 0;

            // 2. Ambil 5 data panen terakhir untuk tabel
            $recentPanens = DataPanen::with('profilLahan.user')
                ->latest()
                ->take(5)
                ->get();

            // 3. Kirim data ke tampilan React (Inertia)
            return Inertia::render('Admin/Dashboard', [
                'metrics' => [
                    'total_petani' => $totalPetani,
                    'total_berat_kg' => (float)$totalBerat,
                    'total_tabungan_rp' => (float)($totalPupuk + $totalRacun),
                    'total_pengeluaran_rp' => (float)$totalPengeluaran,
                ],
                'recentPanens' => $recentPanens,
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error')
                ]
            ]);
        } catch (\Exception $e) {
            // 4. ALTERNATE FLOW: Jika database down / gagal memuat data
            Log::error('Gagal memuat data Dashboard Admin: ' . $e->getMessage());

            // Mengirim data kosong / default 0 agar layar React tidak Crash (Layar Putih)
            return Inertia::render('Admin/Dashboard', [
                'metrics' => [
                    'total_petani' => 0,
                    'total_berat_kg' => 0,
                    'total_tabungan_rp' => 0,
                    'total_pengeluaran_rp' => 0,
                ],
                'recentPanens' => [],
                'flash' => [
                    'error' => 'Gagal memuat data terkini. Periksa koneksi internet atau server Anda.'
                ]
            ]);
        }
    }
}