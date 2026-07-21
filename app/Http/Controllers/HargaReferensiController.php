<?php

namespace App\Http\Controllers;

use App\Models\HargaReferensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HargaReferensiController extends Controller
{
    /**
     * Tampilkan halaman utama manajemen harga referensi (Admin KUD)
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $jenis = $request->query('jenis', ''); // 'pupuk' | 'racun' | ''

        // 2-3: open() -> KoneksiBasisData, lalu tampilMenu() dengan data harga referensi
        $hargaReferensis = HargaReferensi::when($search !== '', fn ($query) => $query->where('nama_produk', 'like', "%{$search}%"))
            ->when($jenis !== '', fn ($query) => $query->where('jenis', $jenis))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/HargaReferensi/Index', [
            'hargaReferensis' => $hargaReferensis,
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
     * Simpan data harga acuan baru ke database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'jenis' => 'required|string|in:pupuk,racun',
            'harga_per_satuan' => 'required|numeric|min:0',
            'satuan' => 'required|string|max:50', // contoh: "Sak", "Liter", "Kg"
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'gambar_produk' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Batas 2MB
        ]);
        $gambarPath = null;
        if ($request->hasFile('gambar_produk')) {
            // Simpan gambar ke folder storage/app/public/produk
            $gambarPath = $request->file('gambar_produk')->store('produk', 'public');
        }

        HargaReferensi::create([
            'nama_produk' => $validated['nama_produk'],
            'jenis' => $validated['jenis'],
            'harga_per_satuan' => $validated['harga_per_satuan'],
            'satuan' => $validated['satuan'],
            'stok' => $validated['stok'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'gambar_produk_path' => $gambarPath,
        ]);
        return redirect()->back()->with('success', 'Harga referensi produk baru berhasil ditambahkan.');
    }

    /**
     * Perbarui data harga acuan di database
     */
    public function update(Request $request, $id)
    {
        $hargaReferensi = HargaReferensi::findOrFail($id);

        // 7-8: validasiInputHarga() -> sd Data Tidak Valid: 14: tampilPesan() (otomatis oleh Laravel jika gagal)
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'jenis' => 'required|string|in:pupuk,racun',
            'harga_per_satuan' => 'required|numeric|min:0',
            'satuan' => 'required|string|max:50',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'gambar_produk' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // sd Data Valid:
        $gambarPath = $hargaReferensi->gambar_produk_path;
        if ($request->hasFile('gambar_produk')) {
            // Hapus gambar lama jika ada
            if ($gambarPath) {
                Storage::disk('public')->delete($gambarPath);
            }
            // Simpan gambar baru
            $gambarPath = $request->file('gambar_produk')->store('produk', 'public');
        }

        // 9-11: open() / execute() -> KoneksiBasisData
        $hargaReferensi->update([
            'nama_produk' => $validated['nama_produk'],
            'jenis' => $validated['jenis'],
            'harga_per_satuan' => $validated['harga_per_satuan'],
            'satuan' => $validated['satuan'],
            'stok' => $validated['stok'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'gambar_produk_path' => $gambarPath,
        ]);

        // 12-13: tampilPesan() lalu tampilMenu() (redirect back memuat ulang daftar harga)
        return redirect()->back()->with('success', 'Harga referensi produk berhasil diperbarui.');
    }

    /**
     * Hapus data harga acuan dari database
     */
    public function destroy($id)
    {
        $hargaReferensi = HargaReferensi::findOrFail($id);

        // Hapus file gambar pendukung di storage jika ada
        if ($hargaReferensi->gambar_produk_path) {
            Storage::disk('public')->delete($hargaReferensi->gambar_produk_path);
        }

        $hargaReferensi->delete();

        return redirect()->back()->with('success', 'Harga referensi produk berhasil dihapus.');
    }
}