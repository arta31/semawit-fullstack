import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Index({ petanis, pupukPilihan, racunPilihan, flash }) {
    // State untuk mengontrol Modal Onboarding
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Definisikan state form pendaftaran & onboarding menggunakan useForm Inertia
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        phone_number: '',
        nama_lahan: '',
        luas_lahan_hektar: '',
        jumlah_pohon: '',
        frekuensi_pemupukan_tahunan: '2', // Default 2x setahun
        lokasi_koordinat: '',
        harga_referensi_pupuk_id: '',
        harga_referensi_racun_id: '',
    });

    const formatRupiah = (angka) => {
        return "Rp " + parseInt(angka || 0).toLocaleString('id-ID');
    };

    // Buka Modal
    const handleOpenModal = () => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Tutup Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            reset();
            clearErrors();
        }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.petani.store'), {
            onSuccess: () => {
                handleCloseModal();
            }
        });
    };

    return (
        <>
            <Head title="Setup Klien (Onboarding) - SEMAWIT" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                
                {/* ALERT SUKSES DARI BACKEND */}
                {flash.success && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl text-emerald-900 shadow-sm flex items-start gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                            <span className="text-sm">🎉</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-emerald-800">Onboarding Berhasil!</h3>
                            <p className="text-xs font-medium mt-0.5 leading-relaxed text-emerald-700">{flash.success}</p>
                        </div>
                    </div>
                )}

                {flash.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-900 shadow-sm flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-xs font-bold">{flash.error}</p>
                    </div>
                )}

                {/* TABEL DAFTAR ANGGOTA PETANI (Diselaraskan dengan Desain Dashboard) */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    
                    {/* Header Tabel & Tombol Tambah */}
                    <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                👥 Daftar Anggota Petani Aktif
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">Kelola data petani, profil lahan, dan pantau saldo Sinking Fund mereka.</p>
                        </div>
                        
                        <button
                            onClick={handleOpenModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            Registrasi Petani Baru
                        </button>
                    </div>

                    {/* Isi Tabel */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/75 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-200/80">
                                    <th className="py-3 px-6 font-semibold" width="25%">Nama / Kontak</th>
                                    <th className="py-3 px-6 font-semibold" width="30%">Informasi Lahan</th>
                                    <th className="py-3 px-6 font-semibold text-right" width="45%">Status Sinking Fund (Saldo / Target)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {petanis.data.length > 0 ? (
                                    petanis.data.map((petani) => {
                                        const lahan = petani.profil_lahans?.[0] || null;
                                        const perawatan = lahan?.informasi_perawatan || null;

                                        return (
                                            <tr key={petani.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <p className="font-semibold text-slate-900">{petani.name}</p>
                                                    <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400 font-medium">
                                                        <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                        {petani.phone_number}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    {lahan ? (
                                                        <div>
                                                            <p className="font-semibold text-emerald-800 text-xs flex items-center gap-1">
                                                                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                {lahan.nama_lahan}
                                                            </p>
                                                            <div className="flex gap-2 mt-1">
                                                                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-200/60 uppercase">
                                                                    {lahan.luas_lahan_hektar} Hektar
                                                                </span>
                                                                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-200/60 uppercase">
                                                                    {lahan.jumlah_pohon} Pohon
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 text-[11px] font-bold border border-red-100">
                                                            ⚠️ Belum ada data lahan
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right whitespace-nowrap">
                                                    {perawatan ? (
                                                        <div className="inline-flex flex-col gap-1.5 text-left min-w-[240px]">
                                                            {/* Baris Pupuk */}
                                                            <div className="flex items-center justify-between bg-emerald-50/40 px-2.5 py-1 rounded-lg border border-emerald-100/60">
                                                                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">📦 Pupuk</span>
                                                                <div className="text-right text-xs">
                                                                    <span className="font-bold text-emerald-600">{formatRupiah(perawatan.saldo_pupuk_saat_ini)}</span>
                                                                    <span className="text-slate-400 mx-1">/</span>
                                                                    <span className="text-slate-400 font-medium">{formatRupiah(perawatan.target_tabungan_pupuk)}</span>
                                                                </div>
                                                            </div>
                                                            {/* Baris Racun */}
                                                            <div className="flex items-center justify-between bg-amber-50/40 px-2.5 py-1 rounded-lg border border-amber-100/60">
                                                                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">🧪 Racun</span>
                                                                <div className="text-right text-xs">
                                                                    <span className="font-bold text-amber-600">{formatRupiah(perawatan.saldo_racun_saat_ini)}</span>
                                                                    <span className="text-slate-400 mx-1">/</span>
                                                                    <span className="text-slate-400 font-medium">{formatRupiah(perawatan.target_tabungan_racun)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs italic">Sinking Fund belum diatur</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-12 text-center">
                                            <p className="text-slate-400 font-medium text-sm">Belum ada anggota petani terdaftar.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL WIZARD ONBOARDING */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>

                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-5 border-b border-slate-200/80 bg-slate-50 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                    📝 Setup Klien & Onboarding Sinking Fund
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Lengkapi data untuk mendaftarkan petani dan menghitung target tabungan otomatis.</p>
                            </div>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto bg-white">
                            <form id="onboardingForm" onSubmit={handleSubmit} className="space-y-6">
                                {/* SECTION 1 */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                                        Informasi Akun Petani
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Nama Lengkap</label>
                                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300" required placeholder="Contoh: Pak Wakijo" />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Nomor WhatsApp</label>
                                            <input type="text" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300" required placeholder="Contoh: 081234567890" />
                                            {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 2 */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                                        Profil & Spesifikasi Lahan
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Nama Lahan</label>
                                            <input type="text" value={data.nama_lahan} onChange={e => setData('nama_lahan', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300" required placeholder="Contoh: Kebun Bukit Indah" />
                                            {errors.nama_lahan && <p className="text-red-500 text-xs mt-1">{errors.nama_lahan}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Luas Lahan (Hektar)</label>
                                            <input type="number" step="0.1" value={data.luas_lahan_hektar} onChange={e => setData('luas_lahan_hektar', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm font-semibold text-emerald-700 placeholder-slate-300" required placeholder="Contoh: 2" />
                                            {errors.luas_lahan_hektar && <p className="text-red-500 text-xs mt-1">{errors.luas_lahan_hektar}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Jumlah Pohon Sawit</label>
                                            <input type="number" value={data.jumlah_pohon} onChange={e => setData('jumlah_pohon', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300" required placeholder="Contoh: 270" />
                                            {errors.jumlah_pohon && <p className="text-red-500 text-xs mt-1">{errors.jumlah_pohon}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Frekuensi Pemupukan / Tahun</label>
                                            <select value={data.frekuensi_pemupukan_tahunan} onChange={e => setData('frekuensi_pemupukan_tahunan', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm bg-white">
                                                <option value="1">1 Kali Setahun</option>
                                                <option value="2">2 Kali Setahun (Rekomendasi)</option>
                                                <option value="3">3 Kali Setahun</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Lokasi Koordinat (Opsional)</label>
                                            <input type="text" value={data.lokasi_koordinat} onChange={e => setData('lokasi_koordinat', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300" placeholder="Contoh: -0.123, 101.456" />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3 */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                                        Pilih Preferensi Pupuk
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {pupukPilihan.map((pupuk) => (
                                            <div key={pupuk.id} onClick={() => setData('harga_referensi_pupuk_id', pupuk.id)} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${data.harga_referensi_pupuk_id === pupuk.id ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                                {data.harga_referensi_pupuk_id === pupuk.id && (
                                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-0.5">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                )}
                                                <h4 className="font-bold text-slate-800 text-sm pr-6">{pupuk.nama_produk}</h4>
                                                <p className="text-xs text-emerald-700 font-semibold mt-0.5">{formatRupiah(pupuk.harga_per_satuan)} <span className="text-slate-400 font-normal text-[10px]">/ {pupuk.satuan}</span></p>
                                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{pupuk.deskripsi || 'Referensi Resmi KUD'}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.harga_referensi_pupuk_id && <p className="text-red-500 text-xs mt-1">{errors.harga_referensi_pupuk_id}</p>}
                                </div>

                                {/* SECTION 4 */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">4</span>
                                        Pilih Preferensi Racun Rumput
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {racunPilihan.map((racun) => (
                                            <div key={racun.id} onClick={() => setData('harga_referensi_racun_id', racun.id)} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${data.harga_referensi_racun_id === racun.id ? 'border-amber-500 bg-amber-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                                {data.harga_referensi_racun_id === racun.id && (
                                                    <div className="absolute top-3 right-3 bg-amber-500 text-white rounded-full p-0.5">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                )}
                                                <h4 className="font-bold text-slate-800 text-sm pr-6">{racun.nama_produk}</h4>
                                                <p className="text-xs text-amber-700 font-semibold mt-0.5">{formatRupiah(racun.harga_per_satuan)} <span className="text-slate-400 font-normal text-[10px]">/ {racun.satuan}</span></p>
                                                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{racun.deskripsi || 'Referensi Resmi KUD'}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.harga_referensi_racun_id && <p className="text-red-500 text-xs mt-1">{errors.harga_referensi_racun_id}</p>}
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-slate-200/80 bg-slate-50 shrink-0 flex gap-3">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors">
                                Batal
                            </button>
                            <button 
                                type="submit" form="onboardingForm" disabled={processing} 
                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold 
                                text-xs rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                                    {processing && (
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4">   </circle>
                                            <path className="opacity-75" fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {processing ? 'Menyimpan Data...' : 'Kunci Onboarding & Simpan Petani'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = page => <MainLayout children={page} />;