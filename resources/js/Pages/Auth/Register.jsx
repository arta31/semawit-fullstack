import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout'; // Ubah dari GuestLayout ke AuthLayout
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar Akun" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
                <p className="text-sm text-gray-500 mt-1.5">Bergabung dengan SEMAWIT dan mulai kelola hasil panen Anda.</p>
                <div className="mt-3 h-1 w-10 bg-emerald-500 rounded-full" />
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="name"
                        isFocused={true}
                        placeholder="Nama lengkap Anda"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="phone_number" value="Nomor WhatsApp" />
                    <TextInput
                        id="phone_number"
                        name="phone_number"
                        value={data.phone_number}
                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="tel"
                        placeholder="Masukkan Nomor WhatsApp"
                        onChange={(e) => setData('phone_number', e.target.value)}
                    />
                    <InputError message={errors.phone_number} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="email@contoh.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="••••••••"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="pt-4">
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-emerald-600 hover:bg-emerald-700 shadow-md"
                        disabled={processing}
                    >
                        Buat Akun
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="text-emerald-600 font-bold hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}

// Menghubungkan ke AuthLayout dengan panel hijau di sisi kiri
Register.layout = (page) => (
    <AuthLayout
        panelPosition="left"
        quote="Kelola kebun kini semudah genggaman tangan"
        subtitle="Daftar dan mulai catat hasil panen serta perawatan lahan sawit Anda bersama SEMAWIT."
    >
        {page}
    </AuthLayout>
);