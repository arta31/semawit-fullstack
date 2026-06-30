import React from 'react';
import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

const fiturList = [
    {
        title: 'Pencatatan Panen',
        desc: 'Catat berat bersih hasil panen tiap petani secara digital, rapi, dan mudah ditelusuri kapan saja.',
    },
    {
        title: 'Tabungan Pupuk & Racun',
        desc: 'Pantau saldo tabungan pupuk dan racun setiap petani secara transparan dan akurat.',
    },
    {
        title: 'Harga Referensi',
        desc: 'Kelola dan informasikan harga referensi pupuk serta racun terbaru untuk seluruh anggota KUD.',
    },
    {
        title: 'Riwayat Perawatan Lahan',
        desc: 'Rekam jejak perawatan dan pengeluaran lahan tersimpan rapi dan siap dijadikan laporan.',
    },
];

const langkahList = [
    {
        no: '1',
        title: 'Daftar Akun',
        desc: 'Petani atau Admin KUD mendaftarkan akun untuk mulai menggunakan SEMAWIT.',
    },
    {
        no: '2',
        title: 'Input Data Lahan',
        desc: 'Masukkan data lahan, hasil panen, dan perawatan kebun kelapa sawit Anda.',
    },
    {
        no: '3',
        title: 'Pantau & Laporkan',
        desc: 'Lihat ringkasan tabungan, panen, dan laporan perawatan lahan secara real-time.',
    },
];

const faqList = [
    {
        q: 'Apakah aplikasi SEMAWIT berbayar?',
        a: 'SEMAWIT disediakan untuk anggota Koperasi Unit Desa (KUD) tanpa biaya tambahan bagi petani.',
    },
    {
        q: 'Bagaimana cara mendaftar sebagai petani?',
        a: 'Klik tombol "Daftar Petani" pada halaman ini, lengkapi data diri dan data lahan kebun sawit Anda.',
    },
    {
        q: 'Apakah data tabungan pupuk dan racun saya aman?',
        a: 'Seluruh data tersimpan terpusat dan hanya dapat diakses oleh Anda dan Admin KUD yang berwenang.',
    },
];

export default function Welcome({ auth, canLogin, canRegister }) {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-emerald-500 selection:text-white">
            <Head title="Selamat Datang" />

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 lg:px-12 bg-white shadow-sm sticky top-0 z-20">
                <div className="flex items-center">
                    <ApplicationLogo className="h-12 w-auto object-contain" />
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
                    <a href="#tentang" className="hover:text-emerald-600 transition">Tentang Kami</a>
                    <a href="#fitur" className="hover:text-emerald-600 transition">Fitur Utama</a>
                    <a href="#faq" className="hover:text-emerald-600 transition">FAQ</a>
                </div>

                <div className="flex gap-3">
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="rounded-full px-5 py-2 bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 transition"
                        >
                            Ke Dashboard
                        </Link>
                    ) : (
                        <>
                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="rounded-full px-5 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition"
                                >
                                    Masuk
                                </Link>
                            )}
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="rounded-full px-5 py-2 bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 transition"
                                >
                                    Daftar Sekarang
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
                <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center relative">
                    <div>
                        <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 mb-5">
                            Solusi Digital Petani Sawit
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                            Kelola Panen Sawit Lebih{' '}
                            <span className="text-emerald-600">Mudah &amp; Tertata</span>
                        </h1>
                        <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
                            SEMAWIT adalah Sistem Manajemen Hasil Panen dan Perawatan Lahan Perkebunan
                            Kelapa Sawit yang membantu petani serta Koperasi Unit Desa mencatat panen,
                            tabungan pupuk &amp; racun, hingga riwayat perawatan lahan dalam satu platform.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
                                >
                                    Daftar Petani
                                </Link>
                            )}
                            <a
                                href="#fitur"
                                className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition"
                            >
                                Lihat Fitur
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-10">
                            <div>
                                <p className="text-2xl font-extrabold text-gray-900">500+</p>
                                <p className="text-sm text-gray-500">Petani Terdaftar</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-gray-900">10k+</p>
                                <p className="text-sm text-gray-500">Data Panen Tercatat</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-gray-900">100%</p>
                                <p className="text-sm text-gray-500">Laporan Akurat</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-green-800 p-10 shadow-2xl flex flex-col items-center justify-center aspect-square">
                            <div className="bg-white rounded-3xl p-5 shadow-lg">
                                <ApplicationLogo className="w-28 h-28 object-contain" />
                            </div>
                            <p className="mt-6 text-white font-bold text-lg text-center">
                                Kebun Sawit Terkelola,
                                <br />
                                Petani Sejahtera
                            </p>
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100">
                            <p className="text-xs text-gray-500">Saldo Tabungan</p>
                            <p className="text-lg font-extrabold text-emerald-600">Terpantau Real-time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tentang Kami */}
            <section id="tentang" className="py-20 px-6 lg:px-12">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Apa itu SEMAWIT?</h2>
                    <p className="mt-6 text-gray-600 leading-8">
                        SEMAWIT (Sistem Manajemen Hasil Panen terhadap Perawatan Lahan Perkebunan Kelapa
                        Sawit) adalah platform digital yang dirancang khusus untuk membantu petani sawit,
                        termasuk petani lansia, dan Koperasi Unit Desa (KUD) dalam mencatat hasil panen,
                        mengelola tabungan pupuk &amp; racun, serta memantau perawatan lahan secara mudah
                        dan transparan.
                    </p>
                    <p className="mt-4 text-gray-600 leading-8">
                        Misi kami sederhana: <span className="font-semibold text-emerald-700">mendigitalkan pencatatan kebun, menyejahterakan petani.</span>{' '}
                        Dengan sistem yang mudah digunakan, kami percaya produktivitas dan kesejahteraan
                        petani sawit Indonesia bisa meningkat lebih jauh.
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-3xl font-extrabold text-emerald-600">500+</p>
                            <p className="text-sm text-gray-500 mt-1">Anggota KUD</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-emerald-600">10k+</p>
                            <p className="text-sm text-gray-500 mt-1">Total Panen Tercatat</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-emerald-600">100%</p>
                            <p className="text-sm text-gray-500 mt-1">Akurasi Data</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fitur Unggulan */}
            <section id="fitur" className="py-20 px-6 lg:px-12 bg-gray-50">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900">Fitur Aplikasi Unggulan</h2>
                    <p className="mt-3 text-center text-gray-500">
                        Semua kebutuhan pencatatan panen dan perawatan lahan sawit Anda dalam satu aplikasi.
                    </p>

                    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {fiturList.map((fitur) => (
                            <div
                                key={fitur.title}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                    <div className="w-5 h-5 rounded bg-emerald-600"></div>
                                </div>
                                <h3 className="font-bold text-gray-900">{fitur.title}</h3>
                                <p className="mt-2 text-sm text-gray-500 leading-6">{fitur.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mulai dalam 3 Langkah */}
            <section className="py-20 px-6 lg:px-12">
                <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-emerald-800 to-green-900 px-8 py-16 text-center">
                    <h2 className="text-3xl font-extrabold text-white">Mulai dalam 3 Langkah</h2>
                    <p className="mt-3 text-emerald-100">
                        Transformasi digital kebun sawit Anda mulai dari sini, tanpa ribet.
                    </p>

                    <div className="mt-12 grid sm:grid-cols-3 gap-10">
                        {langkahList.map((langkah) => (
                            <div key={langkah.no} className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg">
                                    {langkah.no}
                                </div>
                                <h3 className="mt-5 font-bold text-white">{langkah.title}</h3>
                                <p className="mt-2 text-sm text-emerald-100 leading-6 max-w-xs">{langkah.desc}</p>
                            </div>
                        ))}
                    </div>

                    {canRegister && (
                        <Link
                            href={route('register')}
                            className="inline-block mt-12 rounded-md bg-yellow-400 px-8 py-3 text-sm font-bold text-emerald-900 shadow-md hover:bg-yellow-300 transition"
                        >
                            Mulai Pakai Sekarang
                        </Link>
                    )}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-20 px-6 lg:px-12">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
                        Pertanyaan yang Sering Diajukan
                    </h2>

                    <div className="space-y-4">
                        {faqList.map((faq) => (
                            <details
                                key={faq.q}
                                className="group rounded-xl border border-gray-200 px-5 py-4 open:bg-emerald-50 open:border-emerald-200 transition"
                            >
                                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-800 list-none">
                                    {faq.q}
                                    <span className="ml-4 text-emerald-600 transition group-open:rotate-45">+</span>
                                </summary>
                                <p className="mt-3 text-sm text-gray-600 leading-6">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-emerald-950 text-emerald-100">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 py-14 grid sm:grid-cols-3 gap-10">
                    <div>
                        <div className="bg-white rounded-xl p-1.5 inline-block">
                            <ApplicationLogo className="h-9 w-auto object-contain" />
                        </div>
                        <p className="mt-3 text-sm text-emerald-200/80 leading-6">
                            Sistem Manajemen Hasil Panen terhadap Perawatan Lahan Perkebunan Kelapa Sawit
                            untuk petani dan Koperasi Unit Desa.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white">Menu</h4>
                        <ul className="mt-3 space-y-2 text-sm text-emerald-200/80">
                            <li><a href="#tentang" className="hover:text-white transition">Tentang Kami</a></li>
                            <li><a href="#fitur" className="hover:text-white transition">Fitur</a></li>
                            <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white">Hubungi Kami</h4>
                        <ul className="mt-3 space-y-2 text-sm text-emerald-200/80">
                            <li>semawit@kud.com</li>
                            <li>Indonesia</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-emerald-900 py-6 text-center text-xs text-emerald-300/70">
                    &copy; {new Date().getFullYear()} SEMAWIT. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
