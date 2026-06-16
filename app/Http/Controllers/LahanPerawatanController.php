<?php

namespace App\Http\Controllers;

use App\Models\LogPerawatan;
use App\Models\ProfilLahan;
use App\Models\InformasiPerawatan;
use App\Models\HargaReferensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LahanPerawatanController extends Controller
{
    /**
     * Tampilkan riwayat pengeluaran perawatan lahan seluruh petani
     */
    public function index()
    {
        $logs = LogPerawatan::with(['profilLahan.user'])
            ->latest()
            ->paginate(15);

        // Ambil daftar lahan aktif untuk dropdown pilihan di form Admin
        $lahans = ProfilLahan::with('user')->get();

        // Ambil produk referensi untuk kebutuhan kalkulasi harga belanja
        $produks = HargaReferensi::all();

        return Inertia::render('Admin/Perawatan/Index', [
            'logs' => $logs,
            'lahans' => $lahans,
            'produks' => $produks,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Catat Pengeluaran Belanja (Sinking Fund Cair): Potong Saldo Tabungan Petani
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'profil_lahan_id' => 'required|exists:profil_lahans,id',
            'jenis_perawatan' => 'required|string|in:pupuk,racun',
            'harga_referensi_id' => 'required|exists:harga_referensis,id',
            'jumlah_barang' => 'required|integer|min:1',
            'deskripsi' => 'nullable|string',
            'tanggal_transaksi' => 'required|date',
        ]);

        try {
            $transaksiSelesai = DB::transaction(function () use ($validated) {
                // 1. Ambil produk dan target tabungan lahan
                $produk = HargaReferensi::findOrFail($validated['harga_referensi_id']);
                
                $perawatan = InformasiPerawatan::where('profil_lahan_id', $validated['profil_lahan_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                // 2. LOGIKA MATEMATIKA: Hitung total nominal belanja
                $totalBelanja = $validated['jumlah_barang'] * $produk->harga_per_satuan;

                // 3. VALIDASI SALDO: Periksa apakah tabungan berjalan petani mencukupi
                if ($validated['jenis_perawatan'] === 'pupuk') {
                    if ($perawatan->saldo_pupuk_saat_ini < $totalBelanja) {
                        throw new \Exception("Saldo tabungan pupuk tidak mencukupi! Saldo saat ini: Rp " . 
                        number_format($perawatan->saldo_pupuk_saat_ini, 0, ',', '.') . ", 
                        total belanja: Rp " . number_format($totalBelanja, 0, ',', '.'));
                    }
                    // Potong Saldo Pupuk
                    $perawatan->decrement('saldo_pupuk_saat_ini', $totalBelanja);
                } else {
                    if ($perawatan->saldo_racun_saat_ini < $totalBelanja) {
                        throw new \Exception("Saldo tabungan racun tidak mencukupi! Saldo saat ini: Rp " . 
                        number_format($perawatan->saldo_racun_saat_ini, 0, ',', '.') . ", 
                        total belanja: Rp " . number_format($totalBelanja, 0, ',', '.'));
                    }
                    // Potong Saldo Racun
                    $perawatan->decrement('saldo_racun_saat_ini', $totalBelanja);
                }

                // 4. Catat Log Pengeluaran
                $deskripsiSistem = "Pengambilan " . $validated['jumlah_barang'] . " " . $produk->satuan . " " . $produk->nama_produk . ". " . ($validated['deskripsi'] ?? '');
                
                $log = LogPerawatan::create([
                    'profil_lahan_id' => $validated['profil_lahan_id'],
                    'jenis_perawatan' => $validated['jenis_perawatan'],
                    'jumlah_pengeluaran' => $totalBelanja,
                    'deskripsi' => $deskripsiSistem,
                    'tanggal_transaksi' => $validated['tanggal_transaksi'],
                ]);

                return [
                    'nama_petani' => $perawatan->profilLahan->user->name,
                    'nama_produk' => $produk->nama_produk,
                    'qty' => $validated['jumlah_barang'],
                    'satuan' => $produk->satuan,
                    'total' => $totalBelanja
                ];
            });

            $pesanSukses = "Belanja Sukses! Berhasil memotong saldo tabungan Pak/Bu {$transaksiSelesai['nama_petani']} "
                         . "sebesar Rp " . number_format($transaksiSelesai['total'], 0, ',', '.') . " "
                         . "untuk pengambilan {$transaksiSelesai['qty']} {$transaksiSelesai['satuan']} {$transaksiSelesai['nama_produk']}.";

            return redirect()->back()->with('success', $pesanSukses);

        } catch (\Exception $e) {
            Log::warning('Gagal mencatat pengeluaran Sinking Fund: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}