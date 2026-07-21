import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { auth, ziggy } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const currentPath = ziggy?.location
        ? new URL(ziggy.location).pathname
        : (typeof window !== 'undefined' ? window.location.pathname : '');

    const isActive = (href) => {
        try {
            const linkPath = new URL(href, window.location.origin).pathname;
            if (linkPath === '/admin/dashboard') return currentPath === linkPath;
            return currentPath.startsWith(linkPath);
        } catch {
            return false;
        }
    };

  // Cek role user yang sedang login
    const userRole = auth?.user?.role;

    // Tentukan menu berdasarkan role
    let navLinks = [];

    if (userRole === 'admin_kud') {
        navLinks = [
            { name: 'Dashboard',           href: route('admin.dashboard') },
            { name: 'Data Petani',         href: route('admin.petani.index') },
            { name: 'Data Panen',           href: route('admin.panen.index') },
            { name: 'Transaksi Produk',      href: route('admin.perawatan.index') },
            { name: 'Data Produk Perawatan', href: route('admin.harga-referensi.index') },
        ];
    } else if (userRole === 'petani_lansia') {
        navLinks = [
            { name: 'Dashboard',       href: route('petani.dashboard') },
            { name: 'Riwayat Panen',   href: route('petani.riwayat') },
            { name: 'Tabungan Saya',   href: route('petani.tabungan') },
        ];
    }
    const initials = auth.user.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'A';

    return (
        <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href={userRole === 'admin_kud' ? route('admin.dashboard') : route('petani.dashboard')} className="flex items-center gap-2.5 shrink-0">
                        <div className="bg-white rounded-lg p-1 shadow-sm">
                            <ApplicationLogo className="h-8 w-8 object-contain" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest hidden sm:block">
                            SEMAWIT
                        </span>
                    </Link>

                    {/* Nav desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                                        active
                                            ? 'bg-white/15 text-white'
                                            : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Profil kanan */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-emerald-100 ring-2 ring-emerald-600 shrink-0">
                                {initials}
                            </div>
                            <div className="hidden lg:block text-right leading-tight">
                                <p className="text-sm font-semibold text-white truncate max-w-[140px]">{auth.user.name}</p>
                                <p className="text-xs text-emerald-300">{userRole === 'admin_kud' ? 'Admin KUD' : 'Petani KUD'}</p>
                            </div>
                        </div>

                        <Link
                            href="/logout-darurat"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-200 hover:bg-red-500/20 hover:text-red-200 transition-colors border border-white/10"
                        >
                            <LogOut size={14} />
                            <span className="hidden sm:inline">Keluar</span>
                        </Link>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-1.5 rounded-lg text-emerald-200 hover:bg-white/10 transition-colors"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-emerald-800 bg-emerald-950">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-white/15 text-white'
                                            : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
