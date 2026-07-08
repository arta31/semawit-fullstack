import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout'; // Menggunakan Layout Responsif Utama

export default function Dashboard({ petani, statistik, riwayat_panen, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Inertia untuk Input Panen
    const { data, setData, post, processing, reset, errors } = useForm({
        tanggal_panen: new Date().toISOString().split('T')[0],
        berat_bersih_kg: '',
        harga_per_kg: '',
    });

    // --- TAMBAHKAN LOGIKA PERHITUNGAN DI SINI ---
    const berat = parseFloat(data.berat_bersih_kg) || 0;
    const harga = parseFloat(data.harga_per_kg) || 0;
    const total = berat * harga;
    const simPupuk = total * 0.15;
    const simRacun = total * 0.10;
    const simBersih = total * 0.75;
    // --------------------------------------------

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const formatJuta = (angka) => {
        if (angka >= 1000000) return '+Rp ' + (angka / 1000000).toFixed(1).replace('.0', '') + 'jt';
        return '+Rp ' + (angka / 1000).toFixed(0) + 'rb';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('petani.panen.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    return (
        <>
            <Head title="Beranda Petani - SEMAWIT" />

            <div className="w-full px-4 sm:px-6 lg:px-10 py-8 space-y-8 max-w-6xl mx-auto">
                
                {/* Flash Message Sukses */}
                {flash?.success && (
                    <div className="bg-emerald-100 border-l-4 border-emerald-600 text-emerald-800 p-4 rounded-r-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                        <span className="text-xl">✅</span> {flash.success}
                    </div>
                )}

                {/* GREETING & TOMBOL CATAT PANEN (Responsif Flexbox) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                            {petani.ucapan}, Pak {petani.name}! 🌾
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Panen terakhir: <span className="font-bold text-slate-700">{statistik.tanggal_panen_terakhir}</span>
                        </p>
                    </div>
                    
                    {/* TOMBOL CATAT PANEN UTAMA */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        <span className="font-bold text-lg">Catat Hasil Panen</span>
                    </button>
                </div>

                {/* KARTU STATISTIK (Grid Responsif) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Total Keseluruhan */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Hasil Panen</p>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Terbaru</span>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-black text-emerald-900">
                            {formatRupiah(statistik.total_keseluruhan)}
                        </h3>
                    </div>

                    {/* Jatah Aman */}
                    <div className="bg-emerald-700 rounded-2xl p-6 shadow-md shadow-emerald-900/20 flex justify-between items-center text-white">
                        <div>
                            <p className="text-emerald-100 text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Jatah Aman (Kebutuhan)</p>
                            <p className="text-2xl lg:text-3xl font-black">{formatRupiah(statistik.pendapatan_bersih)}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-inner">💰</div>
                    </div>

                    {/* Tabungan Modal */}
                    <div className="bg-amber-400 rounded-2xl p-6 shadow-md shadow-amber-500/20 flex justify-between items-center text-amber-950">
                        <div>
                            <p className="text-amber-900/70 text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Tabungan Modal (Pupuk)</p>
                            <p className="text-2xl lg:text-3xl font-black">{formatRupiah(statistik.saldo_tabungan)}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-300 rounded-full flex items-center justify-center text-2xl shadow-inner">📦</div>
                    </div>

                </div>

                {/* RIWAYAT PANEN LIST */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            🚜 Riwayat Panen Terakhir
                        </h3>
                        <Link href={route('petani.riwayat')} className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                            Lihat Semua &rarr;
                        </Link>
                    </div>

                    <div className="p-6 space-y-4">
                        {riwayat_panen.length > 0 ? (
                            riwayat_panen.map((panen) => (
                                <div key={panen.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-emerald-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-base">Panen {panen.nama_lahan}</h4>
                                            <p className="text-sm text-slate-500 font-medium mt-0.5">{panen.tanggal} • <span className="font-bold text-slate-700">{panen.berat_ton} Ton</span></p>
                                        </div>
                                    </div>
                                    <div className="sm:text-right bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-0 border-slate-200">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Diterima Bersih</p>
                                        <span className="font-black text-emerald-600 text-lg">{formatJuta(panen.pendapatan_bersih)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-slate-400 font-medium">Belum ada riwayat panen tercatat.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL INPUT PANEN (RESPONSIF) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-800">Catat Hasil Panen</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Panen</label>
                                <input type="date" value={data.tanggal_panen} onChange={e => setData('tanggal_panen', e.target.value)} className="w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm" required />
                                {errors.tanggal_panen && <p className="text-red-500 text-xs mt-1">{errors.tanggal_panen}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Berat Timbangan (Kg)</label>
                                <input type="number" value={data.berat_bersih_kg} onChange={e => setData('berat_bersih_kg', e.target.value)} className="w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-lg font-bold shadow-sm" placeholder="Contoh: 1500" required />
                                {errors.berat_bersih_kg && <p className="text-red-500 text-xs mt-1">{errors.berat_bersih_kg}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Harga per Kg (Rp)</label>
                                <input type="number" value={data.harga_per_kg} onChange={e => setData('harga_per_kg', e.target.value)} className="w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-lg font-bold shadow-sm" placeholder="Contoh: 2500" required />
                                {errors.harga_per_kg && <p className="text-red-500 text-xs mt-1">{errors.harga_per_kg}</p>}
                            </div>

                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mt-2">
                                <p className="text-xs text-emerald-800 font-medium italic text-center">
                                    Sistem akan otomatis memotong uang untuk tabungan pupuk & racun Anda.
                                </p>
                            </div>

                            {/* UI SIMULASI AUTO-SPLITTING */}
                            {total > 0 && (
                                <div className="space-y-4 pt-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">✨</span>
                                        Simulasi Auto-Splitting
                                    </h4>
                                    <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                                        <p className="text-xs text-slate-500 mb-1">Pendapatan Kotor</p>
                                        <p className="text-xl font-bold text-slate-900 mb-3">{formatRupiah(total)}</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Pupuk (15%)</p>
                                                <p className="text-sm font-bold text-emerald-600 mt-0.5">{formatRupiah(simPupuk)}</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Racun (10%)</p>
                                                <p className="text-sm font-bold text-blue-600 mt-0.5">{formatRupiah(simRacun)}</p>
                                            </div>
                                            <div className="bg-emerald-600 rounded-xl p-3 shadow-sm">
                                                <p className="text-[10px] text-emerald-200 font-semibold uppercase">Sisa Bersih</p>
                                                <p className="text-sm font-bold text-white mt-0.5">{formatRupiah(simBersih)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={processing} className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg py-4 rounded-xl shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2">
                                {processing ? 'Menyimpan...' : 'Simpan & Potong Tabungan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

// PERBAIKAN: Gunakan MainLayout yang di-import agar responsif
Dashboard.layout = page => <MainLayout>{page}</MainLayout>;