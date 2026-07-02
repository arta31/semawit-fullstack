import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali</h2>
                <p className="text-sm text-gray-500 mt-1.5">Masuk ke akun SEMAWIT Anda untuk melanjutkan.</p>
                <div className="mt-3 h-1 w-10 bg-emerald-500 rounded-full" />
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-gray-700" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="admin@semawit.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex justify-between items-center">
                        <InputLabel htmlFor="password" value="Password" className="text-gray-700" />
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Ingat saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-200 text-sm font-semibold"
                        disabled={processing}
                    >
                        {processing ? 'Memproses...' : 'Masuk Akun'}
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="text-emerald-600 font-bold hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}

// Menghubungkan ke AuthLayout dengan panel hijau di sisi kanan
Login.layout = (page) => (
    <AuthLayout
        panelPosition="right"
        quote="Pantau panen Anda dari mana saja, kapan saja."
        subtitle="Cek saldo tabungan, riwayat panen, dan perawatan lahan secara real-time."
    >
        {page}
    </AuthLayout>
);