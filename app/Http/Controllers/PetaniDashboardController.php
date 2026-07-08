<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProfilLahan;
use App\Models\DataPanen;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PetaniDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // PERBAIKAN 1: Menggunakan camelCase 'informasiPerawatan'
        $lahan = ProfilLahan::with('informasiPerawatan')->where('user_id', $user->id)->first();

        // Nilai Default jika petani belum punya data
        $saldoTabungan = 0;
        $pendapatanBersih = 0; // Jatah Rumah Tangga
        $panenTerakhir = null;
        $riwayatPanen = [];

        if ($lahan) {
            // PERBAIKAN 2: Menggunakan camelCase 'informasiPerawatan'
            $perawatan = $lahan->informasiPerawatan;
            
            // Tabungan Modal = Saldo Pupuk + Saldo Racun
            $saldoTabungan = ($perawatan->saldo_pupuk_saat_ini ?? 0) + ($perawatan->saldo_racun_saat_ini ?? 0);

            // Pendapatan Bersih = Total uang yang sudah diterima petani (Jatah Aman)
            $pendapatanBersih = DataPanen::where('profil_lahan_id', $lahan->id)->sum('nominal_rumah_tangga');

            // Ambil tanggal panen terakhir
            $panenTerakhir = DataPanen::where('profil_lahan_id', $lahan->id)->latest('tanggal_panen')->first();

            // Ambil 3 riwayat panen terakhir untuk list di bawah
            $riwayatPanen = DataPanen::where('profil_lahan_id', $lahan->id)
                ->orderBy('tanggal_panen', 'desc')
                ->take(3)
                ->get()
                ->map(function($panen) use ($lahan) {
                    return [
                        'id' => $panen->id,
                        'nama_lahan' => $lahan->nama_lahan,
                        'tanggal' => Carbon::parse($panen->tanggal_panen)->translatedFormat('d F Y'),
                        'berat_ton' => round($panen->berat_bersih_kg / 1000, 2), // Ubah Kg ke Ton agar ringkas
                        'pendapatan_bersih' => $panen->nominal_rumah_tangga,
                    ];
                });
        }

        // Tentukan ucapan selamat berdasarkan jam
        $jam = now()->format('H');
        $ucapan = 'Selamat Pagi';
        if ($jam >= 11 && $jam < 15) $ucapan = 'Selamat Siang';
        elseif ($jam >= 15 && $jam < 18) $ucapan = 'Selamat Sore';
        elseif ($jam >= 18) $ucapan = 'Selamat Malam';

        return Inertia::render('Petani/Dashboard', [
            'petani' => [
                'name' => explode(' ', trim($user->name))[0], // Ambil nama panggilan (kata pertama)
                'ucapan' => $ucapan,
            ],
            'statistik' => [
                'total_keseluruhan' => $pendapatanBersih + $saldoTabungan,
                'pendapatan_bersih' => $pendapatanBersih,
                'saldo_tabungan' => $saldoTabungan,
                'tanggal_panen_terakhir' => $panenTerakhir ? Carbon::parse($panenTerakhir->tanggal_panen)->translatedFormat('d F Y') : 'Belum ada panen',
            ],
            'riwayat_panen' => $riwayatPanen
        ]);
    }
}