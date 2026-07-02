import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Users, Scale, Wallet, Wrench, Zap, FileText, TrendingUp, CreditCard, Bell, ChevronRight, ArrowUpRight } from 'lucide-react';

export default function Dashboard({ metrics, recentPanens = [] }) {
    const formatRupiah = (angka) => 'Rp ' + parseInt(angka || 0).toLocaleString('id-ID');

    const kpiItems = [
        {
            label: 'Total Petani',
            val: metrics?.total_petani,
            unit: 'Orang',
            Icon: Users,
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-100',
        },
        {
            label: 'Total Timbangan',
            val: metrics?.total_berat_kg,
            unit: 'Kg',
            Icon: Scale,
            gradient: 'from-emerald-500 to-emerald-600',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            border: 'border-emerald-100',
        },
        {
            label: 'Kas Sinking Fund',
            val: metrics?.total_tabungan_rp,
            isRp: true,
            Icon: Wallet,
            gradient: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-100',
        },
        {
            label: 'Total Perawatan Cair',
            val: metrics?.total_pengeluaran_rp,
            isRp: true,
            Icon: Wrench,
            gradient: 'from-red-500 to-rose-500',
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-100',
        },
    ];

    const quickActions = [
        { href: route('admin.petani.index'),          Icon: FileText,   title: 'Data Petani',      desc: 'Onboarding & setup target tabungan',   color: 'text-blue-600',    hoverBorder: 'hover:border-blue-300' },
        { href: route('admin.panen.index'),           Icon: Scale,      title: 'Catat Panen',      desc: 'Input timbangan & potong otomatis',    color: 'text-emerald-600', hoverBorder: 'hover:border-emerald-300' },
        { href: route('admin.perawatan.index'),       Icon: CreditCard, title: 'Cairkan Tabungan', desc: 'Catat pengambilan pupuk/racun',         color: 'text-amber-600',   hoverBorder: 'hover:border-amber-300' },
        { href: route('admin.harga-referensi.index'), Icon: TrendingUp, title: 'Harga Referensi',  desc: 'Atur acuan harga pasar KUD',            color: 'text-teal-600',    hoverBorder: 'hover:border-teal-300' },
    ];

    return (
        <>
            <Head title="Dasbor Utama KUD - SEMAWIT" />

            <div className="space-y-6">

                {/* Welcome Banner */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 rounded-2xl p-6 sm:p-8 shadow-lg">
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(#fff 1px, transparent 1px)', backgroundSize:'20px 20px'}} />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-widest mb-1">Panel Admin KUD</p>
                            <h1 className="text-2xl font-bold text-white">Selamat Datang di SEMAWIT</h1>
                            <p className="text-sm text-emerald-200/70 mt-1">Ringkasan aktivitas dan keuangan Sinking Fund hari ini.</p>
                        </div>
                        <div className="bg-white/10 border border-white/15 rounded-xl px-5 py-3 backdrop-blur-sm shrink-0">
                            <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider">Hari ini</p>
                            <p className="text-sm font-semibold text-white mt-0.5">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiItems.map((item, i) => (
                        <div key={i} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5">
                            <div className="flex items-start justify-between">
                                <div className={`h-11 w-11 rounded-xl ${item.bg} ${item.text} flex items-center justify-center border ${item.border} shadow-sm`}>
                                    <item.Icon size={20} />
                                </div>
                                <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                <p className="text-xl font-bold text-slate-900 mt-1 leading-tight">
                                    {item.isRp ? formatRupiah(item.val) : (item.val || 0).toLocaleString('id-ID')}
                                    {!item.isRp && <span className="text-sm font-medium text-slate-400 ml-1">{item.unit}</span>}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={15} className="text-emerald-600" />
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Akses Cepat</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {quickActions.map((item) => (
                            <Link key={item.title} href={item.href}
                                className={`group bg-white rounded-xl p-5 border border-slate-200 ${item.hoverBorder} hover:shadow-sm transition-all`}>
                                <div className="flex items-center justify-between mb-3">
                                    <item.Icon size={20} className={`${item.color} transition-transform group-hover:scale-110`} />
                                    <ArrowUpRight size={15} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </div>
                                <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">{item.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5 leading-5">{item.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Monitoring Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <Bell size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Aktivitas Panen Terakhir</h2>
                                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    Live Monitoring
                                </p>
                            </div>
                        </div>
                        <Link href={route('admin.panen.index')}
                            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-4 py-2 rounded-xl transition-colors w-full sm:w-auto justify-center">
                            Lihat Semua <ChevronRight size={13} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    {['Tanggal', 'Petani', 'Berat Bersih', 'Pupuk (15%)', 'Racun (10%)', 'Diterima (75%)'].map((h, i) => (
                                        <th key={h} className={`py-3 px-6 text-xs font-semibold uppercase tracking-wider ${i >= 2 ? (i <= 4 ? 'text-right text-emerald-600' : 'text-right text-slate-500') : 'text-slate-500'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentPanens.length > 0 ? recentPanens.map((panen) => (
                                    <tr key={panen.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-6 text-sm text-slate-600 font-medium whitespace-nowrap">
                                            {new Date(panen.tanggal_panen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                                    {panen.profil_lahan?.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{panen.profil_lahan?.user?.name}</p>
                                                    <p className="text-xs text-slate-400">{panen.profil_lahan?.nama_lahan}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right text-sm font-semibold text-slate-900 whitespace-nowrap">
                                            {parseInt(panen.berat_bersih_kg).toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">Kg</span>
                                        </td>
                                        <td className="py-4 px-6 text-right text-sm font-medium text-emerald-600 whitespace-nowrap">{formatRupiah(panen.nominal_pupuk)}</td>
                                        <td className="py-4 px-6 text-right text-sm font-medium text-emerald-600 whitespace-nowrap">{formatRupiah(panen.nominal_racun)}</td>
                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                            <span className="inline-block bg-slate-100 text-slate-800 text-sm font-semibold px-3 py-1 rounded-lg border border-slate-200">
                                                {formatRupiah(panen.nominal_rumah_tangga)}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                    <Scale size={20} className="text-slate-400" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">Belum ada aktivitas timbangan panen.</p>
                                                <p className="text-xs text-slate-400">Data akan muncul setelah Admin mencatat panen pertama.</p>
                                            </div>
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
