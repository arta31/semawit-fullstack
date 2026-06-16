import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Index({ dataPanens, profilLahans, flash }) {
    // Definisikan state form catat panen menggunakan useForm Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        profil_lahan_id: '',
        tanggal_panen: new Date().toISOString().split('T')[0], // Default ke tanggal hari ini
        berat_bersih_kg: '',
        harga_per_kg: '',
    });

    const formatRupiah = (angka) => {
        return "Rp " + parseInt(angka || 0).toLocaleString('id-ID');
    };

    // LOGIKA LIVE-CALCULATION (Kalkulasi simulasi real-time sebelum data di-submit)
    const beratInput = parseFloat(data.berat_bersih_kg) || 0;
    const hargaInput = parseFloat(data.harga_per_kg) || 0;
    const simulasiTotal = beratInput * hargaInput;
    const simulasiPupuk = simulasiTotal * 0.15; // Alokasi 15%
    const simulasiRacun = simulasiTotal * 0.10; // Alokasi 10%
    const simulasiBersih = simulasiTotal - (simulasiPupuk + simulasiRacun); // Jatah aman belanja 75%

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.panen.store'), {
            onSuccess: () => {
                reset('berat_bersih_kg', 'harga_per_kg'); // Reset hanya input angka saja
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head title="Pencatatan Panen - SEMAWIT" />

            {/* HEADER ATAS */}
            <header className="bg-emerald-800 text-white py-5 px-6 shadow-md border-b-4 border-amber-500">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">SEMAWIT KUD - Panel Admin</h1>
                        <p className="text-sm text-emerald-100">Siklus Pemasukan: Pencatatan Panen &amp; Auto-Splitting</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/logout-darurat" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm shadow">
                            Keluar
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* KOLOM KIRI: FORM CATAT PANEN & LIVE CALCULATION (4 Span) */}
                <div className="lg:col-span-4 bg-white rounded-xl shadow-md border border-slate-200 p-6 h-fit space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-100 pb-2">
                        ⚖️ Input Hasil Panen Kolektif
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
                            <label className="block text-xs font-bold text-slate-500 uppercase">Pilih Lahan Anggota Petani</label>
                            <select
                                value={data.profil_lahan_id}
                                onChange={e => setData('profil_lahan_id', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                required
                            >
                                <option value="">-- Pilih Petani &amp; Lahannya --</option>
                                {profilLahans.map((lahan) => (
                                    <option key={lahan.id} value={lahan.id}>
                                        {lahan.user.name} - {lahan.nama_lahan} ({lahan.luas_lahan_hektar} Ha)
                                    </option>
                                ))}
                            </select>
                            {errors.profil_lahan_id && <p className="text-red-500 text-xs mt-1">{errors.profil_lahan_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase">Tanggal Timbang / Panen</label>
                            <input 
                                type="date"
                                value={data.tanggal_panen}
                                onChange={e => setData('tanggal_panen', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                required
                            />
                            {errors.tanggal_panen && <p className="text-red-500 text-xs mt-1">{errors.tanggal_panen}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Berat Bersih (Kg)</label>
                                <input 
                                    type="number"
                                    value={data.berat_bersih_kg}
                                    onChange={e => setData('berat_bersih_kg', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm font-bold text-emerald-950"
                                    required
                                    placeholder="Contoh: 1500"
                                />
                                {errors.berat_bersih_kg && <p className="text-red-500 text-xs mt-1">{errors.berat_bersih_kg}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Harga Jual / Kg (Rp)</label>
                                <input 
                                    type="number"
                                    value={data.harga_per_kg}
                                    onChange={e => setData('harga_per_kg', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm font-bold text-emerald-950"
                                    required
                                    placeholder="Contoh: 2500"
                                />
                                {errors.harga_per_kg && <p className="text-red-500 text-xs mt-1">{errors.harga_per_kg}</p>}
                            </div>
                        </div>

                        {/* KARTU VISUAL LIVE-CALCULATION (Sangat Keren Untuk Demo!) */}
                        {simulasiTotal > 0 && (
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-2">
                                <h3 className="text-xs font-black text-emerald-800 uppercase tracking-wider">📊 Simulasi Auto-Splitting (Real-time)</h3>
                                <div className="border-b border-emerald-100 pb-2">
                                    <p className="text-xs font-bold text-slate-500">Pendapatan Kotor:</p>
                                    <p className="text-xl font-black text-emerald-950">{formatRupiah(simulasiTotal)}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-600">
                                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                                        <p className="text-[10px] text-slate-400">Pupuk (15%)</p>
                                        <p className="text-emerald-700 font-extrabold">{formatRupiah(simulasiPupuk)}</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                                        <p className="text-[10px] text-slate-400">Racun (10%)</p>
                                        <p className="text-emerald-700 font-extrabold">{formatRupiah(simulasiRacun)}</p>
                                    </div>
                                    <div className="bg-emerald-600 p-2 rounded-lg text-white">
                                        <p className="text-[10px] text-emerald-200">Sisa Bersih</p>
                                        <p className="font-extrabold">{formatRupiah(simulasiBersih)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg rounded-xl shadow-md border-b-4 border-emerald-950 active:border-b-0"
                        >
                            {processing ? 'Sedang Menyimpan...' : 'Simpan Panen & Potong Otomatis'}
                        </button>
                    </form>
                </div>

                {/* KOLOM KANAN: RIWAYAT PENERIMAAN PANEN KOLEKTIF (8 Span) */}
                <div className="lg:col-span-8 bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-4">
                        📋 Riwayat Pencatatan Panen Terkini
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                                    <th className="p-3">Tanggal / Petani</th>
                                    <th className="p-3">Hasil Timbangan</th>
                                    <th className="p-3">Bruto (Kotor)</th>
                                    <th className="p-3 text-emerald-800">Alokasi Simpanan</th>
                                    <th className="p-3">Jatah Bersih Petani</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataPanens.data.length > 0 ? (
                                    dataPanens.data.map((panen) => (
                                        <tr key={panen.id} className="border-b border-slate-100 hover:bg-slate-50 text-xs">
                                            <td className="p-3">
                                                <p className="font-bold text-slate-800">{new Date(panen.tanggal_panen).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                                                <p className="text-slate-500 font-semibold mt-0.5">{panen.profil_lahan.user.name} ({panen.profil_lahan.nama_lahan})</p>
                                            </td>
                                            <td className="p-3">
                                                <p className="font-bold text-slate-800">{parseInt(panen.berat_bersih_kg).toLocaleString('id-ID')} Kg</p>
                                                <p className="text-slate-500 text-[10px]">@{formatRupiah(panen.harga_per_kg)}/Kg</p>
                                            </td>
                                            <td className="p-3 font-bold text-slate-700">
                                                {formatRupiah(panen.total_pendapatan)}
                                            </td>
                                            <td className="p-3 text-[10px] space-y-0.5 text-emerald-800 font-semibold">
                                                <p>📦 Pupuk: {formatRupiah(panen.nominal_pupuk)}</p>
                                                <p>🧪 Racun: {formatRupiah(panen.nominal_racun)}</p>
                                            </td>
                                            <td className="p-3 font-extrabold text-emerald-700 text-sm">
                                                {formatRupiah(panen.nominal_rumah_tangga)}
                                            </td>
                                            <td className="p-3">
                                                {/* Link PDF khusus per lahan */}
                                                <a 
                                                    href={route('admin.laporan.panen.pdf', panen.profil_lahan_id)}
                                                    target="_blank"
                                                    className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded hover:bg-emerald-200"
                                                >
                                                    Cetak Struk
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-6 text-center text-slate-400">Belum ada riwayat penerimaan panen.</td>
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