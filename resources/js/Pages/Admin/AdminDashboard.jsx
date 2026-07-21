import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ metrics, recentPanens }) {
    
    const formatRupiah = (angka) => {
        return "Rp " + parseInt(angka || 0).toLocaleString('id-ID');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Head title="Dasbor Utama KUD - SEMAWIT" />

            {/* HEADER ATAS */}
            {/* HEADER ATAS (Glassmorphism Floating Header + Nav Menu) */}
            <header className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-md border-b border-white/10 shadow-lg py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* Logo & Judul Aplikasi */}
                    <div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
                            SEMAWIT KUD
                        </h1>
                        <p className="text-[10px] text-slate-300 font-bold tracking-wider uppercase mt-0.5">Panel Utama Pengurus Koperasi</p>
                    </div>

                    {/* MENU NAVIGASI AKTIF (Glassmorphism Nav Menu) */}
                    <nav className="flex flex-wrap justify-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5">
                        <Link 
                            href={route('admin.dashboard')} 
                            className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                            🏠 Dasbor Utama
                        </Link>
                        <Link 
                            href={route('admin.harga-referensi.index')} 
                            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                            📈 Harga Pasar
                        </Link>
                        <Link 
                            href={route('admin.petani.index')} 
                            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                            👥 Setup Petani
                        </Link>
                        <Link 
                            href={route('admin.panen.index')} 
                            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                            ⚖️ Catat Panen
                        </Link>
                        <Link 
                            href={route('admin.perawatan.index')} 
                            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                            💳 Cairkan Pupuk
                        </Link>
                    </nav>

                    {/* Tombol Keluar */}
                    <div>
                        <Link 
                            href="/logout-darurat" 
                            className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-200 font-extrabold rounded-xl text-xs tracking-wider uppercase shadow-md transition-all duration-300"
                        >
                            Keluar
                        </Link>
                    </div>

                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

                {/* 1. KARTU METRIK KPI UTAMA (4 Kolom Cantik) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Kartu 1: Total Petani */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Anggota Petani</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{metrics.total_petani} Orang</h3>
                        </div>
                        <div className="text-3xl bg-emerald-50 p-3 rounded-lg">👥</div>
                    </div>

                    {/* Kartu 2: Total Timbangan */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Timbangan Panen</p>
                            <h3 className="text-3xl font-black text-slate-800 mt-1">{(metrics.total_berat_kg).toLocaleString('id-ID')} Kg</h3>
                        </div>
                        <div className="text-3xl bg-emerald-50 p-3 rounded-lg">⚖️</div>
                    </div>

                    {/* Kartu 3: Total Kas Sinking Fund */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Kas Sinking Fund</p>
                            <h3 className="text-2xl font-black text-emerald-800 mt-2">{formatRupiah(metrics.total_tabungan_rp)}</h3>
                        </div>
                        <div className="text-3xl bg-emerald-50 p-3 rounded-lg">💰</div>
                    </div>

                    {/* Kartu 4: Total Belanja Cair */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Perawatan Cair</p>
                            <h3 className="text-2xl font-black text-red-700 mt-2">{formatRupiah(metrics.total_pengeluaran_rp)}</h3>
                        </div>
                        <div className="text-3xl bg-red-50 p-3 rounded-lg">🛠️</div>
                    </div>

                </div>

                {/* 2. MENU NAVIGASI CEPAT (Jembatan Penghubung 4 Fitur Utama) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-100 pb-2">
                        🚀 Akses Cepat Menu Manajemen KUD
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        {/* Tombol 1: Manajemen Harga */}
                        <Link 
                            href={route('admin.harga-referensi.index')}
                            className="p-4 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 rounded-xl border border-slate-200 text-center space-y-2 block"
                        >
                            <span className="text-3xl block">📈</span>
                            <span className="font-extrabold text-sm text-slate-800 block">Manajemen Harga Pasar</span>
                            <span className="text-[10px] text-slate-400 block">Atur acuan harga pupuk &amp; racun</span>
                        </Link>

                        {/* Tombol 2: Setup Petani */}
                        <Link 
                            href={route('admin.petani.index')}
                            className="p-4 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 rounded-xl border border-slate-200 text-center space-y-2 block"
                        >
                            <span className="text-3xl block">📝</span>
                            <span className="font-extrabold text-sm text-slate-800 block">Daftar Petani Baru (Wizard)</span>
                            <span className="text-[10px] text-slate-400 block">Onboarding target sinking fund</span>
                        </Link>

                        {/* Tombol 3: Catat Timbangan */}
                        <Link 
                            href={route('admin.panen.index')}
                            className="p-4 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 rounded-xl border border-slate-200 text-center space-y-2 block"
                        >
                            <span className="text-3xl block">⚖️</span>
                            <span className="font-extrabold text-sm text-slate-800 block">Catat Timbangan Panen</span>
                            <span className="text-[10px] text-slate-400 block">Input panen &amp; potong otomatis</span>
                        </Link>

                        {/* Tombol 4: Belanja Perawatan */}
                        <Link 
                            href={route('admin.perawatan.index')}
                            className="p-4 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 rounded-xl border border-slate-200 text-center space-y-2 block"
                        >
                            <span className="text-3xl block">💳</span>
                            <span className="font-extrabold text-sm text-slate-800 block">Cairkan Tabungan Pupuk</span>
                            <span className="text-[10px] text-slate-400 block">Potong saldo tabungan pupuk</span>
                        </Link>

                    </div>
                </div>

                {/* 3. AKTIVITAS PANEN TERBARU */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-100 pb-2 mb-4">
                        🔔 Aktivitas Timbangan Panen Terakhir (Real-Time)
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                                    <th className="p-3">Tanggal Timbang</th>
                                    <th className="p-3">Nama Petani Anggota</th>
                                    <th className="p-3">Total Berat Bersih</th>
                                    <th className="p-3">Simpanan Pupuk (15%)</th>
                                    <th className="p-3">Simpanan Racun (10%)</th>
                                    <th className="p-3">Diterima Petani (75%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPanens.length > 0 ? (
                                    recentPanens.map((panen) => (
                                        <tr key={panen.id} className="border-b border-slate-100 hover:bg-slate-50 text-xs">
                                            <td className="p-3 font-bold text-slate-700">
                                                {new Date(panen.tanggal_panen).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                            </td>
                                            <td className="p-3 font-semibold text-slate-800">
                                                {panen.profil_lahan.user.name} ({panen.profil_lahan.nama_lahan})
                                            </td>
                                            <td className="p-3 font-bold text-slate-800">
                                                {parseInt(panen.berat_bersih_kg).toLocaleString('id-ID')} Kg
                                            </td>
                                            <td className="p-3 font-semibold text-emerald-800">
                                                {formatRupiah(panen.nominal_pupuk)}
                                            </td>
                                            <td className="p-3 font-semibold text-emerald-800">
                                                {formatRupiah(panen.nominal_racun)}
                                            </td>
                                            <td className="p-3 font-black text-emerald-950 text-sm">
                                                {formatRupiah(panen.nominal_rumah_tangga)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-6 text-center text-slate-400">Belum ada aktivitas timbangan panen tercatat.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}