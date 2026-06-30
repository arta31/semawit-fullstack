import React from 'react';
import { Link } from '@inertiajs/react';

function WaveDivider({ flip }) {
    return (
        <svg
            className={`hidden lg:block absolute top-0 z-10 h-full w-20 text-emerald-900 ${
                flip ? 'left-0 -translate-x-1/2 scale-x-[-1]' : 'right-0 translate-x-1/2'
            }`}
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M100,0 C20,100 180,200 100,300 C20,400 180,500 100,600 C20,700 180,750 100,800 L0,800 L0,0 Z" />
        </svg>
    );
}

function GreenPanel({ quote, subtitle, flip }) {
    return (
        <div className="relative h-64 lg:h-full overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 flex flex-col justify-between p-8 lg:p-10">
            {/* Tekstur dekoratif pengganti foto kebun */}
            <div className="absolute -top-10 -left-10 w-56 h-56 bg-emerald-600/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-700/30 rounded-full blur-3xl"></div>

            <WaveDivider flip={flip} />

            <Link
                href="/"
                className="relative z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition backdrop-blur-sm"
                aria-label="Kembali ke beranda"
            >
                <span aria-hidden="true">&#8249;</span>
            </Link>

            <div className="relative z-20">
                <p className="text-xl lg:text-2xl font-extrabold text-white leading-snug">
                    &ldquo;{quote}&rdquo;
                </p>
                {subtitle && (
                    <p className="mt-3 text-sm text-emerald-100/80 leading-6 max-w-xs">
                        {subtitle}
                    </p>
                )}
            </div>

            <p className="relative z-20 text-[11px] text-emerald-200/60 tracking-wide">
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
            <div className="w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-2 lg:min-h-[640px]">
                {panelPosition === 'left' && panel}

                <div className="flex items-center justify-center p-8 sm:p-12">
                    <div className="w-full max-w-sm">{children}</div>
                </div>

                {panelPosition === 'right' && panel}
            </div>
        </div>
    );
}
