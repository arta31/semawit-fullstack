import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Navbar() {
    const { auth, ziggy } = usePage().props;

    // ✅ Pakai ziggy.location dari Inertia — lebih reliable daripada window.location
    const currentPath = ziggy?.location
        ? new URL(ziggy.location).pathname
        : (typeof window !== 'undefined' ? window.location.pathname : '');

    // ✅ Cek dengan startsWith agar sub-route juga aktif
    // Contoh: /admin/petani/create juga highlight "Data Petani"
    const isActive = (href) => {
        try {
            const linkPath = new URL(href, window.location.origin).pathname;
            // Dashboard exact match, lainnya startsWith
            if (linkPath === '/admin/dashboard') return currentPath === linkPath;
            return currentPath.startsWith(linkPath);
        } catch {
            return false;
        }
    };

    const navLinks = [
        { name: 'Dashboard',           href: route('admin.dashboard') },
        { name: 'Data Petani',         href: route('admin.petani.index') },
        { name: 'Timbangan Panen',     href: route('admin.panen.index') },
        { name: 'Pencairan Perawatan', href: route('admin.perawatan.index') },
        { name: 'Harga Referensi',     href: route('admin.harga-referensi.index') },
    ];

    return (
        <nav className="bg-[#064e3b] text-white sticky top-0 z-50 shadow-xl border-b border-emerald-700/50">
            <div className="w-full px-6 lg:px-10">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-xl shadow-lg transform rotate-3">
                                <ApplicationLogo className="h-11 w-11 object-contain" />
                            </div>
                            <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-[0.2em]">Panel KUD</p>
                        </Link>
                    </div>

                    {/* Navigasi tengah */}
                    <div className="hidden md:flex items-center bg-black/20 rounded-full p-1.5 border border-white/10">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                        active
                                            ? 'bg-white text-emerald-900 shadow-lg scale-105'
                                            : 'text-emerald-100 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Profil kanan */}
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block text-right">
                            <p className="text-xs font-black text-white leading-none">{auth.user.name}</p>
                            <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase">Administrator</p>
                        </div>
                        <div className="h-10 w-10 rounded-full border-2 border-emerald-400 p-0.5 shadow-inner">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.name}`}
                                className="rounded-full bg-emerald-100"
                                alt="avatar"
                            />
                        </div>
                        <Link
                            href="/logout-darurat"
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                        >
                            <svg className="w-5 h-5 text-red-400 group-hover:text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}
