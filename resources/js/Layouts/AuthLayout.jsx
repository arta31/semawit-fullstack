import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-green-600" />
                    </Link>
                </div>
                
                <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
                    {children}
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} SEMAWIT - Sistem Manajemen Panen
                </div>
            </div>
        </div>
    );
}