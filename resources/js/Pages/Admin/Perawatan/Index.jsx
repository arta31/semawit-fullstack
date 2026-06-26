import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Index({ logs, lahans, produks, flash }) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        profil_lahan_id: '',
        jenis_perawatan: 'pupuk',
        harga_referensi_id: '',
        jumlah_barang: '',
        deskripsi: '',
        tanggal_transaksi: new Date().toISOString().split('T')[0],
    });

    const formatRupiah = (angka) =>
        'Rp ' + parseInt(angka || 0).toLocaleString('id-ID');

    const handleOpenModal = () => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => { reset(); clearErrors(); }, 300);
    };

    // Kalkulasi live saldo & validasi
    const lahanTerpilih        = lahans.find(l => l.id == data.profil_lahan_id) || null;
    const saldoPupuk           = lahanTerpilih?.informasi_perawatan?.saldo_pupuk_saat_ini || 0;
    const saldoRacun           = lahanTerpilih?.informasi_perawatan?.saldo_racun_saat_ini || 0;
    const saldoAktif           = data.jenis_perawatan === 'pupuk' ? saldoPupuk : saldoRacun;
    const produkTerpilih       = produks.find(p => p.id == data.harga_referensi_id) || null;
    const hargaSatuan          = produkTerpilih ? parseFloat(produkTerpilih.harga_per_satuan) : 0;
    const qtyInput             = parseInt(data.jumlah_barang) || 0;
    const totalEstimasi        = qtyInput * hargaSatuan;
    const isSaldoKurang        = totalEstimasi > saldoAktif;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.perawatan.store'), { onSuccess: handleCloseModal });
    };

    return (
        <>
            <Head title="Pencairan Perawatan - SEMAWIT" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* ── FLASH ─────────────────────────────────── */}
                {flash?.success && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl text-emerald-900 shadow-sm flex items-start gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                            <span className="text-sm">🎉</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-emerald-800">Berhasil!</h3>
                            <p className="text-xs font-medium mt-0.5 leading-relaxed text-emerald-700">{flash.success}</p>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs font-bold text-red-900">{flash.error}</p>
                    </div>
                )}

                {/* ── PANEL RIWAYAT ─────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

                    {/* Header — konsisten dengan petani & panen */}
                    <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                💳 Riwayat Pengambilan Barang Anggota
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Catatan pencairan Sinking Fund untuk pupuk dan racun.
                            </p>
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Catat Pengambilan
                        </button>
                    </div>

                    {/* Tabel — konsisten dengan petani & panen */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/75 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-200/80">
                                    <th className="py-3 px-6 font-semibold">Tanggal Transaksi</th>
                                    <th className="py-3 px-6 font-semibold">Petani / Lahan</th>
                                    <th className="py-3 px-6 font-semibold">Jenis Tabungan</th>
                                    <th className="py-3 px-6 font-semibold text-red-400">Jumlah Potong Saldo</th>
                                    <th className="py-3 px-6 font-semibold">Keterangan / Detil</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <p className="font-semibold text-slate-900">
                                                    {new Date(log.tanggal_transaksi).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </p>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <p className="font-semibold text-slate-900">{log.profil_lahan.user.name}</p>
                                                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {log.profil_lahan.nama_lahan}
                                                </p>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold uppercase rounded-full tracking-wide ${
                                                    log.jenis_perawatan === 'pupuk'
                                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                                        : 'bg-amber-50 text-amber-800 border border-amber-100'
                                                }`}>
                                                    {log.jenis_perawatan === 'pupuk' ? '📦 Pupuk' : '🧪 Racun'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 font-bold text-red-600 text-sm bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                                                    − {formatRupiah(log.jumlah_pengeluaran)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-500 leading-relaxed">
                                                {log.deskripsi || <span className="italic text-slate-300">Tidak ada keterangan</span>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                </svg>
                                                <p className="font-medium text-slate-500 text-sm">Belum ada riwayat pencairan sinking fund.</p>
                                                <p className="text-xs text-slate-400">Klik tombol "Catat Pengambilan" untuk memulai.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── MODAL — konsisten dengan petani & panen ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={handleCloseModal}
                    />

                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-5 border-b border-slate-200/80 bg-slate-50 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                    💳 Pencatatan Pengambilan Stok
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Cairkan saldo sinking fund petani untuk pengambilan pupuk atau racun.
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto bg-white">
                            <form id="perawatanForm" onSubmit={handleSubmit} className="space-y-6">

                                {/* SECTION 1 — Pilih Lahan */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                                        Pilih Lahan Anggota Petani
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Petani &amp; Lahan</label>
                                        <select
                                            value={data.profil_lahan_id}
                                            onChange={e => setData('profil_lahan_id', e.target.value)}
                                            className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm bg-white"
                                            required
                                        >
                                            <option value="">— Pilih Petani Terdaftar —</option>
                                            {lahans.map((lahan) => (
                                                <option key={lahan.id} value={lahan.id}>
                                                    {lahan.user.name} — {lahan.nama_lahan}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.profil_lahan_id && <p className="text-red-500 text-xs mt-1">{errors.profil_lahan_id}</p>}
                                    </div>
                                </div>

                                {/* SECTION 2 — Jenis Tabungan */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                                        Jenis Tabungan yang Dicairkan
                                    </h4>
                                    <div className="flex gap-3">
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                                            data.jenis_perawatan === 'pupuk'
                                                ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                                                : 'border-slate-100 hover:border-slate-200 bg-white'
                                        }`}>
                                            <input type="radio" name="jenis_perawatan" value="pupuk"
                                                checked={data.jenis_perawatan === 'pupuk'}
                                                onChange={e => setData('jenis_perawatan', e.target.value)}
                                                className="hidden" />
                                            <span className="text-lg">📦</span>
                                            <span className="font-bold text-sm text-slate-800">Tabungan Pupuk</span>
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                                            data.jenis_perawatan === 'racun'
                                                ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                                                : 'border-slate-100 hover:border-slate-200 bg-white'
                                        }`}>
                                            <input type="radio" name="jenis_perawatan" value="racun"
                                                checked={data.jenis_perawatan === 'racun'}
                                                onChange={e => setData('jenis_perawatan', e.target.value)}
                                                className="hidden" />
                                            <span className="text-lg">🧪</span>
                                            <span className="font-bold text-sm text-slate-800">Tabungan Racun</span>
                                        </label>
                                    </div>
                                </div>

                                {/* SECTION 3 — Produk & Qty */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                                        Produk &amp; Jumlah Pengambilan
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Pilih Produk</label>
                                        <select
                                            value={data.harga_referensi_id}
                                            onChange={e => setData('harga_referensi_id', e.target.value)}
                                            className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm bg-white"
                                            required
                                        >
                                            <option value="">— Pilih Produk Inventaris KUD —</option>
                                            {produks
                                                .filter(p => p.jenis === data.jenis_perawatan)
                                                .map(produk => (
                                                    <option key={produk.id} value={produk.id}>
                                                        {produk.nama_produk} ({formatRupiah(produk.harga_per_satuan)} / {produk.satuan})
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.harga_referensi_id && <p className="text-red-500 text-xs mt-1">{errors.harga_referensi_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Jumlah Barang</label>
                                            <input
                                                type="number" min="1"
                                                value={data.jumlah_barang}
                                                onChange={e => setData('jumlah_barang', e.target.value)}
                                                className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm font-semibold text-emerald-700 placeholder-slate-300"
                                                placeholder="Contoh: 5"
                                                required
                                            />
                                            {errors.jumlah_barang && <p className="text-red-500 text-xs mt-1">{errors.jumlah_barang}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tanggal Ambil</label>
                                            <input
                                                type="date"
                                                value={data.tanggal_transaksi}
                                                onChange={e => setData('tanggal_transaksi', e.target.value)}
                                                className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm"
                                                required
                                            />
                                            {errors.tanggal_transaksi && <p className="text-red-500 text-xs mt-1">{errors.tanggal_transaksi}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Catatan (Opsional)</label>
                                        <input
                                            type="text"
                                            value={data.deskripsi}
                                            onChange={e => setData('deskripsi', e.target.value)}
                                            className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                            placeholder="Contoh: Pengambilan kebun bukit indah"
                                        />
                                    </div>
                                </div>

                                {/* SECTION 4 — Validasi saldo live */}
                                {data.profil_lahan_id && (
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isSaldoKurang ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>4</span>
                                            Validasi Saldo Sinking Fund
                                        </h4>
                                        <div className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                                            isSaldoKurang
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-emerald-50/50 border-emerald-100'
                                        }`}>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 font-medium">Saldo berjalan petani</span>
                                                    <span className="font-bold text-emerald-700">{formatRupiah(saldoAktif)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm border-t border-dashed border-slate-200 pt-2">
                                                    <span className="text-slate-500 font-medium">Total estimasi belanja</span>
                                                    <span className="font-bold text-slate-800">{formatRupiah(totalEstimasi)}</span>
                                                </div>
                                            </div>
                                            {isSaldoKurang && (
                                                <div className="mt-3 bg-red-100 border border-red-200 rounded-lg p-3 text-center">
                                                    <p className="text-xs font-bold text-red-700">
                                                        ❌ SALDO TIDAK CUKUP — Kurang {formatRupiah(totalEstimasi - saldoAktif)}
                                                    </p>
                                                    <p className="text-[10px] text-red-500 mt-0.5">Transaksi akan ditolak oleh sistem.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </form>
                        </div>

                        {/* Modal Footer — konsisten dengan petani & panen */}
                        <div className="p-5 border-t border-slate-200/80 bg-slate-50 shrink-0 flex gap-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="perawatanForm"
                                disabled={processing || isSaldoKurang}
                                className={`flex-1 py-2 font-bold text-xs rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 ${
                                    isSaldoKurang
                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-70'
                                }`}
                            >
                                {processing && (
                                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" 
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {processing ? 'Memproses...' : 'Konfirmasi & Potong Saldo'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = page => <MainLayout children={page} />;
