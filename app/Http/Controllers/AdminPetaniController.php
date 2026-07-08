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
    public function index()
    {
        $petanis = User::where('role', 'petani_lansia')
            ->with(['profilLahans.informasiPerawatan'])
            ->latest()
            ->paginate(10);

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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20|unique:users,phone_number',
            'nama_lahan' => 'required|string|max:255',
            'luas_lahan_hektar' => 'required|numeric|min:0.1',
            'jumlah_pohon' => 'required|integer|min:1',
            'frekuensi_pemupukan_tahunan' => 'required|integer|in:1,2,3',
            'lokasi_koordinat' => 'nullable|string',
            'harga_referensi_pupuk_id' => 'required|exists:harga_referensis,id',
            'harga_referensi_racun_id' => 'required|exists:harga_referensis,id',
        ]);

        try {
            $hasilWizard = DB::transaction(function () use ($validated) {
                $produkPupuk = HargaReferensi::findOrFail($validated['harga_referensi_pupuk_id']);
                $produkRacun = HargaReferensi::findOrFail($validated['harga_referensi_racun_id']);

                $luas = $validated['luas_lahan_hektar'];
                $kebutuhanPupukSak = ceil($luas * 5); 
                $kebutuhanRacunLiter = ceil($luas * 1);

                $targetTabunganPupuk = $kebutuhanPupukSak * $produkPupuk->harga_per_satuan;
                $targetTabunganRacun = $kebutuhanRacunLiter * $produkRacun->harga_per_satuan;
                $totalTarget = $targetTabunganPupuk + $targetTabunganRacun;

                // Buat Akun Petani (Email dikosongkan dulu)
                $petani = User::create([
                    'name' => $validated['name'],
                    'phone_number' => $validated['phone_number'],
                    'role' => 'petani_lansia',
                    'password' => Hash::make('petani123'),
                ]);

                $lahan = ProfilLahan::create([
                    'user_id' => $petani->id,
                    'nama_lahan' => $validated['nama_lahan'],
                    'luas_lahan_hektar' => $luas,
                    'jumlah_pohon' => $validated['jumlah_pohon'],
                    'frekuensi_pemupukan_tahunan' => $validated['frekuensi_pemupukan_tahunan'],
                    'lokasi_koordinat' => $validated['lokasi_koordinat'] ?? null,
                ]);

                InformasiPerawatan::create([
                    'profil_lahan_id' => $lahan->id,
                    'target_tabungan_pupuk' => $targetTabunganPupuk,
                    'target_tabungan_racun' => $targetTabunganRacun,
                    'persen_pupuk' => 15.00,
                    'persen_racun' => 10.00,
                    'persen_rumah_tangga' => 75.00,
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

    // BARU: Fungsi untuk mengaktifkan akun login petani
    public function aktifkanAkun(Request $request, $id)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        try {
            $petani = User::findOrFail($id);
            $petani->update([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'email_verified_at' => now(),         
                ]);

            return redirect()->back()->with('success', "Akun login untuk {$petani->name} berhasil diaktifkan!");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengaktifkan akun. Pastikan email belum digunakan.');
        }
    }
}