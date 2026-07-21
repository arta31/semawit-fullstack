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
use Carbon\Carbon;

class PanenController extends Controller
{
    // ---------------------------------------------------------
    // 1. HALAMAN INDEX KHUSUS ADMIN
    // ---------------------------------------------------------
    // 2: index()
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $tanggalDari = $request->query('tanggal_dari', '');
        $tanggalSampai = $request->query('tanggal_sampai', '');

        // 3: with() -> DataPanen
        $dataPanens = DataPanen::with('profilLahan.user')
            ->when($search !== '', function ($query) use ($search) {
                $query->whereHas('profilLahan.user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when($tanggalDari !== '', fn ($query) => $query->whereDate('tanggal_panen', '>=', $tanggalDari))
            ->when($tanggalSampai !== '', fn ($query) => $query->whereDate('tanggal_panen', '<=', $tanggalSampai))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $profilLahans = ProfilLahan::with('user')->get();

        // 4: render view
        return Inertia::render('Admin/Panen/Index', [
            'dataPanens' => $dataPanens,
            'profilLahans' => $profilLahans,
            'filters' => [
                'search' => $search,
                'tanggal_dari' => $tanggalDari,
                'tanggal_sampai' => $tanggalSampai,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    // ---------------------------------------------------------
    // 2. FUNGSI SIMPAN PANEN (BISA DIPAKAI ADMIN & PETANI)
    // ---------------------------------------------------------
    // 9: store()
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

        // sd Form kosong: 10: validasi gagal -> Laravel otomatis redirect back with validation error
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

        // sd Sukses:
        try {
            $dataPanen = DB::transaction(function () use ($validated, $profilLahanId) {
                // 11-12: where() -> InformasiPerawatan
                $perawatan = InformasiPerawatan::where('profil_lahan_id', $profilLahanId)
                    ->lockForUpdate()
                    ->firstOrFail();

                // 2. Hitung nilai nominal alokasi
                $totalPendapatan = $validated['berat_bersih_kg'] * $validated['harga_per_kg'];

                $nominalPupuk = $totalPendapatan * ($perawatan->persen_pupuk / 100);
                $nominalRacun = $totalPendapatan * ($perawatan->persen_racun / 100);
                $nominalRumahTangga = $totalPendapatan - ($nominalPupuk + $nominalRacun);

                // 13-14: create() -> DataPanen
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

                // 15: increment() -> InformasiPerawatan
                $perawatan->increment('saldo_pupuk_saat_ini', $nominalPupuk);
                $perawatan->increment('saldo_racun_saat_ini', $nominalRacun);

                return $panen;
            });

            // Panggil Antrean Job untuk Notifikasi WhatsApp (Asynchronous)
            dispatch(new SendWhatsAppNotificationJob($dataPanen));

            // 16: redirect back with success message
            return redirect()->back()->with('success', 'Data panen berhasil disimpan dan pembagian dana otomatis selesai.');

        } catch (\Exception $e) {
            // sd Sistem error: 17-18: log error -> redirect back with error message
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

        $riwayat = collect();
        if ($lahan) {
            $riwayat = DataPanen::where('profil_lahan_id', $lahan->id)
                ->orderBy('tanggal_panen', 'desc')
                ->get()
                ->map(function ($panen) {
                    return [
                        'id' => $panen->id,
                        'tanggal_panen' => Carbon::parse($panen->tanggal_panen)->translatedFormat('d F Y'),
                        'berat_bersih_kg' => (float) $panen->berat_bersih_kg,
                        'harga_per_kg' => (float) $panen->harga_per_kg,
                        'total_pendapatan' => (float) $panen->total_pendapatan,
                        'nominal_pupuk' => (float) $panen->nominal_pupuk,
                        'nominal_racun' => (float) $panen->nominal_racun,
                        'nominal_rumah_tangga' => (float) $panen->nominal_rumah_tangga,
                    ];
                });
        }

        return Inertia::render('Petani/Riwayat', [
            'riwayat' => $riwayat,
            'punyaLahan' => (bool) $lahan,
        ]);
    }
}