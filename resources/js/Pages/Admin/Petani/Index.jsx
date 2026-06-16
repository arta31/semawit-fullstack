import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Index({ petanis, pupukPilihan, racunPilihan, flash }) {
    // Definisikan state form pendaftaran & onboarding menggunakan useForm Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone_number: '',
        nama_lahan: '',
        luas_lahan_hektar: '',
        jumlah_pohon: '',
        frekuensi_pemupukan_tahunan: '2', // Default 2x setahun
        lokasi_koordinat: '',
        harga_referensi_pupuk_id: '',
        harga_referensi_racun_id: '',
    });

    const formatRupiah = (angka) => {
        return "Rp " + parseInt(angka || 0).toLocaleString('id-ID');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.petani.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head title="Setup Klien (Onboarding) - SEMAWIT" />

            {/* HEADER ATAS */}
            <header className="bg-emerald-800 text-white py-5 px-6 shadow-md border-b-4 border-amber-500">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">SEMAWIT KUD - Panel Admin</h1>
                        <p className="text-sm text-emerald-100">Setup Klien Petani & Onboarding Sinking Fund</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/logout-darurat" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm shadow">
                            Keluar
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* KOLOM KIRI: ONBOARDING WIZARD FORM (7 Span) */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* ALERT SUKSES DARI BACKEND (Momen Aha! Deskriptif Matematika) */}
                    {flash.success && (
                        <div className="bg-emerald-50 border-l-8 border-emerald-600 p-5 rounded-r-xl text-emerald-900 shadow-md">
                            <h3 className="text-lg font-bold text-emerald-800">🎉 Onboarding Berhasil!</h3>
                            <p className="text-sm font-semibold mt-1 leading-relaxed">{flash.success}</p>
                        </div>
                    )}

                    {flash.error && (
                        <div className="bg-red-50 border-l-8 border-red-500 p-4 rounded-r-xl text-red-900 shadow-md">
                            <p className="text-sm font-bold">{flash.error}</p>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-emerald-950 mb-4 border-b-2 border-slate-100 pb-2">
                            📝 1. Registrasi Petani & Profil Lahan
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Input Informasi Akun */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Nama Lengkap Petani</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        required 
                                        placeholder="Contoh: Pak Wakijo"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Nomor WhatsApp Petani</label>
                                    <input 
                                        type="text" 
                                        value={data.phone_number} 
                                        onChange={e => setData('phone_number', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        required 
                                        placeholder="Contoh: 0812345678"
                                    />
                                    {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                                </div>
                            </div>

                            {/* Input Informasi Lahan */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Nama Lahan</label>
                                    <input 
                                        type="text" 
                                        value={data.nama_lahan} 
                                        onChange={e => setData('nama_lahan', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        required 
                                        placeholder="Contoh: Kebun Bukit Indah"
                                    />
                                    {errors.nama_lahan && <p className="text-red-500 text-xs mt-1">{errors.nama_lahan}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Luas Lahan (Hektar)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        value={data.luas_lahan_hektar} 
                                        onChange={e => setData('luas_lahan_hektar', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        required 
                                        placeholder="Contoh: 2"
                                    />
                                    {errors.luas_lahan_hektar && <p className="text-red-500 text-xs mt-1">{errors.luas_lahan_hektar}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Jumlah Pohon Sawit</label>
                                    <input 
                                        type="number" 
                                        value={data.jumlah_pohon} 
                                        onChange={e => setData('jumlah_pohon', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        required 
                                        placeholder="Contoh: 270"
                                    />
                                    {errors.jumlah_pohon && <p className="text-red-500 text-xs mt-1">{errors.jumlah_pohon}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Frekuensi Pemupukan / Tahun</label>
                                    <select 
                                        value={data.frekuensi_pemupukan_tahunan} 
                                        onChange={e => setData('frekuensi_pemupukan_tahunan', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                    >
                                        <option value="1">1 Kali Setahun</option>
                                        <option value="2">2 Kali Setahun</option>
                                        <option value="3">3 Kali Setahun</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Lokasi Koordinat (Opsional)</label>
                                    <input 
                                        type="text" 
                                        value={data.lokasi_koordinat} 
                                        onChange={e => setData('lokasi_koordinat', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        placeholder="Contoh: -0.123, 101.456"
                                    />
                                </div>
                            </div>

                            {/* WIZARD CARD SELECTION: PILIH PUPUK (Sesuai PDF) */}
                            <div className="border-t border-slate-100 pt-4 space-y-3">
                                <h3 className="text-base font-bold text-emerald-950">📦 2. Pilih Jenis Pupuk yang Biasa Digunakan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pupukPilihan.map((pupuk) => (
                                        <div 
                                            key={pupuk.id}
                                            onClick={() => setData('harga_referensi_pupuk_id', pupuk.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                data.harga_referensi_pupuk_id === pupuk.id 
                                                ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500' 
                                                : 'border-slate-200 hover:border-emerald-400 bg-white'
                                            }`}
                                        >
                                            <h4 className="font-extrabold text-slate-800">{pupuk.nama_produk}</h4>
                                            <p className="text-sm text-emerald-700 font-bold mt-1">{formatRupiah(pupuk.harga_per_satuan)} / {pupuk.satuan}</p>
                                            <p className="text-xs text-slate-500 mt-2">{pupuk.deskripsi || 'Referensi Resmi KUD'}</p>
                                        </div>
                                    ))}
                                </div>
                                {errors.harga_referensi_pupuk_id && <p className="text-red-500 text-xs">{errors.harga_referensi_pupuk_id}</p>}
                            </div>

                            {/* WIZARD CARD SELECTION: PILIH RACUN */}
                            <div className="border-t border-slate-100 pt-4 space-y-3">
                                <h3 className="text-base font-bold text-emerald-950">🧪 3. Pilih Jenis Racun Rumput yang Biasa Digunakan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {racunPilihan.map((racun) => (
                                        <div 
                                            key={racun.id}
                                            onClick={() => setData('harga_referensi_racun_id', racun.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                                data.harga_referensi_racun_id === racun.id 
                                                ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500' 
                                                : 'border-slate-200 hover:border-emerald-400 bg-white'
                                            }`}
                                        >
                                            <h4 className="font-extrabold text-slate-800">{racun.nama_produk}</h4>
                                            <p className="text-sm text-emerald-700 font-bold mt-1">{formatRupiah(racun.harga_per_satuan)} / {racun.satuan}</p>
                                            <p className="text-xs text-slate-500 mt-2">{racun.deskripsi || 'Referensi Resmi KUD'}</p>
                                        </div>
                                    ))}
                                </div>
                                {errors.harga_referensi_racun_id && <p className="text-red-500 text-xs">{errors.harga_referensi_racun_id}</p>}
                            </div>

                            {/* Tombol Simpan Terkunci (Wizard Trigger) */}
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg rounded-xl shadow-md border-b-4 border-emerald-950 active:border-b-0"
                            >
                                {processing ? 'Sedang Memproses...' : 'Kunci Onboarding & Simpan Petani'}
                            </button>

                        </form>
                    </div>
                </div>

                {/* KOLOM KANAN: TABEL DAFTAR ANGGOTA PETANI (5 Span) */}
                <div className="lg:col-span-5 bg-white rounded-xl shadow-md border border-slate-200 p-6 h-fit space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-100 pb-2">
                        👥 Anggota Petani Aktif
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                                    <th className="p-3">Nama / WhatsApp</th>
                                    <th className="p-3">Info Lahan</th>
                                    <th className="p-3">Sinking Fund (Pupuk / Racun)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {petanis.data.length > 0 ? (
                                    petanis.data.map((petani) => {
                                        const lahan = petani.profil_lahans?.[0] || null;
                                        const perawatan = lahan?.informasi_perawatan || null;

                                        return (
                                            <tr key={petani.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="p-3">
                                                    <p className="font-bold text-slate-800">{petani.name}</p>
                                                    <p className="text-xs text-slate-500">{petani.phone_number}</p>
                                                </td>
                                                <td className="p-3">
                                                    {lahan ? (
                                                        <>
                                                            <p className="font-semibold text-emerald-800 text-xs uppercase">{lahan.nama_lahan}</p>
                                                            <p className="text-xs text-slate-600">{lahan.luas_lahan_hektar} Ha ({lahan.jumlah_pohon} Phn)</p>
                                                        </>
                                                    ) : (
                                                        <span className="text-red-500 text-xs">Belum ada lahan</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-xs space-y-1">
                                                    {perawatan ? (
                                                        <>
                                                            <p className="text-slate-600">
                                                                Pupuk: <strong>{formatRupiah(perawatan.saldo_pupuk_saat_ini)}</strong> 
                                                                <span className="text-slate-400"> / {formatRupiah(perawatan.target_tabungan_pupuk)}</span>
                                                            </p>
                                                            <p className="text-slate-600">
                                                                Racun: <strong>{formatRupiah(perawatan.saldo_racun_saat_ini)}</strong> 
                                                                <span className="text-slate-400"> / {formatRupiah(perawatan.target_tabungan_racun)}</span>
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-6 text-center text-slate-400">Belum ada anggota petani terdaftar.</td>
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