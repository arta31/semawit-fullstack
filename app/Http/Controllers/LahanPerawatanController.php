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
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $jenis = $request->query('jenis', ''); // 'pupuk' | 'racun' | ''

        // 8-9: queryGetPerawatanByPetani() -> PerawatanLahan (List Data riwayat transaksi)
        $logs = LogPerawatan::with(['profilLahan.user'])
            ->when($search !== '', function ($query) use ($search) {
                $query->whereHas('profilLahan.user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when($jenis !== '', fn ($query) => $query->where('jenis_perawatan', $jenis))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        // Ambil daftar lahan aktif untuk dropdown pilihan di form Admin
        $lahans = ProfilLahan::with(['user', 'informasiPerawatan'])->get();
        // Ambil produk referensi untuk kebutuhan kalkulasi harga belanja
        $produks = HargaReferensi::all();

        // 10-11: tampilRiwayat() -> Antarmuka (Tampil riwayat perawatan)
        return Inertia::render('Admin/Perawatan/Index', [
            'logs' => $logs,
            'lahans' => $lahans,
            'produks' => $produks,
            'filters' => [
                'search' => $search,
                'jenis' => $jenis,
            ],
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
        // 2: prosesTambahPerawatan()
        $validated = $request->validate([
            'profil_lahan_id' => 'required|exists:profil_lahans,id',
            'jenis_perawatan' => 'required|string|in:pupuk,racun',
            'harga_referensi_id' => 'required|exists:harga_referensis,id',
            'jumlah_barang' => 'required|integer|min:1',
            'deskripsi' => 'nullable|string',
            'tanggal_transaksi' => 'required|date',
        ]);

        try {
            // 3-4: execute() -> KoneksiBasisData (status koneksi)
            $transaksiSelesai = DB::transaction(function () use ($validated) {
                // 1. Ambil produk dan target tabungan lahan
                $produk = HargaReferensi::where('id', $validated['harga_referensi_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                $perawatan = InformasiPerawatan::where('profil_lahan_id', $validated['profil_lahan_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                // 2. LOGIKA MATEMATIKA: Hitung total nominal belanja
                $totalBelanja = $validated['jumlah_barang'] * $produk->harga_per_satuan;

                // 3. VALIDASI STOK: Periksa apakah stok gudang KUD mencukupi
                if ($produk->stok < $validated['jumlah_barang']) {
                    throw new \Exception("Stok {$produk->nama_produk} tidak mencukupi! Stok tersedia: {$produk->stok} {$produk->satuan}, diminta: {$validated['jumlah_barang']} {$produk->satuan}.");
                }

                // 4. VALIDASI SALDO: Periksa apakah tabungan berjalan petani mencukupi
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

                // 5-6: queryTambahPerawatan() -> PerawatanLahan (Sukses)
                $deskripsiSistem = "Pengambilan " . $validated['jumlah_barang'] . " " . $produk->satuan . " " . $produk->nama_produk . ". " . ($validated['deskripsi'] ?? '');

                $log = LogPerawatan::create([
                    'profil_lahan_id' => $validated['profil_lahan_id'],
                    'jenis_perawatan' => $validated['jenis_perawatan'],
                    'jumlah_pengeluaran' => $totalBelanja,
                    'deskripsi' => $deskripsiSistem,
                    'tanggal_transaksi' => $validated['tanggal_transaksi'],
                ]);

                // Potong stok gudang KUD sejumlah barang yang diambil
                $produk->decrement('stok', $validated['jumlah_barang']);

                return [
                    'nama_petani' => $perawatan->profilLahan->user->name,
                    'nama_produk' => $produk->nama_produk,
                    'qty' => $validated['jumlah_barang'],
                    'satuan' => $produk->satuan,
                    'total' => $totalBelanja
                ];
            });

            // 7: tampilkanCardPerawatan() - susun ringkasan transaksi untuk kartu notifikasi sukses
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