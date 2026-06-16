import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, profilLahans }) {
    // Ambil data lahan pertama milik petani (karena petani lansia rata-rata hanya mengelola 1 lahan utama)
    const lahan = auth.user.profil_lahans?.[0] || profilLahans?.[0] || null;
    const perawatan = lahan?.informasi_perawatan || null;

    // Kalkulasi persentase tabungan berjalan untuk progress bar tebal
    const hitungPersentase = (saatIni, target) => {
        if (!target || target == 0) return 0;
        const hasil = (parseFloat(saatIni) / parseFloat(target)) * 100;
        return Math.min(Math.round(hasil), 100); // Batasi maksimal 100%
    };

    const persenPupuk = perawatan ? hitungPersentase(perawatan.saldo_pupuk_saat_ini, perawatan.target_tabungan_pupuk) : 0;
    const persenRacun = perawatan ? hitungPersentase(perawatan.saldo_racun_saat_ini, perawatan.target_tabungan_racun) : 0;

    // Format mata uang rupiah yang mudah dibaca orang tua (tanpa desimal sen di belakang)
    const formatRupiah = (angka) => {
        return "Rp " + parseInt(angka || 0).toLocaleString('id-ID');
    };

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900 font-sans pb-12">
            <Head title="Tabunganku - SEMAWIT" />

            {/* HEADER ATAS: Font Besar, Kontras Tinggi */}
            <header className="bg-emerald-800 text-white py-6 px-6 shadow-md border-b-4 border-amber-600">
                <div className="max-w-xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-lg font-bold text-emerald-200 uppercase tracking-wider">Aplikasi Semawit</p>
                        <h1 className="text-3xl font-black">Halo, {auth.user.name}!</h1>
                    </div>
                    {/* Tombol Keluar Darurat / Logout */}
                    <Link 
                        href="/logout-darurat" 
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-lg shadow border-b-4 border-amber-800 active:border-b-0"
                    >
                        KELUAR
                    </Link>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 mt-6 space-y-6">

                {/* 1. INFORMASI LAHAN UTAMA (Prinsip One Screen One Task) */}
                <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-emerald-800">
                    <p className="text-sm font-extrabold text-stone-500 uppercase">Nama Lahan Anda</p>
                    <h2 className="text-2xl font-black text-emerald-950">{lahan ? lahan.nama_lahan : 'Lahan Utama'}</h2>
                    <div className="flex justify-between mt-2 text-lg font-bold text-stone-700">
                        <span>Luas: {lahan ? parseFloat(lahan.luas_lahan_hektar) : 0} Hektar</span>
                        <span>Pohon: {lahan ? lahan.jumlah_pohon : 0} Batang</span>
                    </div>
                </div>

                {/* 2. TABUNGAN PUPUK (Progress Bar Tebal, Ikon Jelas) */}
                <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-emerald-800 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-3xl font-black text-emerald-900">📦 TABUNGAN PUPUK</h3>
                            <p className="text-lg font-bold text-stone-600 mt-1">
                                Terkumpul: <span className="text-emerald-700 font-black">{perawatan ? formatRupiah(perawatan.saldo_pupuk_saat_ini) : formatRupiah(0)}</span>
                            </p>
                        </div>
                        <span className="text-4xl font-black text-emerald-800">{persenPupuk}%</span>
                    </div>

                    {/* Progress Bar Raksasa (Mudah dilihat mata lansia) */}
                    <div className="w-full bg-stone-200 h-10 rounded-full overflow-hidden border-2 border-stone-300">
                        <div 
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-4 font-black text-white text-lg"
                            style={{ width: `${persenPupuk}%` }}
                        >
                            {persenPupuk > 15 && `${persenPupuk}%`}
                        </div>
                    </div>

                    <div className="flex justify-between text-base font-bold text-stone-500">
                        <span>Mulai Menabung</span>
                        <span>Target: {perawatan ? formatRupiah(perawatan.target_tabungan_pupuk) : formatRupiah(0)}</span>
                    </div>

                    {/* Notifikasi Status Pengambilan */}
                    {persenPupuk >= 100 ? (
                        <div className="bg-emerald-100 border-l-8 border-emerald-600 p-4 rounded-xl text-emerald-900 font-extrabold text-lg">
                            🎉 SALDO CUKUP! Anda sudah bisa mengambil Pupuk di KUD Semawit.
                        </div>
                    ) : (
                        <div className="bg-amber-50 border-l-8 border-amber-500 p-4 rounded-xl text-amber-900 font-extrabold text-base">
                            ⏳ Terus kumpulkan hasil panen untuk mencapai target pupuk Anda.
                        </div>
                    )}
                </div>

                {/* 3. TABUNGAN RACUN (Progress Bar Tebal) */}
                <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-emerald-800 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-3xl font-black text-emerald-900">🧪 TABUNGAN RACUN</h3>
                            <p className="text-lg font-bold text-stone-600 mt-1">
                                Terkumpul: <span className="text-emerald-700 font-black">{perawatan ? formatRupiah(perawatan.saldo_racun_saat_ini) : formatRupiah(0)}</span>
                            </p>
                        </div>
                        <span className="text-4xl font-black text-emerald-800">{persenRacun}%</span>
                    </div>

                    {/* Progress Bar Raksasa */}
                    <div className="w-full bg-stone-200 h-10 rounded-full overflow-hidden border-2 border-stone-300">
                        <div 
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-4 font-black text-white text-lg"
                            style={{ width: `${persenRacun}%` }}
                        >
                            {persenRacun > 15 && `${persenRacun}%`}
                        </div>
                    </div>

                    <div className="flex justify-between text-base font-bold text-stone-500">
                        <span>Mulai Menabung</span>
                        <span>Target: {perawatan ? formatRupiah(perawatan.target_tabungan_racun) : formatRupiah(0)}</span>
                    </div>

                    {/* Notifikasi Status Pengambilan */}
                    {persenRacun >= 100 ? (
                        <div className="bg-emerald-100 border-l-8 border-emerald-600 p-4 rounded-xl text-emerald-900 font-extrabold text-lg">
                            🎉 SALDO CUKUP! Anda sudah bisa mengambil Racun Rumput di KUD.
                        </div>
                    ) : (
                        <div className="bg-amber-50 border-l-8 border-amber-500 p-4 rounded-xl text-amber-900 font-extrabold text-base">
                            ⏳ Terus kumpulkan hasil panen untuk mencapai target racun Anda.
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}