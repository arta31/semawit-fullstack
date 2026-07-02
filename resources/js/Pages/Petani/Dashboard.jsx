import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, FlaskConical, CheckCircle2, Clock, LogOut, Leaf, TrendingUp } from 'lucide-react';

export default function Dashboard({ auth, profilLahans }) {
    const lahan     = auth.user.profil_lahans?.[0] || profilLahans?.[0] || null;
    const perawatan = lahan?.informasi_perawatan || null;

    const hitungPersen = (saatIni, target) => {
        if (!target || target == 0) return 0;
        return Math.min(Math.round((parseFloat(saatIni) / parseFloat(target)) * 100), 100);
    };

    const persenPupuk = perawatan ? hitungPersen(perawatan.saldo_pupuk_saat_ini, perawatan.target_tabungan_pupuk) : 0;
    const persenRacun = perawatan ? hitungPersen(perawatan.saldo_racun_saat_ini, perawatan.target_tabungan_racun) : 0;
    const formatRupiah = (angka) => 'Rp ' + parseInt(angka || 0).toLocaleString('id-ID');

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
            <Head title="Tabunganku - SEMAWIT" />

            {/* Header */}
            <header className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-800 shadow-lg">
                {/* Decorative top bar */}
                <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />
                <div className="max-w-xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                                <Leaf size={22} className="text-emerald-900" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">Aplikasi SEMAWIT</p>
                                <h1 className="text-xl font-bold text-white leading-tight mt-0.5">
                                    Halo, {auth.user.name.split(' ')[0]}!
                                </h1>
                            </div>
                        </div>
                        <Link
                            href="/logout-darurat"
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/30 border border-white/15 hover:border-red-400/40 text-white text-sm font-semibold rounded-xl transition-all"
                        >
                            <LogOut size={15} />
                            Keluar
                        </Link>
                    </div>
                </div>
                {/* Bottom wave */}
                <svg viewBox="0 0 1440 32" className="w-full block" fill="white" preserveAspectRatio="none" style={{height: '24px'}}>
                    <path d="M0,16 C480,32 960,0 1440,16 L1440,32 L0,32 Z" />
                </svg>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-4">

                {/* Kartu Lahan */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-3 border-b border-emerald-100 flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-600" />
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Informasi Lahan Anda</p>
                    </div>
                    <div className="px-5 py-5">
                        <h2 className="text-2xl font-bold text-slate-800">{lahan ? lahan.nama_lahan : 'Lahan Utama'}</h2>
                        <div className="flex items-center gap-6 mt-3">
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Luas Lahan</p>
                                <p className="text-xl font-bold text-slate-800 mt-0.5">
                                    {lahan ? parseFloat(lahan.luas_lahan_hektar) : 0}
                                    <span className="text-sm font-normal text-slate-400 ml-1">Hektar</span>
                                </p>
                            </div>
                            <div className="w-px h-10 bg-slate-200" />
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Jumlah Pohon</p>
                                <p className="text-xl font-bold text-slate-800 mt-0.5">
                                    {lahan ? lahan.jumlah_pohon : 0}
                                    <span className="text-sm font-normal text-slate-400 ml-1">Batang</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabungan Pupuk */}
                <TabunganCard
                    judul="Tabungan Pupuk"
                    Icon={Package}
                    scheme="emerald"
                    persen={persenPupuk}
                    saldo={perawatan ? formatRupiah(perawatan.saldo_pupuk_saat_ini) : formatRupiah(0)}
                    target={perawatan ? formatRupiah(perawatan.target_tabungan_pupuk) : formatRupiah(0)}
                    pesanReady="Saldo cukup! Anda bisa mengambil Pupuk di KUD Semawit."
                    pesanTunggu="Terus kumpulkan hasil panen untuk mencapai target pupuk Anda."
                />

                {/* Tabungan Racun */}
                <TabunganCard
                    judul="Tabungan Racun"
                    Icon={FlaskConical}
                    scheme="blue"
                    persen={persenRacun}
                    saldo={perawatan ? formatRupiah(perawatan.saldo_racun_saat_ini) : formatRupiah(0)}
                    target={perawatan ? formatRupiah(perawatan.target_tabungan_racun) : formatRupiah(0)}
                    pesanReady="Saldo cukup! Anda bisa mengambil Racun Rumput di KUD."
                    pesanTunggu="Terus kumpulkan hasil panen untuk mencapai target racun Anda."
                />

            </main>

            <footer className="border-t border-slate-100 bg-white py-4 text-center">
                <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} SEMAWIT &mdash; KUD</p>
            </footer>
        </div>
    );
}

const schemes = {
    emerald: {
        headerFrom: 'from-emerald-50', headerTo: 'to-green-50', headerBorder: 'border-emerald-100',
        headerIcon: 'text-emerald-600', headerText: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
        pctColor: 'text-emerald-700',
        progressFrom: 'from-emerald-500', progressTo: 'to-green-500',
        okBg: 'bg-emerald-50', okBorder: 'border-emerald-200', okIcon: 'text-emerald-600', okText: 'text-emerald-800',
        waitBg: 'bg-amber-50', waitBorder: 'border-amber-200', waitIcon: 'text-amber-600', waitText: 'text-amber-800',
    },
    blue: {
        headerFrom: 'from-blue-50', headerTo: 'to-indigo-50', headerBorder: 'border-blue-100',
        headerIcon: 'text-blue-600', headerText: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
        pctColor: 'text-blue-700',
        progressFrom: 'from-blue-500', progressTo: 'to-indigo-500',
        okBg: 'bg-emerald-50', okBorder: 'border-emerald-200', okIcon: 'text-emerald-600', okText: 'text-emerald-800',
        waitBg: 'bg-amber-50', waitBorder: 'border-amber-200', waitIcon: 'text-amber-600', waitText: 'text-amber-800',
    },
};

function TabunganCard({ judul, Icon, scheme, persen, saldo, target, pesanReady, pesanTunggu }) {
    const sudahCukup = persen >= 100;
    const s = schemes[scheme];

    return (
        <div className={`bg-white rounded-2xl border ${s.border} shadow-sm overflow-hidden`}>
            {/* Header strip */}
            <div className={`bg-gradient-to-r ${s.headerFrom} ${s.headerTo} px-5 py-3 border-b ${s.headerBorder} flex items-center gap-2`}>
                <Icon size={14} className={s.headerIcon} />
                <p className={`text-xs font-semibold ${s.headerText} uppercase tracking-wider`}>{judul}</p>
            </div>

            <div className="px-5 py-5 space-y-5">
                {/* Saldo + persen */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`${s.iconBg} rounded-2xl p-3`}>
                            <Icon size={28} className={s.iconColor} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Terkumpul</p>
                            <p className={`text-2xl font-black ${s.pctColor} mt-0.5`}>{saldo}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-5xl font-black ${s.pctColor} leading-none`}>{persen}</span>
                        <span className={`text-xl font-bold ${s.pctColor}`}>%</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div>
                    <div className="h-10 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className={`h-full bg-gradient-to-r ${s.progressFrom} ${s.progressTo} rounded-full shadow-sm transition-all duration-700 flex items-center justify-end pr-3`}
                            style={{ width: `${Math.max(persen > 0 ? 8 : 0, persen)}%` }}
                        >
                            {persen > 20 && (
                                <span className="text-white text-sm font-bold">{persen}%</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                        <span>Mulai menabung</span>
                        <span>Target: {target}</span>
                    </div>
                </div>

                {/* Status */}
                {sudahCukup ? (
                    <div className={`flex items-start gap-3 ${s.okBg} border ${s.okBorder} rounded-xl p-4`}>
                        <CheckCircle2 size={22} className={`${s.okIcon} shrink-0 mt-0.5`} />
                        <p className={`text-base font-semibold ${s.okText} leading-snug`}>{pesanReady}</p>
                    </div>
                ) : (
                    <div className={`flex items-start gap-3 ${s.waitBg} border ${s.waitBorder} rounded-xl p-4`}>
                        <Clock size={22} className={`${s.waitIcon} shrink-0 mt-0.5`} />
                        <p className={`text-base font-semibold ${s.waitText} leading-snug`}>{pesanTunggu}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

Dashboard.layout = (page) => page;
