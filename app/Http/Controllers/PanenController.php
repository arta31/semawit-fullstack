<?php

namespace App\Http\Controllers;

use App\Models\DataPanen;
use App\Models\ProfilLahan;
use App\Models\InformasiPerawatan;
use App\Jobs\SendWhatsAppNotificationJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PanenController extends Controller
{
    // ---------------------------------------------------------
    // 1. HALAMAN INDEX KHUSUS ADMIN
    // ---------------------------------------------------------
    public function index()
    {
        $dataPanens = DataPanen::with('profilLahan.user')->latest()->paginate(10);
        $profilLahans = ProfilLahan::with('user')->get();

        return Inertia::render('Admin/Panen/Index', [
            'dataPanens' => $dataPanens,
            'profilLahans' => $profilLahans,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    // ---------------------------------------------------------
    // 2. FUNGSI SIMPAN PANEN (BISA DIPAKAI ADMIN & PETANI)
    // ---------------------------------------------------------
    public function store(Request $request)
    {
        $user = Auth::user();

        // Validasi Dasar (Berlaku untuk Admin & Petani)
        $rules = [
            'tanggal_panen' => 'required|date',
            'berat_bersih_kg' => 'required|numeric|min:1',
            'harga_per_kg' => 'required|numeric|min:1',
        ];

        // Jika yang login Admin, dia WAJIB memilih lahan dari dropdown
        if ($user->role === 'admin_kud') {
            $rules['profil_lahan_id'] = 'required|exists:profil_lahans,id';
        }

        $validated = $request->validate($rules);

        // Tentukan ID Lahan berdasarkan siapa yang login
        $profilLahanId = null;
        if ($user->role === 'petani_lansia') {
            // Jika petani, otomatis ambil lahan miliknya sendiri
            $lahan = ProfilLahan::where('user_id', $user->id)->first();
            if (!$lahan) {
                return redirect()->back()->with('error', 'Anda belum memiliki lahan terdaftar. Hubungi Admin.');
            }
            $profilLahanId = $lahan->id;
        } else {
            // Jika admin, ambil dari inputan form
            $profilLahanId = $validated['profil_lahan_id'];
        }

        try {
            $dataPanen = DB::transaction(function () use ($validated, $profilLahanId) {
                // 1. Dapatkan informasi pembagian persentase
                $perawatan = InformasiPerawatan::where('profil_lahan_id', $profilLahanId)
                    ->lockForUpdate()
                    ->firstOrFail();

                // 2. Hitung nilai nominal alokasi
                $totalPendapatan = $validated['berat_bersih_kg'] * $validated['harga_per_kg'];
                
                $nominalPupuk = $totalPendapatan * ($perawatan->persen_pupuk / 100);
                $nominalRacun = $totalPendapatan * ($perawatan->persen_racun / 100);
                $nominalRumahTangga = $totalPendapatan - ($nominalPupuk + $nominalRacun);

                // 3. Simpan transaksi panen
                $panen = DataPanen::create([
                    'profil_lahan_id' => $profilLahanId,
                    'tanggal_panen' => $validated['tanggal_panen'],
                    'berat_bersih_kg' => $validated['berat_bersih_kg'],
                    'harga_per_kg' => $validated['harga_per_kg'],
                    'total_pendapatan' => $totalPendapatan,
                    'nominal_pupuk' => $nominalPupuk,
                    'nominal_racun' => $nominalRacun,
                    'nominal_rumah_tangga' => $nominalRumahTangga,
                    'status_pembayaran' => 'pending',
                ]);

                // 4. Mutasi saldo akumulasi tabungan perawatan
                $perawatan->increment('saldo_pupuk_saat_ini', $nominalPupuk);
                $perawatan->increment('saldo_racun_saat_ini', $nominalRacun);

                return $panen;
            });

            // 5. Panggil Antrean Job untuk Notifikasi WhatsApp (Asynchronous) 
            dispatch(new SendWhatsAppNotificationJob($dataPanen));

            return redirect()->back()->with('success', 'Data panen berhasil disimpan dan pembagian dana otomatis selesai.');

        } catch (\Exception $e) {
            Log::error('Gagal memproses auto-splitting panen: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan sistem saat memproses transaksi panen.');
        }
    }

    // ---------------------------------------------------------
    // 3. HALAMAN RIWAYAT KHUSUS PETANI
    // ---------------------------------------------------------
    public function riwayatPetani()
    {
        $user = Auth::user();
        $lahan = ProfilLahan::where('user_id', $user->id)->first();
        
        $riwayat = [];
        if ($lahan) {
            $riwayat = DataPanen::where('profil_lahan_id', $lahan->id)
                ->orderBy('tanggal_panen', 'desc')
                ->get();
        }

        return Inertia::render('Petani/Riwayat', [
            'riwayat' => $riwayat
        ]);
    }
}