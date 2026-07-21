import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import useDebouncedInertiaSearch from '@/Hooks/useDebouncedInertiaSearch';
import {
    CheckCircle2, Users, AlertTriangle, Package, FlaskConical,
    KeyRound, Mail, ChevronRight, ChevronLeft, Check, X, Search,
} from 'lucide-react';

export default function Index({ petanis, pupukPilihan, racunPilihan, filters, flash }) {
    const [searchParams, setSearchParam] = useDebouncedInertiaSearch('admin.petani.index', {
        search: filters?.search || '',
        status: filters?.status || '',
    });

    /* ── Modal Wizard UC02 ── */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const TOTAL_STEPS = 3;

    /* ── Modal Buat Akun UC01 ── */
    const [isAkunModalOpen, setIsAkunModalOpen] = useState(false);
    const [selectedPetani, setSelectedPetani] = useState(null);

    /* ── Modal Detail Produk (fungsi/manfaat pupuk & racun) ── */
    const [detailProduk, setDetailProduk] = useState(null); // { ...produk, jenis: 'pupuk' | 'racun' }

    /* ── Form Onboarding ── */
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '', jenis_kelamin: 'L', phone_number: '',
        nama_lahan: '', luas_lahan_hektar: '', jumlah_pohon: '',
        frekuensi_pemupukan_tahunan: '2', lokasi_koordinat: '',
        harga_referensi_pupuk_id: '', harga_referensi_racun_id: '',
    });

    /* ── Form Buat Akun ── */
    const formAkun = useForm({ email: '', password: '' });

    const formatRupiah = (angka) => 'Rp ' + parseInt(angka || 0).toLocaleString('id-ID');

    /* ── Validasi per-step sebelum lanjut ── */
    const canProceed = () => {
        if (currentStep === 1) return data.name.trim() && data.phone_number.trim();
        if (currentStep === 2) return data.nama_lahan.trim() && data.luas_lahan_hektar && data.jumlah_pohon;
        return true;
    };

    /* ── Handlers Wizard ── */
    const handleOpenModal  = () => { reset(); clearErrors(); setCurrentStep(1); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setTimeout(() => { reset(); clearErrors(); setCurrentStep(1); }, 300); };
    const handleNext = () => { if (canProceed()) setCurrentStep(s => s + 1); };
    const handlePrev = () => setCurrentStep(s => s - 1);
    const handleSubmit = (e) => { e.preventDefault(); post(route('admin.petani.store'), { onSuccess: handleCloseModal }); };

    /* ── Handlers Buat Akun ── */
    const handleOpenAkunModal  = (petani) => { setSelectedPetani(petani); formAkun.reset(); formAkun.clearErrors(); setIsAkunModalOpen(true); };
    const handleCloseAkunModal = () => { setIsAkunModalOpen(false); setTimeout(() => setSelectedPetani(null), 300); };
    const handleAkunSubmit = (e) => {
        e.preventDefault();
        formAkun.post(route('admin.petani.aktifkan-akun', selectedPetani.id), { onSuccess: handleCloseAkunModal });
    };

    const wizardSteps = [
        { num: 1, label: 'Informasi Akun' },
        { num: 2, label: 'Profil Lahan'   },
        { num: 3, label: 'Preferensi Produk' },
    ];

    return (
        <>
            <Head title="Data Anggota - SEMAWIT" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* ── Flash ── */}
                {flash.success && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl shadow-sm flex items-start gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                            <CheckCircle2 size={16} className="text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-emerald-800">Berhasil!</h3>
                            <p className="text-xs font-medium mt-0.5 leading-relaxed text-emerald-700">{flash.success}</p>
                        </div>
                    </div>
                )}
                {flash.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-center gap-3">
                        <AlertTriangle size={20} className="text-red-500 shrink-0" />
                        <p className="text-xs font-bold text-red-900">{flash.error}</p>
                    </div>
                )}

                {/* ── Tabel Data Anggota ── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                <Users size={16} className="text-slate-400" /> Data Anggota
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">Kelola data petani, profil lahan, dan pantau saldo Sinking Fund.</p>
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Tambah Akun Baru
                        </button>
                    </div>

                    {/* ── Search & Filter ── */}
                    <div className="px-6 py-4 border-b border-slate-200/80 flex flex-col sm:flex-row gap-3 bg-slate-50/50">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                defaultValue={searchParams.search}
                                onChange={e => setSearchParam('search', e.target.value)}
                                placeholder="Cari nama atau nomor WhatsApp petani..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-400"
                            />
                        </div>
                        <select
                            value={searchParams.status}
                            onChange={e => setSearchParam('status', e.target.value)}
                            className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm bg-white sm:w-56"
                        >
                            <option value="">Semua Status</option>
                            <option value="aktif">Petani Mandiri</option>
                            <option value="pasif">Petani Pasif</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider" width="25%">Nama / Kontak</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider" width="30%">Informasi Lahan</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right" width="45%">Status Sinking Fund (Saldo / Target)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {petanis.data.length > 0 ? petanis.data.map((petani) => {
                                    const lahan     = petani.profil_lahans?.[0] || null;
                                    const perawatan = lahan?.informasi_perawatan || null;
                                    return (
                                        <tr key={petani.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-900 text-base">{petani.name}</p>
                                                    {petani.akun_aktif ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-wide">
                                                            Petani Mandiri
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-wide">
                                                            Petani Pasif
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                                                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {petani.phone_number}
                                                </div>
                                                <div className="mt-2.5">
                                                    {petani.email ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                                                            <Mail size={12} /> {petani.email}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleOpenAkunModal(petani)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-[10px] font-bold border border-slate-200 hover:border-emerald-200 transition-colors"
                                                        >
                                                            <KeyRound size={12} /> Buat Akun
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                {lahan ? (
                                                    <div>
                                                        <p className="font-semibold text-emerald-800 text-xs flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {lahan.nama_lahan}
                                                        </p>
                                                        <div className="flex gap-2 mt-1.5">
                                                            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-200/60 uppercase">{lahan.luas_lahan_hektar} Ha</span>
                                                            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-200/60 uppercase">{lahan.jumlah_pohon} Pohon</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-50 text-red-600 text-[11px] font-bold border border-red-100">
                                                        <AlertTriangle size={12} /> Belum ada data lahan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right whitespace-nowrap">
                                                {perawatan ? (
                                                    <div className="inline-flex flex-col gap-1.5 text-left min-w-[240px]">
                                                        <div className="flex items-center justify-between bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                                                                <Package size={12} /> Pupuk
                                                            </span>
                                                            <div className="text-right text-xs">
                                                                <span className="font-black text-emerald-700">{formatRupiah(perawatan.saldo_pupuk_saat_ini)}</span>
                                                                <span className="text-slate-400 mx-1">/</span>
                                                                <span className="text-slate-500 font-medium">{formatRupiah(perawatan.target_tabungan_pupuk)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                                                                <FlaskConical size={12} /> Racun
                                                            </span>
                                                            <div className="text-right text-xs">
                                                                <span className="font-black text-amber-700">{formatRupiah(perawatan.saldo_racun_saat_ini)}</span>
                                                                <span className="text-slate-400 mx-1">/</span>
                                                                <span className="text-slate-500 font-medium">{formatRupiah(perawatan.target_tabungan_racun)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">Sinking Fund belum diatur</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="3" className="py-14 text-center">
                                            <Users size={32} className="mx-auto text-slate-200 mb-3" />
                                            <p className="text-slate-500 font-medium text-sm">Belum ada anggota petani terdaftar.</p>
                                            <p className="text-slate-400 text-xs mt-1">Klik "Tambah Akun Baru" untuk memulai onboarding.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════
                MODAL BUAT AKUN (UC01)
            ════════════════════════════════════════ */}
            {isAkunModalOpen && selectedPetani && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseAkunModal} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <KeyRound size={18} className="text-emerald-600" /> Buat Akun SEMAWIT
                            </h3>
                            <button onClick={handleCloseAkunModal} className="text-slate-400 hover:text-red-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-4">
                                Buatkan email dan password untuk <strong>{selectedPetani.name}</strong> agar bisa login ke aplikasi SEMAWIT.
                            </p>
                            <form id="akunForm" onSubmit={handleAkunSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alamat Email</label>
                                    <input
                                        type="email"
                                        value={formAkun.data.email}
                                        onChange={e => formAkun.setData('email', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        required
                                        placeholder="contoh: petani@semawit.com"
                                    />
                                    {formAkun.errors.email && <p className="text-red-500 text-xs mt-1">{formAkun.errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                                    <input
                                        type="text"
                                        value={formAkun.data.password}
                                        onChange={e => formAkun.setData('password', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                                        required
                                        placeholder="Contoh: Sawit#2024"
                                        minLength="8"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Minimal 8 karakter, wajib ada huruf besar dan simbol (misal: ! @ # $).</p>
                                    {formAkun.errors.password && <p className="text-red-500 text-xs mt-1">{formAkun.errors.password}</p>}
                                </div>
                            </form>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
<<<<<<< HEAD
                            <button type="button" onClick={handleCloseAkunModal}
                                className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl text-sm border border-slate-200">
                                Batal
                            </button>
                            <button type="submit" form="akunForm" disabled={formAkun.processing}
                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm disabled:opacity-70">
                                {formAkun.processing ? 'Menyimpan...' : 'Buat Akun'}
=======
                            {/* <button type="button" onClick={handleCloseAkunModal} className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl text-sm border border-slate-200">Batal</button> */}
                            <button type="submit" form="akunForm" disabled={formAkun.processing} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm">
                                {formAkun.processing ? 'Menyimpan...' : 'Aktifkan Akun'}
>>>>>>> fitur-tambah-panen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
                MODAL ONBOARDING WIZARD (UC02)
            ════════════════════════════════════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200/80 bg-slate-50 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Onboarding Petani Baru</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Langkah {currentStep} dari {TOTAL_STEPS}</p>
                            </div>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Step Indicator */}
                        <div className="px-6 py-4 border-b border-slate-100 bg-white shrink-0">
                            <div className="flex items-center">
                                {wizardSteps.map((step, i) => (
                                    <React.Fragment key={step.num}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                currentStep > step.num  ? 'bg-emerald-500 text-white' :
                                                currentStep === step.num ? 'bg-emerald-600 text-white ring-2 ring-emerald-100' :
                                                                           'bg-slate-100 text-slate-400'
                                            }`}>
                                                {currentStep > step.num ? <Check size={13} /> : step.num}
                                            </div>
                                            <span className={`text-xs font-semibold hidden sm:block ${
                                                currentStep === step.num ? 'text-emerald-700' :
                                                currentStep > step.num  ? 'text-emerald-500' :
                                                                           'text-slate-400'
                                            }`}>{step.label}</span>
                                        </div>
                                        {i < wizardSteps.length - 1 && (
                                            <div className={`flex-1 h-0.5 mx-3 transition-colors ${currentStep > step.num ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="onboardingForm" onSubmit={handleSubmit}>

                                {/* ── STEP 1: Informasi Akun ── */}
                                {currentStep === 1 && (
                                    <div className="space-y-5">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">Informasi Akun Petani</h4>
                                            <p className="text-xs text-slate-500 mt-1">Masukkan nama lengkap dan nomor WhatsApp petani yang akan didaftarkan.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                                    Nama Lengkap <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                                    placeholder="Contoh: Wakijo"
                                                />
                                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                                    Nomor WhatsApp <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.phone_number}
                                                    onChange={e => setData('phone_number', e.target.value)}
                                                    className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                                    placeholder="Contoh: 081234567890"
                                                />
                                                {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                                Jenis Kelamin <span className="text-red-400">*</span>
                                            </label>
                                            <div className="flex gap-3">
                                                <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all duration-150 ${data.jenis_kelamin === 'L' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                                    <input type="radio" name="jenis_kelamin" value="L" checked={data.jenis_kelamin === 'L'} onChange={e => setData('jenis_kelamin', e.target.value)} className="hidden" />
                                                    <span className="font-bold text-sm text-slate-800">Laki-laki</span>
                                                </label>
                                                <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer transition-all duration-150 ${data.jenis_kelamin === 'P' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                                    <input type="radio" name="jenis_kelamin" value="P" checked={data.jenis_kelamin === 'P'} onChange={e => setData('jenis_kelamin', e.target.value)} className="hidden" />
                                                    <span className="font-bold text-sm text-slate-800">Perempuan</span>
                                                </label>
                                            </div>
                                            {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 2: Profil Lahan ── */}
                                {currentStep === 2 && (
                                    <div className="space-y-5">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">Profil &amp; Spesifikasi Lahan</h4>
                                            <p className="text-xs text-slate-500 mt-1">Data lahan digunakan untuk menghitung kebutuhan pupuk dan racun secara otomatis.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                                    ALAMAT LAHAN <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.nama_lahan}
                                                    onChange={e => setData('nama_lahan', e.target.value)}
                                                    className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                                    placeholder="Contoh: Kebun Bukit Indah"
                                                />
                                                {errors.nama_lahan && <p className="text-red-500 text-xs mt-1">{errors.nama_lahan}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                                    Luas Lahan (Ha) <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.luas_lahan_hektar}
                                                    onChange={e => setData('luas_lahan_hektar', e.target.value)}
                                                    className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm font-semibold text-emerald-700 placeholder-slate-300"
                                                    placeholder="Contoh: 2"
                                                />
                                                {errors.luas_lahan_hektar && <p className="text-red-500 text-xs mt-1">{errors.luas_lahan_hektar}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                                    Jumlah Pohon Sawit <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.jumlah_pohon}
                                                    onChange={e => setData('jumlah_pohon', e.target.value)}
                                                    className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                                    placeholder="Contoh: 270"
                                                />
                                                {errors.jumlah_pohon && <p className="text-red-500 text-xs mt-1">{errors.jumlah_pohon}</p>}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Frekuensi Pemupukan / Tahun</label>
                                                <select
                                                    value={data.frekuensi_pemupukan_tahunan}
                                                    onChange={e => setData('frekuensi_pemupukan_tahunan', e.target.value)}
                                                    className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm bg-white"
                                                >
                                                    <option value="1">1 Kali Setahun</option>
                                                    <option value="2">2 Kali Setahun (Rekomendasi)</option>
                                                    <option value="3">3 Kali Setahun</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Lokasi Koordinat (Opsional)</label>
                                                <input
                                                    type="text"
                                                    value={data.lokasi_koordinat}
                                                    onChange={e => setData('lokasi_koordinat', e.target.value)}
                                                    className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm placeholder-slate-300"
                                                    placeholder="Contoh: -0.123, 101.456"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 3: Preferensi Produk ── */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">Preferensi Produk Perawatan</h4>
                                            <p className="text-xs text-slate-500 mt-1">Pilih jenis pupuk dan racun yang digunakan petani. Data ini dipakai untuk menghitung target tabungan otomatis.</p>
                                        </div>

                                        {/* Pupuk */}
                                        <div className="space-y-3">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                                <Package size={13} className="text-emerald-600" /> Pilih Jenis Pupuk <span className="text-red-400">*</span>
                                            </h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {pupukPilihan.map((pupuk) => (
                                                    <div
                                                        key={pupuk.id}
                                                        onClick={() => setData('harga_referensi_pupuk_id', pupuk.id)}
                                                        className={`relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all bg-white ${
                                                            data.harga_referensi_pupuk_id === pupuk.id
                                                                ? 'border-emerald-500 shadow-sm'
                                                                : 'border-slate-100 hover:border-slate-200'
                                                        }`}
                                                    >
                                                        {data.harga_referensi_pupuk_id === pupuk.id && (
                                                            <div className="absolute top-3 right-3 z-10 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                                                                <Check size={12} strokeWidth={3} />
                                                            </div>
                                                        )}

                                                        {pupuk.gambar_produk_path ? (
                                                            <img
                                                                src={`/storage/${pupuk.gambar_produk_path}`}
                                                                alt={pupuk.nama_produk}
                                                                className="w-full h-28 object-contain bg-slate-50"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-28 flex items-center justify-center bg-emerald-50 text-emerald-600">
                                                                <Package size={28} />
                                                            </div>
                                                        )}

                                                        <div className="p-3.5">
                                                            <h4 className="font-bold text-slate-800 text-sm">{pupuk.nama_produk}</h4>
                                                            <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                                                                {formatRupiah(pupuk.harga_per_satuan)}
                                                                <span className="text-slate-400 font-normal text-[10px]"> / {pupuk.satuan}</span>
                                                            </p>
                                                            <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">{pupuk.deskripsi || 'Referensi Resmi KUD'}</p>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setDetailProduk({ ...pupuk, jenis: 'pupuk' }); }}
                                                                className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-800 mt-2 transition-colors"
                                                            >
                                                                Lihat Detail <ChevronRight size={11} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.harga_referensi_pupuk_id && <p className="text-red-500 text-xs">{errors.harga_referensi_pupuk_id}</p>}
                                        </div>

                                        {/* Racun */}
                                        <div className="space-y-3">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                                <FlaskConical size={13} className="text-amber-600" /> Pilih Jenis Racun Rumput <span className="text-red-400">*</span>
                                            </h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {racunPilihan.map((racun) => (
                                                    <div
                                                        key={racun.id}
                                                        onClick={() => setData('harga_referensi_racun_id', racun.id)}
                                                        className={`relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all bg-white ${
                                                            data.harga_referensi_racun_id === racun.id
                                                                ? 'border-amber-500 shadow-sm'
                                                                : 'border-slate-100 hover:border-slate-200'
                                                        }`}
                                                    >
                                                        {data.harga_referensi_racun_id === racun.id && (
                                                            <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white rounded-full p-1 shadow-sm">
                                                                <Check size={12} strokeWidth={3} />
                                                            </div>
                                                        )}

                                                        {racun.gambar_produk_path ? (
                                                            <img
                                                                src={`/storage/${racun.gambar_produk_path}`}
                                                                alt={racun.nama_produk}
                                                                className="w-full h-28 object-contain bg-slate-50"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-28 flex items-center justify-center bg-amber-50 text-amber-600">
                                                                <FlaskConical size={28} />
                                                            </div>
                                                        )}

                                                        <div className="p-3.5">
                                                            <h4 className="font-bold text-slate-800 text-sm">{racun.nama_produk}</h4>
                                                            <p className="text-xs text-amber-700 font-semibold mt-0.5">
                                                                {formatRupiah(racun.harga_per_satuan)}
                                                                <span className="text-slate-400 font-normal text-[10px]"> / {racun.satuan}</span>
                                                            </p>
                                                            <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">{racun.deskripsi || 'Referensi Resmi KUD'}</p>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setDetailProduk({ ...racun, jenis: 'racun' }); }}
                                                                className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 hover:text-amber-800 mt-2 transition-colors"
                                                            >
                                                                Lihat Detail <ChevronRight size={11} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.harga_referensi_racun_id && <p className="text-red-500 text-xs">{errors.harga_referensi_racun_id}</p>}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Footer Navigasi */}
                        <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50 shrink-0 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <div className="flex items-center gap-2">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors"
                                    >
                                        <ChevronLeft size={14} /> Sebelumnya
                                    </button>
                                )}
                                {currentStep < TOTAL_STEPS ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!canProceed()}
                                        className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Selanjutnya <ChevronRight size={14} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        form="onboardingForm"
                                        disabled={processing || !data.harga_referensi_pupuk_id || !data.harga_referensi_racun_id}
                                        className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-70"
                                    >
                                        {processing && (
                                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        )}
                                        {processing ? 'Menyimpan Data...' : 'Kunci Onboarding & Simpan Petani'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
                MODAL DETAIL PRODUK (fungsi/manfaat pupuk & racun)
            ════════════════════════════════════════ */}
            {detailProduk && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                    onClick={() => setDetailProduk(null)}
                >
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setDetailProduk(null)}
                            className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-slate-500 hover:text-red-500 p-1.5 rounded-full shadow-sm transition-colors"
                        >
                            <X size={16} />
                        </button>

                        {detailProduk.gambar_produk_path ? (
                            <img
                                src={`/storage/${detailProduk.gambar_produk_path}`}
                                alt={detailProduk.nama_produk}
                                className="w-full h-64 object-contain bg-slate-50"
                            />
                        ) : (
                            <div className={`w-full h-52 flex items-center justify-center ${
                                detailProduk.jenis === 'pupuk' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                {detailProduk.jenis === 'pupuk' ? <Package size={48} /> : <FlaskConical size={48} />}
                            </div>
                        )}

                        <div className="p-6">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide mb-2 ${
                                detailProduk.jenis === 'pupuk'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                            }`}>
                                {detailProduk.jenis === 'pupuk' ? 'Pupuk' : 'Racun Rumput'}
                            </span>
                            <h3 className="text-lg font-black text-slate-800">{detailProduk.nama_produk}</h3>
                            <p className={`text-sm font-bold mt-1 ${detailProduk.jenis === 'pupuk' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {formatRupiah(detailProduk.harga_per_satuan)}
                                <span className="text-slate-400 font-normal text-xs"> / {detailProduk.satuan}</span>
                            </p>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fungsi &amp; Manfaat</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {detailProduk.deskripsi || 'Belum ada keterangan fungsi/manfaat untuk produk ini.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setData(detailProduk.jenis === 'pupuk' ? 'harga_referensi_pupuk_id' : 'harga_referensi_racun_id', detailProduk.id);
                                    setDetailProduk(null);
                                }}
                                className={`w-full mt-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-sm transition-colors ${
                                    detailProduk.jenis === 'pupuk'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : 'bg-amber-600 hover:bg-amber-700'
                                }`}
                            >
                                Pilih Produk Ini
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = page => <MainLayout children={page} />;