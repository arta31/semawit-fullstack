import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Dashboard({ metrics, recentPanens = [] }) {
    const formatRupiah = (angka) => {
        return "Rp " + parseInt(angka || 0).toLocaleString('id-ID');
    };

    // Solusi agar class dinamis tidak terkena purge oleh Tailwind CSS
    const kpiStyles = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
        red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    };

    return (
        <>
            <Head title="Dasbor Utama KUD - SEMAWIT" />

            <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* ── WELCOME SECTION ─────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang di Panel KUD 👋</h2>
                        <p className="text-sm text-slate-500 mt-1">Berikut adalah ringkasan aktivitas dan keuangan Sinking Fund hari ini.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 w-full sm:w-auto">
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Tanggal Hari Ini</p>
                            <p className="text-sm font-semibold text-emerald-800 mt-1">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── 1. KARTU KPI (STATISTIK UTAMA) ──────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Petani', val: metrics?.total_petani, unit: 'Orang', color: 'blue', icon: '👥' },
                        { label: 'Total Timbangan', val: metrics?.total_berat_kg, unit: 'Kg', color: 'emerald', icon: '⚖️' },
                        { label: 'Kas Sinking Fund', val: metrics?.total_tabungan_rp, isRp: true, color: 'amber', icon: '💰' },
                        { label: 'Perawatan Cair', val: metrics?.total_pengeluaran_rp, isRp: true, color: 'red', icon: '🛠️' },
                    ].map((item, i) => {
                        const style = kpiStyles[item.color];
                        return (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex justify-between items-center">
                                    <div className={`h-11 w-11 rounded-xl ${style.bg} ${style.text} flex items-center justify-center text-xl border ${style.border}`}>
                                        {item.icon}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse uppercase tracking-wider">
                                        Live
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                                        {item.isRp ? formatRupiah(item.val) : (item.val || 0).toLocaleString('id-ID')}
                                        {!item.isRp && <span className="text-xs font-medium text-slate-400 ml-1.5 uppercase">{item.unit}</span>}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── 2. MENU NAVIGASI CEPAT (QUICK ACTIONS) ──────────────────────── */}
                <div>
                    <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">🚀 Akses Cepat Modul</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href={route('admin.petani.index')} className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-lg group-hover:bg-emerald-50 transition-colors">
                                    📝
                                </div>
                                <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">Registrasi Petani</h3>
                            <p className="text-xs text-slate-400 mt-1">Onboarding & setup target tabungan</p>
                        </Link>

                        <Link href={route('admin.panen.index')} className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-lg group-hover:bg-emerald-50 transition-colors">
                                    ⚖️
                                </div>
                                <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">Catat Panen</h3>
                            <p className="text-xs text-slate-400 mt-1">Input timbangan & potong otomatis</p>
                        </Link>

                        <Link href={route('admin.perawatan.index')} className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-lg group-hover:bg-emerald-50 transition-colors">
                                    💳
                                </div>
                                <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">Cairkan Tabungan</h3>
                            <p className="text-xs text-slate-400 mt-1">Catat pengambilan pupuk/racun</p>
                        </Link>

                        <Link href={route('admin.harga-referensi.index')} className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-lg group-hover:bg-emerald-50 transition-colors">
                                    📈
                                </div>
                                <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">Harga Referensi</h3>
                            <p className="text-xs text-slate-400 mt-1">Atur acuan harga pasar KUD</p>
                        </Link>
                    </div>
                </div>

                {/* ── 3. TABEL MONITORING (LIGHT THEME) ──────────────────────── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                                <span className="text-xl">🔔</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Aktivitas Timbangan Panen Terakhir</h2>
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
                                    Live Monitoring Sistem
                                </p>
                            </div>
                        </div>
                        <Link href={route('admin.panen.index')} className="inline-flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-colors w-full sm:w-auto">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/75 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-200/80">
                                    <th className="py-3 px-6 font-semibold">Tanggal Timbang</th>
                                    <th className="py-3 px-6 font-semibold">Nama Petani Anggota</th>
                                    <th className="py-3 px-6 font-semibold text-right">Total Berat Bersih</th>
                                    <th className="py-3 px-6 font-semibold text-right text-emerald-600">Simpanan Pupuk (15%)</th>
                                    <th className="py-3 px-6 font-semibold text-right text-emerald-600">Simpanan Racun (10%)</th>
                                    <th className="py-3 px-6 font-semibold text-right text-slate-700">Diterima Petani (75%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {recentPanens.length > 0 ? recentPanens.map((panen) => (
                                    <tr key={panen.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">
                                            {new Date(panen.tanggal_panen).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-xs font-bold">
                                                    {panen.profil_lahan?.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 font-semibold">{panen.profil_lahan?.user?.name}</p>
                                                    <p className="text-[11px] text-slate-400 uppercase font-medium tracking-wide mt-0.5">{panen.profil_lahan?.nama_lahan}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right font-semibold text-slate-900 whitespace-nowrap">
                                            {parseInt(panen.berat_bersih_kg).toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal ml-0.5">KG</span>
                                        </td>
                                        <td className="py-4 px-6 text-right text-emerald-600 font-medium whitespace-nowrap">
                                            {formatRupiah(panen.nominal_pupuk)}
                                        </td>
                                        <td className="py-4 px-6 text-right text-emerald-600 font-medium whitespace-nowrap">
                                            {formatRupiah(panen.nominal_racun)}
                                        </td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            <span className="inline-block bg-slate-100 text-slate-800 font-semibold px-3 py-1 rounded-lg text-xs border border-slate-200/60">
                                                {formatRupiah(panen.nominal_rumah_tangga)}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <p className="text-slate-400 font-medium text-sm">Belum ada aktivitas timbangan panen tercatat.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}

Dashboard.layout = page => <MainLayout children={page} />;