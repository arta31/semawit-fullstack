<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 4-6: authenticate() -> User (jika Kredensial tidak cocok, melempar ValidationException -> 11: pesan error login)
        $request->authenticate();

        // 7: sesion() - regenerasi session setelah kredensial cocok
        $request->session()->regenerate();

        // 8: Cek role()
        $user = Auth::user();

        if ($user->role === 'admin_kud') {
            // 9: Tampil halaman dashboard Admin KUD
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        if ($user->role === 'petani_lansia') {
            // 10: Tampil halaman dashboard Petani Mandiri
            return redirect()->intended(route('petani.dashboard', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
