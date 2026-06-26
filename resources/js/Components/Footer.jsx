import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} <strong>SEMAWIT</strong>. Aplikasi Manajemen Sinking Fund Petani Sawit Mandiri.
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                            HCD Based Architecture
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}