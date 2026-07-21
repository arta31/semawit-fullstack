import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function PetaniLayout({ children }) {
    // PERBAIKAN DI SINI: Hapus .props dan tambahkan fallback
    const { url } = usePage();
    const isActive = (path) => url ? url.startsWith(path) : false;

    return (
        <div className="min-h-screen bg-slate-200 flex justify-center font-sans">
            
            <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl flex flex-col overflow-hidden">
                
                <main className="flex-grow overflow-y-auto pb-24 custom-scrollbar">
                    {children}
                </main>

                <nav className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    
                    <Link href={route('petani.dashboard')} className={`flex flex-col items-center gap-1 ${isActive('/petani/dashboard') ? 'text-emerald-700' : 'text-slate-400 hover:text-emerald-600'}`}>
                        <div className={`p-1.5 rounded-xl ${isActive('/petani/dashboard') ? 'bg-emerald-100' : ''}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold">Beranda</span>
                    </Link>

                    <Link href={route('petani.riwayat')} className={`flex flex-col items-center gap-1 ${isActive('/petani/riwayat') ? 'text-emerald-700' : 'text-slate-400 hover:text-emerald-600'}`}>
                        <div className={`p-1.5 rounded-xl ${isActive('/petani/riwayat') ? 'bg-emerald-100' : ''}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold">Riwayat</span>
                    </Link>

                    <Link href={route('profile.edit')} className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-emerald-700' : 'text-slate-400 hover:text-emerald-600'}`}>
                        <div className={`p-1.5 rounded-xl ${isActive('/profile') ? 'bg-emerald-100' : ''}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <span className="text-[10px] font-bold">Profil</span>
                    </Link>

                </nav>
            </div>
        </div>
    );
}