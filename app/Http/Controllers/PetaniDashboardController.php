<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ProfilLahan;
use App\Models\DataPanen;
use App\Models\InformasiPerawatan;
use App\Models\LogPerawatan;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PetaniDashboardController extends Controller
{
    // 1: aksesMenuDashboard
    public function index()
    {
        $user = Auth::user();

        $lahan = ProfilLahan::where('user_id', $user->id)->first();

        // 2: fetchDataTabunganPetani()
        $data = $this->fetchDataTabunganPetani($lahan);

        // Tentukan ucapan selamat berdasarkan jam
        $jam = now()->format('H');
        $ucapan = 'Selamat Pagi';
        if ($jam >= 11 && $jam < 15) $ucapan = 'Selamat Siang';
        elseif ($jam >= 15 && $jam < 18) $ucapan = 'Selamat Sore';
        elseif ($jam >= 18) $ucapan = 'Selamat Malam';

        // Sapaan menyesuaikan jenis kelamin; jika belum diisi (data lama), sapaan dikosongkan.
        $sapaan = match ($user->jenis_kelamin) {
            'L' => 'Pak',
            'P' => 'Bu',
            default => '',
        };

        return Inertia::render('Petani/Dashboard', [
            'petani' => [
                'name' => explode(' ', trim($user->name))[0], // Ambil nama panggilan (kata pertama)
                'sapaan' => $sapaan,
                'ucapan' => $ucapan,
            ],
            'statistik' => $data['statistik'],
            'riwayat_panen' => $data['riwayat_panen'],
        ]);
    }

    // UC08: Tabungan Saya - progress bar pupuk/racun terhadap target + riwayat pencairan (LogPerawatan)
    public function tabungan()
    {
        $user = Auth::user();
        $lahan = ProfilLahan::where('user_id', $user->id)->first();

        $perawatan = $lahan ? InformasiPerawatan::where('profil_lahan_id', $lahan->id)->first() : null;

        $riwayatTransaksi = collect();
        if ($lahan) {
            $riwayatTransaksi = LogPerawatan::where('profil_lahan_id', $lahan->id)
                ->orderBy('tanggal_transaksi', 'desc')
                ->get()
                ->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'jenis_perawatan' => $log->jenis_perawatan,
                        'jumlah_pengeluaran' => (float) $log->jumlah_pengeluaran,
                        'deskripsi' => $log->deskripsi,
                        'tanggal' => Carbon::parse($log->tanggal_transaksi)->translatedFormat('d F Y'),
                    ];
                });
        }

        return Inertia::render('Petani/Tabungan', [
            'tabungan' => [
                'pupuk' => $this->hitungProgress($perawatan?->saldo_pupuk_saat_ini, $perawatan?->target_tabungan_pupuk),
                'racun' => $this->hitungProgress($perawatan?->saldo_racun_saat_ini, $perawatan?->target_tabungan_racun),
            ],
            'riwayat_transaksi' => $riwayatTransaksi,
            'punyaLahan' => (bool) $lahan,
        ]);
    }

    private function hitungProgress(?float $saldo, ?float $target): array
    {
        $saldo = (float) ($saldo ?? 0);
        $target = (float) ($target ?? 0);

        return [
            'saldo' => $saldo,
            'target' => $target,
            'persen' => $target > 0 ? min(100, round(($saldo / $target) * 100)) : 0,
        ];
    }

    private function fetchDataTabunganPetani(?ProfilLahan $lahan): array
    {
        $pendapatanBersih = 0; // Jatah Rumah Tangga
        $panenTerakhir = null;
        $riwayatPanen = collect();
        $pupuk = $this->hitungProgress(null, null);
        $racun = $this->hitungProgress(null, null);

        if ($lahan) {
            // 3-4: where() -> InformasiPerawatan
            $perawatan = InformasiPerawatan::where('profil_lahan_id', $lahan->id)->first();

            // Progress tabungan pupuk & racun terhadap target (independen dari ada/tidaknya riwayat panen,
            // karena saldo & target sudah diinisialisasi 0 sejak onboarding)
            if ($perawatan) {
                $pupuk = $this->hitungProgress($perawatan->saldo_pupuk_saat_ini, $perawatan->target_tabungan_pupuk);
                $racun = $this->hitungProgress($perawatan->saldo_racun_saat_ini, $perawatan->target_tabungan_racun);
            }

            // 5-6: where() -> DataPanen
            $semuaPanen = DataPanen::where('profil_lahan_id', $lahan->id)
                ->orderBy('tanggal_panen', 'desc')
                ->get();

            // sd Ada Data Transaksi
            if ($semuaPanen->isNotEmpty()) {
                // Pendapatan Bersih = Total uang yang sudah diterima petani (Jatah Aman)
                $pendapatanBersih = $semuaPanen->sum('nominal_rumah_tangga');

                // Panen terakhir
                $panenTerakhir = $semuaPanen->first();

                // 3 riwayat panen terakhir untuk list di bawah
                $riwayatPanen = $semuaPanen->take(3)->map(function ($panen) use ($lahan) {
                    return [
                        'id' => $panen->id,
                        'nama_lahan' => $lahan->nama_lahan,
                        'tanggal' => Carbon::parse($panen->tanggal_panen)->translatedFormat('d F Y'),
                        'berat_ton' => round($panen->berat_bersih_kg / 1000, 2), // Ubah Kg ke Ton agar ringkas
                        'pendapatan_bersih' => $panen->nominal_rumah_tangga,
                    ];
                });
            }
            // sd Data Transaksi Nihil -> nilai default di atas tetap dipakai
        }

        $saldoTabungan = $pupuk['saldo'] + $racun['saldo'];

        return [
            'statistik' => [
                'total_keseluruhan' => $pendapatanBersih + $saldoTabungan,
                'pendapatan_bersih' => $pendapatanBersih,
                'saldo_tabungan' => $saldoTabungan,
                'tanggal_panen_terakhir' => $panenTerakhir ? Carbon::parse($panenTerakhir->tanggal_panen)->translatedFormat('d F Y') : 'Belum ada panen',
                'pupuk' => $pupuk,
                'racun' => $racun,
            ],
            'riwayat_panen' => $riwayatPanen,
        ];
    }
}
