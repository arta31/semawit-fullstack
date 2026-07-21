import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

function ProgressCard({ title, icon, colorClass, barClass, data }) {
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${colorClass}`}>{icon}</span>
                    <p className="font-bold text-slate-700">{title}</p>
                </div>
                <span className="text-lg font-black text-slate-800">{data.persen}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-3">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${barClass}`}
                    style={{ width: `${Math.min(100, data.persen)}%` }}
                ></div>
            </div>

            {data.persen >= 100 && (
                <p className="text-xs font-bold text-emerald-600 mb-2">✅ Target tabungan sudah terkumpul penuh!</p>
            )}

            <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Terkumpul: <span className="font-bold text-slate-700">{formatRupiah(data.saldo)}</span></span>
                <span>Target: <span className="font-bold text-slate-700">{formatRupiah(data.target)}</span></span>
            </div>
        </div>
    );
}

export default function Tabungan({ tabungan, riwayat_transaksi, punyaLahan }) {
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    return (
        <>
            <Head title="Tabungan Saya - SEMAWIT" />

            <div className="w-full px-4 sm:px-6 lg:px-10 py-8 space-y-6 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Tabungan Saya</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Progres dana perawatan pupuk & racun menuju target sinking fund.</p>
                    </div>

                    {riwayat_transaksi.length > 0 && (
                        <a
                            href={route('petani.laporan.perawatan.pdf')}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProgressCard
                        title="Tabungan Pupuk"
                        icon="🌱"
                        colorClass="bg-emerald-100 text-emerald-700"
                        barClass="bg-emerald-500"
                        data={tabungan.pupuk}
                    />
                    <ProgressCard
                        title="Tabungan Racun"
                        icon="🧪"
                        colorClass="bg-blue-100 text-blue-700"
                        barClass="bg-blue-500"
                        data={tabungan.racun}
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">📤 Riwayat Pencairan Tabungan</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Riwayat pengambilan pupuk/racun yang dicatat oleh Admin KUD.</p>
                    </div>

                    <div className="p-6 space-y-3">
                        {riwayat_transaksi.length > 0 ? (
                            riwayat_transaksi.map((log) => (
                                <div key={log.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full mb-1 ${log.jenis_perawatan === 'pupuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {log.jenis_perawatan}
                                        </span>
                                        <p className="text-sm text-slate-700 font-medium">{log.deskripsi}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{log.tanggal}</p>
                                    </div>
                                    <span className="font-black text-red-500 text-base">- {formatRupiah(log.jumlah_pengeluaran)}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-slate-400 font-medium">Belum ada riwayat pencairan tabungan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Tabungan.layout = page => <MainLayout>{page}</MainLayout>;
