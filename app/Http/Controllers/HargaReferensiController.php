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
    public function index()
    {
        $hargaReferensis = HargaReferensi::latest()->paginate(10);

        return Inertia::render('Admin/HargaReferensi/Index', [
            'hargaReferensis' => $hargaReferensis,
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

        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'jenis' => 'required|string|in:pupuk,racun',
            'harga_per_satuan' => 'required|numeric|min:0',
            'satuan' => 'required|string|max:50',
            'deskripsi' => 'nullable|string',
            'gambar_produk' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $gambarPath = $hargaReferensi->gambar_produk_path;
        if ($request->hasFile('gambar_produk')) {
            // Hapus gambar lama jika ada
            if ($gambarPath) {
                Storage::disk('public')->delete($gambarPath);
            }
            // Simpan gambar baru
            $gambarPath = $request->file('gambar_produk')->store('produk', 'public');
        }

        $hargaReferensi->update([
            'nama_produk' => $validated['nama_produk'],
            'jenis' => $validated['jenis'],
            'harga_per_satuan' => $validated['harga_per_satuan'],
            'satuan' => $validated['satuan'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'gambar_produk_path' => $gambarPath,
        ]);

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