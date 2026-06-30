import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, profilLahans }) {
    const lahan = auth.user.profil_lahans?.[0] || profilLahans?.[0] || null;
    const perawatan = lahan?.informasi_perawatan || null;

    const hitungPersentase = (saatIni, target) => {
        if (!target || target == 0) return 0;
        const hasil = (parseFloat(saatIni) / parseFloat(target)) * 100;
        return Math.min(Math.round(hasil), 100);
    };

    const persenPupuk = perawatan
        ? hitungPersentase(perawatan.saldo_pupuk_saat_ini, perawatan.target_tabungan_pupuk)
        : 0;
    const persenRacun = perawatan
        ? hitungPersentase(perawatan.saldo_racun_saat_ini, perawatan.target_tabungan_racun)
        : 0;

    const formatRupiah = (angka) =>
        'Rp ' + parseInt(angka || 0).toLocaleString('id-ID');

    return (
        <div className="min-h-screen pb-12 font-sans" style={{ backgroundColor: '#f5f0e8', color: '#1a1a1a' }}>
            <Head title="Tabunganku - SEMAWIT" />

            {/* ── HEADER ─────────────────────────────────────────── */}
            <header style={{ backgroundColor: '#2d6a4f', borderBottom: '4px solid #d4a017' }}
                className="py-5 px-6 shadow-md">
                <div className="max-w-xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest"
                            style={{ color: '#95d5b2' }}>
                            Aplikasi Semawit
                        </p>
                        <h1 className="text-3xl font-bold text-white mt-1">
                            Halo, {auth.user.name}!
                        </h1>
                    </div>

                    {/* ✅ DaisyUI btn */}
                    <Link
                        href="/logout-darurat"
                        className="btn btn-warning btn-md font-bold tracking-wider border-b-4"
                        style={{ borderBottomColor: '#a07810' }}
                    >
                        KELUAR
                    </Link>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 mt-6 space-y-5">

                {/* ── 1. KARTU INFORMASI LAHAN ── */}
                {/* ✅ DaisyUI card */}
                <div className="card bg-white shadow-sm"
                    style={{ border: '1.5px solid #2d6a4f', borderRadius: '16px' }}>
                    <div className="card-body p-5">
                        <p className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: '#6b7280' }}>
                            Nama Lahan Anda
                        </p>
                        <h2 className="text-2xl font-bold mt-1"
                            style={{ color: '#1a3d2b' }}>
                            {lahan ? lahan.nama_lahan : 'Lahan Utama'}
                        </h2>
                        <div className="flex justify-between mt-3">
                            <span className="text-base font-semibold"
                                style={{ color: '#374151' }}>
                                Luas: {lahan ? parseFloat(lahan.luas_lahan_hektar) : 0} Hektar
                            </span>
                            <span className="text-base font-semibold"
                                style={{ color: '#374151' }}>
                                Pohon: {lahan ? lahan.jumlah_pohon : 0} Batang
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── 2. TABUNGAN PUPUK ── */}
                <TabunganCard
                    jenis="pupuk"
                    judul="Tabungan Pupuk"
                    ikon="📦"
                    warnaBadge="#2d6a4f"
                    warnaProgress="#2d6a4f"
                    warnaBgIcon="#d1fae5"
                    persen={persenPupuk}
                    saldo={perawatan ? formatRupiah(perawatan.saldo_pupuk_saat_ini) : formatRupiah(0)}
                    target={perawatan ? formatRupiah(perawatan.target_tabungan_pupuk) : formatRupiah(0)}
                    pesanReady="🎉 SALDO CUKUP! Anda sudah bisa mengambil Pupuk di KUD Semawit."
                    pesanTunggu="⏳ Terus kumpulkan hasil panen untuk mencapai target pupuk Anda."
                />

                {/* ── 3. TABUNGAN RACUN ── */}
                <TabunganCard
                    jenis="racun"
                    judul="Tabungan Racun"
                    ikon="🧪"
                    warnaBadge="#1d4ed8"
                    warnaProgress="#1d4ed8"
                    warnaBgIcon="#dbeafe"
                    persen={persenRacun}
                    saldo={perawatan ? formatRupiah(perawatan.saldo_racun_saat_ini) : formatRupiah(0)}
                    target={perawatan ? formatRupiah(perawatan.target_tabungan_racun) : formatRupiah(0)}
                    pesanReady="🎉 SALDO CUKUP! Anda sudah bisa mengambil Racun Rumput di KUD."
                    pesanTunggu="⏳ Terus kumpulkan hasil panen untuk mencapai target racun Anda."
                />

            </main>
        </div>
    );
}

// Halaman ini sudah punya header sendiri yang dirancang untuk petani lansia,
// jadi tidak perlu dibungkus MainLayout (Navbar admin) seperti halaman Admin/*.
Dashboard.layout = (page) => page;

/* ── KOMPONEN REUSABLE: TabunganCard ──────────────────────────── */
function TabunganCard({
    judul, ikon, warnaBadge, warnaProgress, warnaBgIcon,
    persen, saldo, target, pesanReady, pesanTunggu
}) {
    const sudahCukup = persen >= 100;

    return (
        /* ✅ DaisyUI card */
        <div className="card bg-white shadow-sm"
            style={{ border: '1.5px solid #2d6a4f', borderRadius: '16px' }}>
            <div className="card-body p-5 gap-4">

                {/* Header: ikon + judul + persentase */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {/* Ikon dalam kotak berwarna */}
                        <div className="flex items-center justify-center text-2xl rounded-xl"
                            style={{
                                width: '48px', height: '48px',
                                backgroundColor: warnaBgIcon,
                                flexShrink: 0
                            }}>
                            {ikon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold" style={{ color: '#1a3d2b' }}>
                                {judul}
                            </h3>
                            <p className="text-sm font-medium mt-0.5" style={{ color: '#6b7280' }}>
                                Terkumpul:{' '}
                                <span className="font-bold" style={{ color: '#2d6a4f' }}>
                                    {saldo}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Badge persentase besar */}
                    <span className="text-3xl font-bold" style={{ color: warnaBadge }}>
                        {persen}%
                    </span>
                </div>

                {/* Progress bar besar — mudah dilihat mata lansia */}
                {/* ✅ DaisyUI progress */}
                <div>
                    <div className="w-full rounded-full overflow-hidden"
                        style={{ height: '36px', backgroundColor: '#e5e7eb' }}>
                        <div
                            className="h-full rounded-full flex items-center justify-end transition-all duration-500"
                            style={{
                                width: `${persen}%`,
                                backgroundColor: warnaProgress,
                                paddingRight: '12px',
                                minWidth: persen > 0 ? '36px' : '0'
                            }}>
                            {persen > 15 && (
                                <span className="text-white font-bold text-base">
                                    {persen}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Label bawah progress */}
                    <div className="flex justify-between mt-2 text-sm font-medium"
                        style={{ color: '#6b7280' }}>
                        <span>Mulai menabung</span>
                        <span>Target: {target}</span>
                    </div>
                </div>

                {/* Notifikasi status — ✅ DaisyUI alert */}
                {sudahCukup ? (
                    <div className="alert"
                        style={{
                            backgroundColor: '#d1fae5',
                            borderLeft: '5px solid #2d6a4f',
                            borderRadius: '12px',
                            color: '#1a3d2b',
                            padding: '14px 16px',
                            fontSize: '15px',
                            fontWeight: '600',
                            alignItems: 'flex-start',
                            gap: '10px'
                        }}>
                        {pesanReady}
                    </div>
                ) : (
                    <div className="alert"
                        style={{
                            backgroundColor: '#fffbeb',
                            borderLeft: '5px solid #d4a017',
                            borderRadius: '12px',
                            color: '#78350f',
                            padding: '14px 16px',
                            fontSize: '15px',
                            fontWeight: '600',
                            alignItems: 'flex-start',
                            gap: '10px'
                        }}>
                        {pesanTunggu}
                    </div>
                )}

            </div>
        </div>
    );
}
