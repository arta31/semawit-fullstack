import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import MainLayout from '@/Layouts/MainLayout'; // Import Layout utama
import AuthLayout from '@/Layouts/AuthLayout'; // Import Layout Auth

createInertiaApp({
    title: (title) => `${title} - SEMAWIT`,
    resolve: (name) => {
        const page = resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
        
        page.then((module) => {
            // Jika halaman ada di folder Admin atau Petani, otomatis pakai MainLayout
            if (name.startsWith('Admin/') || name.startsWith('Petani/')) {
                module.default.layout = module.default.layout || ((page) => <MainLayout children={page} />);
            } 
            // Jika halaman ada di folder Auth, pakai AuthLayout (kecuali halaman sudah set layout sendiri)
            else if (name.startsWith('Auth/')) {
                module.default.layout = module.default.layout || ((page) => <AuthLayout children={page} />);
            }
        });

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#10b981', // Emerald 500
    },
});