import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Index({ logs, lahans, produks, flash }) {
    // Definisikan state form pengeluaran menggunakan useForm Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        profil_lahan_id: '',
        jenis_perawatan: 'pupuk',
        harga_referensi_id: '',
        jumlah_barang: '',
        deskripsi: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0], // Default hari ini
    });

    const formatRupiah = (angka) => {
        return "Rp " + parseInt(angka || 0).toLocaleString('id-ID');
    };

    // 1. CARI DATA LAHAN & SALDO BERJALAN YANG DIPILIH
    const lahanTerpilih = lahans.find(l => l.id == data.profil_lahan_id) || null;
    const saldoPupukSaatIni = lahanTerpilih?.informasi_perawatan?.saldo_pupuk_saat_ini || 0;
    const saldoRacunSaatIni = lahanTerpilih?.informasi_perawatan?.saldo_racun_saat_ini || 0;
    const saldoAktif = data.jenis_perawatan === 'pupuk' ? saldoPupukSaatIni : saldoRacunSaatIni;

    // 2. CARI HARGA PRODUK REFERENSI YANG DIPILIH
    const produkTerpilih = produks.find(p => p.id == data.harga_referensi_id) || null;
    const hargaSatuan = produkTerpilih ? parseFloat(produkTerpilih.harga_per_satuan) : 0;
    
    // 3. HITUNG SIMULASI BELANJA & INTEGRITAS SALDO
    const qtyInput = parseInt(data.jumlah_barang) || 0;
    const totalEstimasiBelanja = qtyInput * hargaSatuan;
    const isSaldoKurang = totalEstimasiBelanja > saldoAktif;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.perawatan.store'), {
            onSuccess: () => {
                reset('jumlah_barang', 'deskripsi'); // Reset hanya jumlah dan deskripsi
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head title="Kelola Perawatan Lahan - SEMAWIT" />

            {/* HEADER ATAS */}
            <header className="bg-emerald-800 text-white py-5 px-6 shadow-md border-b-4 border-amber-500">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">SEMAWIT KUD - Panel Admin</h1>
                        <p className="text-sm text-emerald-100">Tahap Pengeluaran: Eksekusi Perawatan Lahan &amp; Sinking Fund Cair</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/logout-darurat" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm shadow">
                            Keluar
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* KOLOM KIRI: FORM PENGELUARAN & VALIDASI SALDO (4 Span) */}
                <div className="lg:col-span-4 bg-white rounded-xl shadow-md border border-slate-200 p-6 h-fit space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-100 pb-2">
                        💳 Pencatatan Pengambilan Stok
                    </h2>

                    {flash.success && (
                        <div className="bg-emerald-100 border-l-4 border-emerald-600 p-3 rounded text-emerald-900 text-sm font-bold">
                            {flash.success}
                        </div>
                    )}

                    {flash.error && (
                        <div className="bg-red-100 border-l-4 border-red-600 p-3 rounded text-red-900 text-sm font-bold">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Pilih Lahan / Anggota Petani</label>
                            <select
                                value={data.profil_lahan_id}
                                onChange={e => setData('profil_lahan_id', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                required
                            >
                                <option value="">-- Pilih Petani Terdaftar --</option>
                                {lahans.map((lahan) => (
                                    <option key={lahan.id} value={lahan.id}>
                                        {lahan.user.name} - {lahan.nama_lahan}
                                    </option>
                                ))}
                            </select>
                            {errors.profil_lahan_id && <p className="text-red-500 text-xs mt-1">{errors.profil_lahan_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Jenis Tabungan yang Dicairkan</label>
                            <div className="mt-2 flex gap-4 text-sm font-bold">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="jenis_perawatan" 
                                        value="pupuk" 
                                        checked={data.jenis_perawatan === 'pupuk'}
                                        onChange={e => setData('jenis_perawatan', e.target.value)}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    📦 Tabungan Pupuk
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="jenis_perawatan" 
                                        value="racun" 
                                        checked={data.jenis_perawatan === 'racun'}
                                        onChange={e => setData('jenis_perawatan', e.target.value)}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    🧪 Tabungan Racun
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Pilih Produk Pengambilan</label>
                            <select
                                value={data.harga_referensi_id}
                                onChange={e => setData('harga_referensi_id', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                required
                            >
                                <option value="">-- Pilih Produk Inventaris KUD --</option>
                                {produks
                                    .filter(p => p.jenis === data.jenis_perawatan) // Filter produk sesuai jenis tabungan terpilih
                                    .map(produk => (
                                        <option key={produk.id} value={produk.id}>
                                            {produk.nama_produk} ({formatRupiah(produk.harga_per_satuan)} / {produk.satuan})
                                        </option>
                                    ))
                                }
                            </select>
                            {errors.harga_referensi_id && <p className="text-red-500 text-xs mt-1">{errors.harga_referensi_id}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Jumlah Barang Diambil</label>
                                <input 
                                    type="number"
                                    value={data.jumlah_barang}
                                    onChange={e => setData('jumlah_barang', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm font-bold"
                                    required
                                    placeholder="Contoh: 5"
                                />
                                {errors.jumlah_barang && <p className="text-red-500 text-xs mt-1">{errors.jumlah_barang}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Tanggal Ambil</label>
                                <input 
                                    type="date"
                                    value={data.tanggal_transaksi}
                                    onChange={e => setData('tanggal_transaksi', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                    required
                                />
                                {errors.tanggal_transaksi && <p className="text-red-500 text-xs mt-1">{errors.tanggal_transaksi}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Catatan / Deskripsi (Opsional)</label>
                            <input 
                                type="text"
                                value={data.deskripsi}
                                onChange={e => setData('deskripsi', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                placeholder="Contoh: Pengambilan kebun bukit indah"
                            />
                        </div>

                        {/* LIVE-BALANCE & VALIDATION CARD (Wow Factor untuk Presentasi) */}
                        {data.profil_lahan_id && (
                            <div className={`rounded-xl p-4 border transition-all duration-300 space-y-2 ${
                                isSaldoKurang 
                                ? 'bg-red-50 border-red-200 text-red-900' 
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}>
                                <h3 className="text-xs font-black uppercase tracking-wider">🔒 Validasi Saldo Sinking Fund</h3>
                                <div className="flex justify-between text-xs border-b border-dashed pb-2 border-slate-200">
                                    <span>Saldo Berjalan Petani:</span>
                                    <span className="font-extrabold">{formatRupiah(saldoAktif)}</span>
                                </div>
                                <div className="flex justify-between text-xs pt-1">
                                    <span>Total Biaya Pengambilan:</span>
                                    <span className="font-extrabold">{formatRupiah(totalEstimasiBelanja)}</span>
                                </div>

                                {isSaldoKurang && (
                                    <div className="bg-red-200 p-2.5 rounded-lg text-xs font-bold mt-2 text-center">
                                        ❌ SALDO TIDAK CUKUP! Kurang {formatRupiah(totalEstimasiBelanja - saldoAktif)}. Transaksi akan ditolak.
                                    </div>
                                )}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={processing || isSaldoKurang} // Kunci tombol jika saldo kurang
                            className={`w-full py-4 text-white font-extrabold text-lg rounded-xl shadow-md border-b-4 ${
                                isSaldoKurang 
                                ? 'bg-slate-400 border-slate-500 cursor-not-allowed' 
                                : 'bg-emerald-700 hover:bg-emerald-800 border-emerald-950 active:border-b-0'
                            }`}
                        >
                            {processing ? 'Sedang Memotong...' : 'Konfirmasi Pengambilan & Potong Saldo'}
                        </button>
                    </form>
                </div>

                {/* KOLOM KANAN: TABEL RIWAYAT LOG PENGELUARAN (8 Span) */}
                <div className="lg:col-span-8 bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-4">
                        📋 Riwayat Pengambilan Barang Anggota (Sinking Fund Cair)
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                                    <th className="p-3">Tanggal Transaksi</th>
                                    <th className="p-3">Petani / Lahan</th>
                                    <th className="p-3">Jenis Tabungan</th>
                                    <th className="p-3 text-red-700">Jumlah Potong Saldo</th>
                                    <th className="p-3">Keterangan / Detil Barang</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 text-xs">
                                            <td className="p-3 font-bold text-slate-800">
                                                {new Date(log.tanggal_transaksi).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                            </td>
                                            <td className="p-3">
                                                <p className="font-bold text-slate-800">{log.profil_lahan.user.name}</p>
                                                <p className="text-[10px] text-slate-500">{log.profil_lahan.nama_lahan}</p>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black uppercase rounded ${
                                                    log.jenis_perawatan === 'pupuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {log.jenis_perawatan === 'pupuk' ? 'Pupuk' : 'Racun'}
                                                </span>
                                            </td>
                                            <td className="p-3 font-black text-red-600 text-sm">
                                                - {formatRupiah(log.jumlah_pengeluaran)}
                                            </td>
                                            <td className="p-3 text-xs text-slate-600 leading-relaxed font-semibold">
                                                {log.deskripsi || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-6 text-center text-slate-400">Belum ada riwayat pencairan/belanja sinking fund.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}