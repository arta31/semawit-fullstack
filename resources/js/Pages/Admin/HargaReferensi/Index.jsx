import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Index({ hargaReferensis, flash }) {
    // State untuk mendeteksi apakah Admin sedang dalam mode "Edit" atau "Tambah Baru"
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Definisikan state form pengunggahan produk menggunakan useForm Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_produk: '',
        jenis: 'pupuk',
        harga_per_satuan: '',
        satuan: 'Sak',
        deskripsi: '',
        gambar_produk: null,
    });

    const formatRupiah = (angka) => {
        return "Rp " + parseInt(angka || 0).toLocaleString('id-ID');
    };

    // Handler saat tombol "Edit" di tabel diklik
    const handleEditClick = (produk) => {
        setEditMode(true);
        setEditId(produk.id);
        setData({
            nama_produk: produk.nama_produk,
            jenis: produk.jenis,
            harga_per_satuan: produk.harga_per_satuan,
            satuan: produk.satuan,
            deskripsi: produk.deskripsi || '',
            gambar_produk: null, // Kosongkan file upload kecuali ingin diganti
        });
    };

    // Batalkan mode edit, reset form kembali kosong
    const handleCancelEdit = () => {
        setEditMode(false);
        setEditId(null);
        reset();
    };

    // Jalankan submit form (Tambah atau Update)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            // Melakukan update data (Menggunakan POST bawaan Inertia untuk membawa data File Upload)
            post(route('admin.harga-referensi.update', editId), {
                onSuccess: () => {
                    handleCancelEdit();
                }
            });
        } else {
            // Melakukan penambahan data baru
            post(route('admin.harga-referensi.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    // Jalankan penghapusan data produk
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk referensi harga ini?')) {
            router.delete(route('admin.harga-referensi.destroy', id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head title="Manajemen Harga Acuan - SEMAWIT" />

            {/* HEADER ATAS */}
            <header className="bg-emerald-800 text-white py-5 px-6 shadow-md border-b-4 border-amber-500">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">SEMAWIT KUD - Panel Admin</h1>
                        <p className="text-sm text-emerald-100">Manajemen Harga Referensi Pasar Pupuk &amp; Racun</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/logout-darurat" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm shadow">
                            Keluar
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* KOLOM KIRI: FORM TAMBAH / EDIT PRODUK (4 Span) */}
                <div className="lg:col-span-4 bg-white rounded-xl shadow-md border border-slate-200 p-6 h-fit">
                    <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-4">
                        {editMode ? '🔄 Edit Produk Referensi' : '➕ Tambah Produk Referensi'}
                    </h2>

                    {flash.success && (
                        <div className="bg-emerald-100 border-l-4 border-emerald-600 p-3 rounded text-emerald-900 text-sm mb-4 font-bold">
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Nama Produk</label>
                            <input 
                                type="text"
                                value={data.nama_produk}
                                onChange={e => setData('nama_produk', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                required
                                placeholder="Contoh: Pupuk NPK Mahkota"
                            />
                            {errors.nama_produk && <p className="text-red-500 text-xs mt-1">{errors.nama_produk}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Jenis Komoditas</label>
                            <select
                                value={data.jenis}
                                onChange={e => setData('jenis', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                            >
                                <option value="pupuk">Pupuk (Penyubur)</option>
                                <option value="racun">Racun (Pestisida/Herbisida)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Harga Satuan (Rp)</label>
                                <input 
                                    type="number"
                                    value={data.harga_per_satuan}
                                    onChange={e => setData('harga_per_satuan', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                    required
                                    placeholder="Contoh: 350000"
                                />
                                {errors.harga_per_satuan && <p className="text-red-500 text-xs mt-1">{errors.harga_per_satuan}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Satuan Ukuran</label>
                                <input 
                                    type="text"
                                    value={data.satuan}
                                    onChange={e => setData('satuan', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                    required
                                    placeholder="Contoh: Sak / Liter"
                                />
                                {errors.satuan && <p className="text-red-500 text-xs mt-1">{errors.satuan}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Keterangan / Deskripsi</label>
                            <textarea 
                                value={data.deskripsi}
                                onChange={e => setData('deskripsi', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                rows="3"
                                placeholder="Contoh: Baik untuk sawit usia muda..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Unggah Foto Produk (Opsional)</label>
                            <input 
                                type="file"
                                onChange={e => setData('gambar_produk', e.target.files[0])}
                                className="mt-1 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                            {errors.gambar_produk && <p className="text-red-500 text-xs mt-1">{errors.gambar_produk}</p>}
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-sm shadow-md border-b-2 border-emerald-900"
                            >
                                {editMode ? 'Simpan Perubahan' : 'Tambah Produk'}
                            </button>
                            {editMode && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm border border-slate-300"
                                >
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* KOLOM KANAN: TABEL DAFTAR HARGA REFERENSI (8 Span) */}
                <div className="lg:col-span-8 bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-4">
                        📋 Daftar Acuan Harga Real-Time KUD
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                                    <th className="p-3" width="10%">Foto</th>
                                    <th className="p-3" width="30%">Nama Produk / Jenis</th>
                                    <th className="p-3" width="20%">Harga Satuan</th>
                                    <th className="p-3" width="25%">Deskripsi</th>
                                    <th className="p-3" width="15%">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hargaReferensis.data.length > 0 ? (
                                    hargaReferensis.data.map((produk) => (
                                        <tr key={produk.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="p-3">
                                                {produk.gambar_produk_path ? (
                                                    <img 
                                                        src={`/storage/${produk.gambar_produk_path}`} 
                                                        alt={produk.nama_produk} 
                                                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">
                                                        {produk.jenis === 'pupuk' ? '📦' : '🧪'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <p className="font-bold text-slate-800">{produk.nama_produk}</p>
                                                <span className={`inline-block px-2 py-0.5 mt-1 text-[10px] font-black uppercase rounded ${
                                                    produk.jenis === 'pupuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {produk.jenis === 'pupuk' ? 'Pupuk' : 'Racun'}
                                                </span>
                                            </td>
                                            <td className="p-3 font-extrabold text-emerald-800">
                                                {formatRupiah(produk.harga_per_satuan)} <span className="text-slate-500 font-normal text-xs">/ {produk.satuan}</span>
                                            </td>
                                            <td className="p-3 text-xs text-slate-500 leading-relaxed">
                                                {produk.deskripsi || '-'}
                                            </td>
                                            <td className="p-3 space-y-1">
                                                <button
                                                    onClick={() => handleEditClick(produk)}
                                                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-xs"
                                                >Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(produk.id)}
                                                    className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs"
                                                > Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-6 text-center text-slate-400">Belum ada harga referensi produk diinput.</td>
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