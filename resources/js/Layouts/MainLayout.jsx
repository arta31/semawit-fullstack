import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8fafc' }}>
            <Navbar />
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
