import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Riwayat({ riwayat, punyaLahan }) {
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    return (
        <>
            <Head title="Riwayat Panen - SEMAWIT" />

            <div className="w-full px-4 sm:px-6 lg:px-10 py-8 space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Riwayat Panen</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Seluruh catatan hasil panen dan pembagian dana otomatis Anda.</p>
                    </div>

                    {riwayat.length > 0 && (
                        <a
                            href={route('petani.laporan.panen.pdf')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Unduh Laporan (PDF)
                        </a>
                    )}
                </div>

                {!punyaLahan && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-xl text-sm font-bold">
                        Anda belum memiliki lahan terdaftar. Hubungi Admin KUD.
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {riwayat.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Tanggal</th>
                                        <th className="px-4 py-3 text-right">Berat (Kg)</th>
                                        <th className="px-4 py-3 text-right">Harga/Kg</th>
                                        <th className="px-4 py-3 text-right">Total Pendapatan</th>
                                        <th className="px-4 py-3 text-right">Pupuk</th>
                                        <th className="px-4 py-3 text-right">Racun</th>
                                        <th className="px-4 py-3 text-right">Diterima Bersih</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {riwayat.map((panen) => (
                                        <tr key={panen.id} className="hover:bg-emerald-50/40">
                                            <td className="px-4 py-3 font-semibold text-slate-700">{panen.tanggal_panen}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">{panen.berat_bersih_kg.toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">{formatRupiah(panen.harga_per_kg)}</td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-800">{formatRupiah(panen.total_pendapatan)}</td>
                                            <td className="px-4 py-3 text-right text-emerald-600">{formatRupiah(panen.nominal_pupuk)}</td>
                                            <td className="px-4 py-3 text-right text-blue-600">{formatRupiah(panen.nominal_racun)}</td>
                                            <td className="px-4 py-3 text-right font-bold text-emerald-700">{formatRupiah(panen.nominal_rumah_tangga)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-sm text-slate-400 font-medium">Belum ada catatan panen. Ayo mulai catat panen pertamamu untuk mulai menabung!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Riwayat.layout = page => <MainLayout>{page}</MainLayout>;
