<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Aturan password default aplikasi: minimal 8 karakter, wajib ada huruf besar
        // (mixedCase mensyaratkan huruf besar & kecil), dan wajib ada karakter simbol.
        Password::defaults(function () {
            return Password::min(8)->mixedCase()->symbols();
        });

        // Definisikan Gate untuk Admin KUD
        Gate::define('access-admin-kud', function (User $user) {
            return $user->role === 'admin_kud';
        });

        // Definisikan Gate untuk Petani Lansia
        Gate::define('access-petani-lansia', function (User $user) {
            return $user->role === 'petani_lansia';
        });
    }
}