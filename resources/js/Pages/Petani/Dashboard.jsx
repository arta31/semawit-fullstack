import React from 'react';

export default function Dashboard({ auth }) {
    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>Selamat Datang di SEMAWIT, {auth.user.name}!</h1>
            <p>Ini adalah halaman utama dasbor Petani Lansia.</p>
        </div>
    );
}