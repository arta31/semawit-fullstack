<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ProfilLahan;
use App\Models\InformasiPerawatan;
use App\Models\HargaReferensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminPetaniController extends Controller
{
    /**
     * Tampilkan halaman pengelolaan petani & dropdown produk referensi
     */
    public function index()
    {
        // Ambil data petani lansia beserta info lahan & sinking fund
        $petanis = User::where('role', 'petani_lansia')
            ->with(['profilLahans.informasiPerawatan'])
            ->latest()
            ->paginate(10);

        // Ambil data harga acuan pupuk & racun untuk pilihan di Onboarding Wizard
        $pupukPilihan = HargaReferensi::where('jenis', 'pupuk')->get();
        $racunPilihan = HargaReferensi::where('jenis', 'racun')->get();

        return Inertia::render('Admin/Petani/Index', [
            'petanis' => $petanis,
            'pupukPilihan' => $pupukPilihan,
            'racunPilihan' => $racunPilihan,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Jalankan Onboarding Wizard: Daftarkan Petani, Lahan, dan Hitung Target Tabungan Otomatis
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Input Akun Petani
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20|unique:users,phone_number',
            
            // Input Profil Lahan
            'nama_lahan' => 'required|string|max:255',
            'luas_lahan_hektar' => 'required|numeric|min:0.1',
            'jumlah_pohon' => 'required|integer|min:1',
            'frekuensi_pemupukan_tahunan' => 'required|integer|in:1,2,3',
            'lokasi_koordinat' => 'nullable|string',

            // Input Pilihan Produk dari Wizard (ID dari Harga Referensi)
            'harga_referensi_pupuk_id' => 'required|exists:harga_referensis,id',
            'harga_referensi_racun_id' => 'required|exists:harga_referensis,id',
        ]);

        try {
            $hasilWizard = DB::transaction(function () use ($validated) {
                // 1. Ambil data harga acuan produk pilihan
                $produkPupuk = HargaReferensi::findOrFail($validated['harga_referensi_pupuk_id']);
                $produkRacun = HargaReferensi::findOrFail($validated['harga_referensi_racun_id']);

                // 2. LOGIKA MATEMATIKA: Hitung Kebutuhan & Target Sinking Fund
                $luas = $validated['luas_lahan_hektar'];
                
                // Estimasi: 1 Ha butuh 5 Sak Pupuk & 1 Liter Racun per siklus perawatan
                $kebutuhanPupukSak = ceil($luas * 5); 
                $kebutuhanRacunLiter = ceil($luas * 1);

                $targetTabunganPupuk = $kebutuhanPupukSak * $produkPupuk->harga_per_satuan;
                $targetTabunganRacun = $kebutuhanRacunLiter * $produkRacun->harga_per_satuan;
                $totalTarget = $targetTabunganPupuk + $targetTabunganRacun;

                // 3. Buat Akun Petani Lansia
                $petani = User::create([
                    'name' => $validated['name'],
                    'phone_number' => $validated['phone_number'],
                    'role' => 'petani_lansia',
                    'password' => Hash::make('petani123'), // Password default, bisa diganti nanti
                ]);

                // 4. Buat Profil Lahan
                $lahan = ProfilLahan::create([
                    'user_id' => $petani->id,
                    'nama_lahan' => $validated['nama_lahan'],
                    'luas_lahan_hektar' => $luas,
                    'jumlah_pohon' => $validated['jumlah_pohon'],
                    'frekuensi_pemupukan_tahunan' => $validated['frekuensi_pemupukan_tahunan'],
                    'lokasi_koordinat' => $validated['lokasi_koordinat'] ?? null,
                ]);

                // 5. Buat Pengaturan Sinking Fund (Informasi Perawatan)
                InformasiPerawatan::create([
                    'profil_lahan_id' => $lahan->id,
                    'target_tabungan_pupuk' => $targetTabunganPupuk,
                    'target_tabungan_racun' => $targetTabunganRacun,
                    'persen_pupuk' => 15.00, // Alokasi potongan otomatis default: 15%
                    'persen_racun' => 10.00, // Alokasi potongan otomatis default: 10%
                    'persen_rumah_tangga' => 75.00, // Pendapatan aman belanja default: 75%
                    'saldo_pupuk_saat_ini' => 0.00,
                    'saldo_racun_saat_ini' => 0.00,
                ]);

                return [
                    'nama_petani' => $petani->name,
                    'luas' => $luas,
                    'pupuk_sak' => $kebutuhanPupukSak,
                    'racun_liter' => $kebutuhanRacunLiter,
                    'total_target' => $totalTarget
                ];
            });

            // Format kalimat kesuksesan deskriptif (Momen Aha! di PDF Halaman 2)
            $pesanSukses = "Pendaftaran Berhasil! Untuk Lahan {$hasilWizard['luas']} Hektar, "
                         . "Pak/Bu {$hasilWizard['nama_petani']} butuh sekitar {$hasilWizard['pupuk_sak']} Sak Pupuk "
                         . "dan {$hasilWizard['racun_liter']} Liter Racun per siklus. "
                         . "Total Target Sinking Fund dikunci sebesar Rp " . number_format($hasilWizard['total_target'], 0, ',', '.') . " per siklus.";

            return redirect()->back()->with('success', $pesanSukses);

        } catch (\Exception $e) {
            Log::error('Gagal memproses Onboarding Wizard: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan sistem saat mendaftarkan data petani.');
        }
    }
}