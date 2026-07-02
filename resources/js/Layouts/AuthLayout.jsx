import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, Leaf, BarChart2, Droplets } from 'lucide-react';

function WaveDivider({ flip }) {
    return (
        <svg
            className={`hidden lg:block absolute top-0 z-10 h-full w-16 text-emerald-950 ${
                flip ? 'left-0 -translate-x-1/2 scale-x-[-1]' : 'right-0 translate-x-1/2'
            }`}
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M100,0 C30,100 170,200 100,300 C30,400 170,500 100,600 C30,700 170,750 100,800 L0,800 L0,0 Z" />
        </svg>
    );
}

function GreenPanel({ quote, subtitle, flip }) {
    return (
        <div className="relative h-56 lg:h-full overflow-hidden bg-emerald-950 flex flex-col justify-between p-8 lg:p-10">
            {/* Layered gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />

            {/* Decorative blobs */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-teal-600/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-400/10 rounded-full blur-2xl" />

            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage:'radial-gradient(#fff 1px, transparent 1px)', backgroundSize:'20px 20px'}} />

            {/* Decorative icons */}
            <div className="absolute top-16 right-10 opacity-10">
                <BarChart2 size={80} className="text-white" />
            </div>
            <div className="absolute bottom-20 right-16 opacity-10">
                <Droplets size={56} className="text-white" />
            </div>

            <WaveDivider flip={flip} />

            {/* Back button */}
            <Link
                href="/"
                className="relative z-20 flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors backdrop-blur-sm border border-white/10"
                aria-label="Kembali ke beranda"
            >
                <ChevronLeft size={14} />
                Beranda
            </Link>

            {/* Quote */}
            <div className="relative z-20 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center">
                        <Leaf size={16} className="text-emerald-900" />
                    </div>
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">SEMAWIT</span>
                </div>
                <p className="text-xl lg:text-2xl font-extrabold text-white leading-snug">
                    &ldquo;{quote}&rdquo;
                </p>
                {subtitle && (
                    <p className="text-sm text-emerald-200/70 leading-6 max-w-xs">{subtitle}</p>
                )}
            </div>

            {/* Copyright */}
            <p className="relative z-20 text-xs text-emerald-200/40 tracking-wide">
                &copy; {new Date().getFullYear()} SEMAWIT &middot; semawit@kud.com
            </p>
        </div>
    );
}

export default function AuthLayout({ children, quote, subtitle, panelPosition = 'left' }) {
    const panel = (
        <GreenPanel quote={quote} subtitle={subtitle} flip={panelPosition === 'right'} />
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50/30 to-slate-100 px-4 py-10">
            {/* Subtle blobs on page background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-5xl rounded-3xl shadow-2xl shadow-emerald-900/20 overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-2 lg:min-h-[640px]">
                {panelPosition === 'left' && panel}

                <div className="flex items-center justify-center p-8 sm:p-12 bg-white">
                    <div className="w-full max-w-sm">{children}</div>
                </div>

                {panelPosition === 'right' && panel}
            </div>
        </div>
    );
}
