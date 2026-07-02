import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-50 rounded-lg p-1 border border-emerald-100">
                            <ApplicationLogo className="h-6 w-6 object-contain" />
                        </div>
                        <div className="leading-tight">
                            <p className="text-sm font-semibold text-slate-700">SEMAWIT</p>
                            <p className="text-xs text-slate-400">Sistem Manajemen Hasil Panen Kelapa Sawit</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} SEMAWIT &mdash; Koperasi Unit Desa
                    </p>
                </div>
            </div>
        </footer>
    );
}
