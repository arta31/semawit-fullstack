import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle2, ClipboardList, Package, FlaskConical, RefreshCw, Plus } from 'lucide-react';

export default function Index({ hargaReferensis, flash }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode]       = useState(false);
    const [editId, setEditId]           = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama_produk      : '',
        jenis            : 'pupuk',
        harga_per_satuan : '',
        satuan           : 'Sak',
        deskripsi        : '',
        gambar_produk    : null,
    });

    const formatRupiah = (angka) =>
        'Rp ' + parseInt(angka || 0).toLocaleString('id-ID');

    const handleOpenAddModal = () => {
        setEditMode(false); setEditId(null);
        reset(); clearErrors();
        setIsModalOpen(true);
    };

    const handleEditClick = (produk) => {
        setEditMode(true); setEditId(produk.id);
        setData({
            nama_produk      : produk.nama_produk,
            jenis            : produk.jenis,
            harga_per_satuan : produk.harga_per_satuan,
            satuan           : produk.satuan,
            deskripsi        : produk.deskripsi || '',
            gambar_produk    : null,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => { setEditMode(false); setEditId(null); reset(); clearErrors(); }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = editMode
            ? route('admin.harga-referensi.update', editId)
            : route('admin.harga-referensi.store');
        post(routeName, { onSuccess: handleCloseModal });
    };

    const handleDelete = (id) => {
        if (confirm('Hapus produk referensi harga ini?')) {
            router.delete(route('admin.harga-referensi.destroy', id));
        }
    };

    return (
        <>
            <Head title="Manajemen Harga Acuan - SEMAWIT" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* ── FLASH ─────────────────────────────────── */}
                {flash?.success && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl text-emerald-900 shadow-sm flex items-start gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                            <CheckCircle2 size={16} className="text-emerald-600" />
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

                {/* ── PANEL TABEL ───────────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

                    {/* Header — konsisten dengan petani, panen, perawatan */}
                    <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                <ClipboardList size={16} className="text-slate-400" /> Daftar Acuan Harga KUD
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Kelola harga referensi pupuk dan racun untuk perhitungan target sinking fund otomatis.
                            </p>
                        </div>
                        <button
                            onClick={handleOpenAddModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Produk
                        </button>
                    </div>

                    {/* Tabel */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Foto</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Produk / Jenis</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Harga Satuan</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {hargaReferensis.data.length > 0 ? (
                                    hargaReferensis.data.map((produk) => (
                                        <tr key={produk.id} className="hover:bg-slate-50/50 transition-colors">

                                            {/* Foto */}
                                            <td className="py-4 px-6">
                                                {produk.gambar_produk_path ? (
                                                    <img
                                                        src={`/storage/${produk.gambar_produk_path}`}
                                                        alt={produk.nama_produk}
                                                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                                                    />
                                                ) : (
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${
                                                        produk.jenis === 'pupuk'
                                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                                            : 'bg-amber-50 border-amber-100 text-amber-600'
                                                    }`}>
                                                        {produk.jenis === 'pupuk' ? <Package size={20} /> : <FlaskConical size={20} />}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Nama + badge jenis */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <p className="font-semibold text-slate-900">{produk.nama_produk}</p>
                                                <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wide ${
                                                    produk.jenis === 'pupuk'
                                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                                        : 'bg-amber-50 text-amber-800 border border-amber-100'
                                                }`}>
                                                    {produk.jenis === 'pupuk' ? 'Pupuk' : 'Racun'}
                                                </span>
                                            </td>

                                            {/* Harga */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <p className="font-bold text-emerald-700">{formatRupiah(produk.harga_per_satuan)}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">per {produk.satuan}</p>
                                            </td>

                                            {/* Deskripsi */}
                                            <td className="py-4 px-6 text-slate-500 leading-relaxed max-w-xs">
                                                {produk.deskripsi || <span className="italic text-slate-300">Tidak ada deskripsi</span>}
                                            </td>

                                            {/* Aksi */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(produk)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-700 font-bold rounded-lg text-xs transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(produk.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-600 font-bold rounded-lg text-xs transition-colors"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className="font-medium text-slate-500 text-sm">Belum ada harga referensi produk.</p>
                                                <p className="text-xs text-slate-400">Klik "Tambah Produk" untuk memulai.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── MODAL TAMBAH / EDIT ── konsisten dengan petani, panen, perawatan ── */}
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
                                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    {editMode ? <RefreshCw size={16} className="text-amber-500" /> : <Plus size={16} className="text-emerald-500" />}
                                    {editMode ? 'Edit Produk Referensi' : 'Tambah Produk Referensi'}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {editMode
                                        ? 'Perbarui data produk referensi harga KUD.'
                                        : 'Tambahkan produk baru sebagai acuan harga sinking fund.'}
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
                            <form id="hargaForm" onSubmit={handleSubmit} className="space-y-6">

                                {/* SECTION 1 — Info Produk */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                                        Informasi Produk
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Nama Produk</label>
                                        <input
                                            type="text"
                                            value={data.nama_produk}
                                            onChange={e => setData('nama_produk', e.target.value)}
                                            className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                            placeholder="Contoh: Pupuk NPK Mahkota"
                                            required
                                        />
                                        {errors.nama_produk && <p className="text-red-500 text-xs mt-1">{errors.nama_produk}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Jenis Komoditas</label>
                                        <select
                                            value={data.jenis}
                                            onChange={e => setData('jenis', e.target.value)}
                                            className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm bg-white"
                                        >
                                            <option value="pupuk">Pupuk (Penyubur)</option>
                                            <option value="racun">Racun (Pestisida / Herbisida)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* SECTION 2 — Harga & Satuan */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                                        Harga &amp; Satuan
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Harga Satuan (Rp)</label>
                                            <input
                                                type="number"
                                                value={data.harga_per_satuan}
                                                onChange={e => setData('harga_per_satuan', e.target.value)}
                                                className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm font-semibold text-emerald-700 placeholder-slate-300"
                                                placeholder="Contoh: 350000"
                                                required
                                            />
                                            {errors.harga_per_satuan && <p className="text-red-500 text-xs mt-1">{errors.harga_per_satuan}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Satuan Ukuran</label>
                                            <input
                                                type="text"
                                                value={data.satuan}
                                                onChange={e => setData('satuan', e.target.value)}
                                                className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                                placeholder="Contoh: Sak / Liter"
                                                required
                                            />
                                            {errors.satuan && <p className="text-red-500 text-xs mt-1">{errors.satuan}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3 — Deskripsi & Foto */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                                        Keterangan &amp; Foto
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Deskripsi (Opsional)</label>
                                        <textarea
                                            value={data.deskripsi}
                                            onChange={e => setData('deskripsi', e.target.value)}
                                            className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                            rows="3"
                                            placeholder="Contoh: Baik untuk sawit usia muda..."
                                        />
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                            Foto Produk (Opsional)
                                        </label>
                                        <input
                                            type="file"
                                            onChange={e => setData('gambar_produk', e.target.files[0])}
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs 
                                            file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer transition-colors"
                                        />
                                        {errors.gambar_produk && <p className="text-red-500 text-xs mt-1">{errors.gambar_produk}</p>}
                                    </div>
                                </div>

                            </form>
                        </div>

                        {/* Modal Footer — konsisten dengan petani, panen, perawatan */}
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
                                form="hargaForm"
                                disabled={processing}
                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {processing && (
                                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {processing ? 'Menyimpan...' : editMode ? 'Simpan Perubahan' : 'Simpan Produk'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = page => <MainLayout children={page} />;
