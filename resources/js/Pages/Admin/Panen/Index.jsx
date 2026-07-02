import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle2, Scale, Package, FlaskConical } from 'lucide-react';

export default function Index({ dataPanens, profilLahans, flash }) {

    const [modalTerbuka, setModalTerbuka] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        profil_lahan_id: '',
        tanggal_panen: new Date().toISOString().split('T')[0],
        berat_bersih_kg: '',
        harga_per_kg: '',
    });

    const formatRupiah = (angka) =>
        'Rp ' + parseInt(angka || 0).toLocaleString('id-ID');

    const berat     = parseFloat(data.berat_bersih_kg) || 0;
    const harga     = parseFloat(data.harga_per_kg) || 0;
    const total     = berat * harga;
    const simPupuk  = total * 0.15;
    const simRacun  = total * 0.10;
    const simBersih = total * 0.75;

    const bukaModal  = () => setModalTerbuka(true);
    const tutupModal = () => { setModalTerbuka(false); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.panen.store'), {
            onSuccess: () => { reset('berat_bersih_kg', 'harga_per_kg', 'profil_lahan_id'); setModalTerbuka(false); }
        });
    };

    return (
        <>
            <Head title="Pencatatan Panen - SEMAWIT" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* FLASH */}
                {flash?.success && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl text-emerald-900 shadow-sm flex items-start gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded-full mt-0.5">
                            <CheckCircle2 size={16} className="text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-emerald-800">Berhasil!</h3>
                            <p className="text-xs font-medium mt-0.5 leading-relaxed text-emerald-700">{flash.success}</p>
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-900 shadow-sm flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-xs font-bold">{flash.error}</p>
                    </div>
                )}

                {/* PANEL RIWAYAT */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                <Scale size={16} className="text-slate-400" /> Riwayat Pencatatan Panen
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Input hasil timbangan anggota dan lakukan pemotongan otomatis ke pos sinking fund.
                            </p>
                        </div>
                        <button
                            onClick={bukaModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95 shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Catat Panen Baru
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal / Petani</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timbangan</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bruto</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Alokasi Simpanan</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-amber-600 uppercase tracking-wider">Jatah Bersih</th>
                                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {dataPanens.data.length > 0 ? (
                                    dataPanens.data.map((panen) => (
                                        <tr key={panen.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <p className="font-semibold text-slate-900">
                                                    {new Date(panen.tanggal_panen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {panen.profil_lahan.user.name} ({panen.profil_lahan.nama_lahan})
                                                </p>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <p className="font-semibold text-slate-900">{parseInt(panen.berat_bersih_kg).toLocaleString('id-ID')} Kg</p>
                                                <p className="text-xs text-slate-400 mt-0.5">@{formatRupiah(panen.harga_per_kg)}/Kg</p>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-700 whitespace-nowrap">{formatRupiah(panen.total_pendapatan)}</td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="inline-flex flex-col gap-1.5 text-left">
                                                    <div className="flex items-center justify-between bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                                                            <Package size={11} /> Pupuk
                                                        </span>
                                                        <span className="text-xs font-bold text-emerald-600 ml-3">{formatRupiah(panen.nominal_pupuk)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                                                        <span className="flex items-center gap-1 text-xs font-semibold text-blue-800 uppercase tracking-wider">
                                                            <FlaskConical size={11} /> Racun
                                                        </span>
                                                        <span className="text-xs font-bold text-blue-600 ml-3">{formatRupiah(panen.nominal_racun)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="font-bold text-amber-600 text-sm">{formatRupiah(panen.nominal_rumah_tangga)}</span>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <a
                                                    href={route('admin.laporan.panen.pdf', panen.profil_lahan_id)}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs border border-slate-200/60 transition-colors"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                    </svg>
                                                    Cetak Struk
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center">
                                            <p className="text-slate-400 font-medium text-sm">Belum ada riwayat pencatatan panen.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {modalTerbuka && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={tutupModal} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh]">

                        <div className="flex justify-between items-center p-5 border-b border-slate-200/80 bg-slate-50 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    <Scale size={16} className="text-slate-500" /> Catat Hasil Panen Baru
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Isi data timbangan untuk memproses pemotongan sinking fund otomatis.</p>
                            </div>
                            <button onClick={tutupModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto bg-white">
                            <form id="panenForm" onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                                        Pilih Lahan Anggota Petani
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Petani &amp; Lahan</label>
                                        <select value={data.profil_lahan_id} onChange={e => setData('profil_lahan_id', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm bg-white" required>
                                            <option value="">— Pilih Petani &amp; Lahannya —</option>
                                            {profilLahans.map((lahan) => (
                                                <option key={lahan.id} value={lahan.id}>{lahan.user.name} — {lahan.nama_lahan} ({lahan.luas_lahan_hektar} Ha)</option>
                                            ))}
                                        </select>
                                        {errors.profil_lahan_id && <p className="text-red-500 text-xs mt-1">{errors.profil_lahan_id}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                        <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                                        Data Timbangan
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tanggal Timbang / Panen</label>
                                        <input type="date" value={data.tanggal_panen} onChange={e => setData('tanggal_panen', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm" required />
                                        {errors.tanggal_panen && <p className="text-red-500 text-xs mt-1">{errors.tanggal_panen}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Berat Bersih (Kg)</label>
                                            <input type="number" value={data.berat_bersih_kg} onChange={e => setData('berat_bersih_kg', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm font-semibold text-emerald-700 placeholder-slate-300" placeholder="Contoh: 1500" required />
                                            {errors.berat_bersih_kg && <p className="text-red-500 text-xs mt-1">{errors.berat_bersih_kg}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Harga / Kg (Rp)</label>
                                            <input type="number" value={data.harga_per_kg} onChange={e => setData('harga_per_kg', e.target.value)} className="block w-full rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm shadow-sm font-semibold text-emerald-700 placeholder-slate-300" placeholder="Contoh: 2500" required />
                                            {errors.harga_per_kg && <p className="text-red-500 text-xs mt-1">{errors.harga_per_kg}</p>}
                                        </div>
                                    </div>
                                </div>

                                {total > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                            <span className="bg-emerald-50 text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                                            Simulasi Auto-Splitting (Real-time)
                                        </h4>
                                        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                                            <p className="text-xs text-slate-500 mb-1">Pendapatan kotor</p>
                                            <p className="text-xl font-bold text-slate-900 mb-3">{formatRupiah(total)}</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Pupuk (15%)</p>
                                                    <p className="text-sm font-bold text-emerald-600 mt-0.5">{formatRupiah(simPupuk)}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Racun (10%)</p>
                                                    <p className="text-sm font-bold text-blue-600 mt-0.5">{formatRupiah(simRacun)}</p>
                                                </div>
                                                <div className="bg-emerald-600 rounded-xl p-3 shadow-sm">
                                                    <p className="text-[10px] text-emerald-200 font-semibold uppercase">Sisa Bersih</p>
                                                    <p className="text-sm font-bold text-white mt-0.5">{formatRupiah(simBersih)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="p-5 border-t border-slate-200/80 bg-slate-50 shrink-0 flex gap-3">
                            <button type="button" onClick={tutupModal} className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-colors">Batal</button>
                            <button type="submit" form="panenForm" disabled={processing} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                                {processing && (
                                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {processing ? 'Menyimpan Data...' : 'Simpan Panen & Potong Otomatis'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = page => <MainLayout children={page} />;
