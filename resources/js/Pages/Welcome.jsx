import React from 'react';
import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Scale, Wallet, TrendingUp, ClipboardList, ChevronRight, ChevronDown, Check } from 'lucide-react';

const fiturList = [
    {
        Icon: Scale,
        title: 'Pencatatan Panen',
        desc: 'Catat berat bersih hasil panen tiap petani secara digital, rapi, dan mudah ditelusuri kapan saja.',
        color: 'emerald',
    },
    {
        Icon: Wallet,
        title: 'Tabungan Pupuk & Racun',
        desc: 'Pantau saldo tabungan pupuk dan racun setiap petani secara transparan dan akurat.',
        color: 'green',
    },
    {
        Icon: TrendingUp,
        title: 'Harga Referensi',
        desc: 'Kelola dan informasikan harga referensi pupuk serta racun terbaru untuk seluruh anggota KUD.',
        color: 'teal',
    },
    {
        Icon: ClipboardList,
        title: 'Riwayat Perawatan Lahan',
        desc: 'Rekam jejak perawatan dan pengeluaran lahan tersimpan rapi dan siap dijadikan laporan.',
        color: 'cyan',
    },
];

const fiturColors = {
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:border-emerald-300 hover:bg-emerald-50/80' },
    green:   { bg: 'bg-green-50',   icon: 'text-green-600',   border: 'border-green-100',   hover: 'hover:border-green-300 hover:bg-green-50/80' },
    teal:    { bg: 'bg-teal-50',    icon: 'text-teal-600',    border: 'border-teal-100',     hover: 'hover:border-teal-300 hover:bg-teal-50/80' },
    cyan:    { bg: 'bg-cyan-50',    icon: 'text-cyan-600',    border: 'border-cyan-100',     hover: 'hover:border-cyan-300 hover:bg-cyan-50/80' },
};

const langkahList = [
    { no: '1', title: 'Daftar Akun',     desc: 'Petani atau Admin KUD mendaftarkan akun untuk mulai menggunakan SEMAWIT.' },
    { no: '2', title: 'Input Data Lahan', desc: 'Masukkan data lahan, hasil panen, dan perawatan kebun kelapa sawit Anda.' },
    { no: '3', title: 'Pantau & Laporkan', desc: 'Lihat ringkasan tabungan, panen, dan laporan perawatan lahan secara real-time.' },
];

const faqList = [
    { q: 'Apakah aplikasi SEMAWIT berbayar?',          a: 'SEMAWIT disediakan untuk anggota Koperasi Unit Desa (KUD) tanpa biaya tambahan bagi petani.' },
    { q: 'Bagaimana cara mendaftar sebagai petani?',   a: 'Klik tombol "Daftar Petani" pada halaman ini, lengkapi data diri dan data lahan kebun sawit Anda.' },
    { q: 'Apakah data tabungan saya aman?',            a: 'Seluruh data tersimpan terpusat dan hanya dapat diakses oleh Anda dan Admin KUD yang berwenang.' },
];

export default function Welcome({ auth, canLogin, canRegister }) {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-emerald-500 selection:text-white">
            <Head title="Selamat Datang" />

            {/* ── NAVBAR ── */}
            <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-16">
                    <ApplicationLogo className="h-11 w-auto object-contain" />

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                        <a href="#tentang" className="hover:text-emerald-600 transition-colors">Tentang</a>
                        <a href="#fitur"   className="hover:text-emerald-600 transition-colors">Fitur</a>
                        <a href="#faq"     className="hover:text-emerald-600 transition-colors">FAQ</a>
                    </div>

                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full shadow-sm transition-colors">
                                Dashboard <ChevronRight size={14} />
                            </Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link href={route('login')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors rounded-full">
                                        Masuk
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link href={route('register')} className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full shadow-sm transition-colors">
                                        Daftar Sekarang
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-800">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-emerald-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-120px] left-[-60px] w-[400px] h-[400px] bg-teal-500 rounded-full blur-3xl" />
                </div>
                {/* Dot grid pattern */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '28px 28px'}} />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left copy */}
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-semibold px-4 py-1.5 mb-6 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Solusi Digital Petani Kelapa Sawit
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                            Kelola Panen Sawit<br />
                            <span className="text-yellow-400">Lebih Cerdas</span>
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-emerald-100/80 leading-relaxed max-w-lg">
                            Platform manajemen hasil panen dan perawatan lahan kelapa sawit untuk petani dan
                            Koperasi Unit Desa dalam satu sistem yang mudah digunakan.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {canRegister && (
                                <Link href={route('register')} className="flex items-center gap-2 px-7 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 text-sm font-bold rounded-full shadow-lg shadow-yellow-400/30 transition-all hover:-translate-y-0.5">
                                    Daftar Petani <ChevronRight size={16} />
                                </Link>
                            )}
                            <a href="#fitur" className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-full transition-colors backdrop-blur-sm">
                                Lihat Fitur
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 flex gap-8">
                            {[
                                { val: '500+', label: 'Petani Terdaftar' },
                                { val: '10k+', label: 'Data Panen' },
                                { val: '100%', label: 'Laporan Akurat' },
                            ].map((s) => (
                                <div key={s.label} className="flex flex-col">
                                    <span className="text-2xl font-black text-white">{s.val}</span>
                                    <span className="text-xs text-emerald-300 mt-0.5">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right visual */}
                    <div className="relative hidden lg:block">
                        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center justify-center mb-6">
                                <div className="bg-white rounded-2xl p-5 shadow-xl">
                                    <ApplicationLogo className="w-24 h-24 object-contain" />
                                </div>
                            </div>
                            {/* Mock dashboard cards */}
                            <div className="space-y-3">
                                {[
                                    { label: 'Tabungan Pupuk', val: 'Rp 1.250.000', pct: 68, color: 'bg-emerald-400' },
                                    { label: 'Tabungan Racun', val: 'Rp 840.000',   pct: 45, color: 'bg-teal-400' },
                                ].map((item) => (
                                    <div key={item.label} className="bg-white/15 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-white">{item.label}</span>
                                            <span className="text-xs font-bold text-yellow-300">{item.val}</span>
                                        </div>
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-2xl px-5 py-3 border border-gray-100">
                            <p className="text-xs text-gray-400 font-medium">Saldo Real-time</p>
                            <p className="text-base font-bold text-emerald-700 mt-0.5">Selalu Terkini</p>
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="relative h-16 overflow-hidden">
                    <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" fill="white" preserveAspectRatio="none">
                        <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" />
                    </svg>
                </div>
            </section>

            {/* ── TENTANG ── */}
            <section id="tentang" className="py-24 px-6 lg:px-12">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 uppercase tracking-wider mb-4">Tentang Kami</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Apa itu <span className="text-emerald-600">SEMAWIT</span>?</h2>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4 text-gray-600 leading-8">
                            <p>
                                <strong className="text-gray-900">SEMAWIT</strong> (Sistem Manajemen Hasil Panen terhadap Perawatan Lahan Perkebunan Kelapa Sawit)
                                adalah platform digital yang dirancang khusus untuk membantu petani sawit, termasuk petani lansia,
                                dan Koperasi Unit Desa (KUD).
                            </p>
                            <p>
                                Misi kami sederhana: <span className="font-semibold text-emerald-700">mendigitalkan pencatatan kebun, menyejahterakan petani.</span>
                            </p>
                            <ul className="space-y-2 mt-4">
                                {['Pencatatan panen yang akurat', 'Pengelolaan tabungan pupuk & racun', 'Laporan perawatan lahan digital'].map((item) => (
                                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { val: '500+', label: 'Anggota KUD',       color: 'from-emerald-500 to-green-600' },
                                { val: '10k+', label: 'Total Panen',        color: 'from-teal-500 to-emerald-600' },
                                { val: '100%', label: 'Akurasi Data',       color: 'from-green-500 to-teal-600' },
                            ].map((s) => (
                                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-center shadow-lg shadow-emerald-200`}>
                                    <p className="text-2xl font-black text-white">{s.val}</p>
                                    <p className="text-xs text-emerald-100 mt-1 font-medium">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FITUR ── */}
            <section id="fitur" className="py-24 px-6 lg:px-12 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 uppercase tracking-wider mb-4">Fitur Unggulan</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Semua yang Anda Butuhkan</h2>
                        <p className="mt-3 text-gray-500 max-w-xl mx-auto">Pencatatan panen dan perawatan lahan sawit terintegrasi dalam satu platform.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {fiturList.map((fitur) => {
                            const c = fiturColors[fitur.color];
                            return (
                                <div key={fitur.title} className={`group bg-white rounded-2xl p-6 border ${c.border} ${c.hover} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}>
                                    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5`}>
                                        <fitur.Icon size={22} className={c.icon} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{fitur.title}</h3>
                                    <p className="text-sm text-gray-500 leading-6">{fitur.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 3 LANGKAH ── */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 rounded-3xl px-8 py-16 overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />

                        <div className="relative text-center mb-14">
                            <span className="inline-block text-xs font-bold text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 uppercase tracking-wider mb-4">Cara Mulai</span>
                            <h2 className="text-3xl sm:text-4xl font-black text-white">Mulai dalam 3 Langkah</h2>
                            <p className="mt-3 text-emerald-200">Transformasi digital kebun sawit Anda mulai dari sini.</p>
                        </div>

                        <div className="relative grid sm:grid-cols-3 gap-8">
                            {/* Connector line */}
                            <div className="hidden sm:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-yellow-400/40 via-yellow-400/80 to-yellow-400/40" />

                            {langkahList.map((langkah, idx) => (
                                <div key={langkah.no} className="flex flex-col items-center text-center relative">
                                    <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl mb-5 ${
                                        idx === 0 ? 'bg-yellow-400 text-emerald-900' :
                                        idx === 1 ? 'bg-white/15 text-white border-2 border-white/30' :
                                        'bg-emerald-600 text-white border-2 border-emerald-400'
                                    }`}>
                                        {langkah.no}
                                    </div>
                                    <h3 className="font-bold text-white text-lg mb-2">{langkah.title}</h3>
                                    <p className="text-sm text-emerald-200 leading-6 max-w-[200px]">{langkah.desc}</p>
                                </div>
                            ))}
                        </div>

                        {canRegister && (
                            <div className="relative text-center mt-14">
                                <Link href={route('register')} className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 text-sm font-bold rounded-full shadow-lg shadow-yellow-400/30 transition-all hover:-translate-y-0.5">
                                    Mulai Pakai Sekarang <ChevronRight size={16} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="py-24 px-6 lg:px-12 bg-slate-50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 uppercase tracking-wider mb-4">FAQ</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Pertanyaan Umum</h2>
                    </div>

                    <div className="space-y-3">
                        {faqList.map((faq) => (
                            <details key={faq.q} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden open:border-emerald-200 open:shadow-sm transition-all">
                                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-gray-800 list-none select-none hover:text-emerald-700 transition-colors">
                                    {faq.q}
                                    <ChevronDown size={18} className="text-gray-400 group-open:text-emerald-600 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                                </summary>
                                <div className="px-6 pb-5 text-sm text-gray-600 leading-7 border-t border-gray-100 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-emerald-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid sm:grid-cols-3 gap-10">
                    <div>
                        <div className="bg-white rounded-xl p-2 inline-block shadow-sm mb-4">
                            <ApplicationLogo className="h-9 w-auto object-contain" />
                        </div>
                        <p className="text-sm text-emerald-300/70 leading-7">
                            Sistem Manajemen Hasil Panen terhadap Perawatan Lahan Perkebunan Kelapa Sawit
                            untuk petani dan Koperasi Unit Desa.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Menu</h4>
                        <ul className="space-y-2.5">
                            {[['#tentang', 'Tentang Kami'], ['#fitur', 'Fitur'], ['#faq', 'FAQ']].map(([href, label]) => (
                                <li key={href}>
                                    <a href={href} className="text-sm text-emerald-300/70 hover:text-white transition-colors flex items-center gap-1.5 group">
                                        <ChevronRight size={12} className="text-emerald-700 group-hover:text-emerald-400 transition-colors" />
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Hubungi Kami</h4>
                        <ul className="space-y-2.5 text-sm text-emerald-300/70">
                            <li>semawit@kud.com</li>
                            <li>Indonesia</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-emerald-900 py-5 text-center text-xs text-emerald-300/40">
                    &copy; {new Date().getFullYear()} SEMAWIT. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
