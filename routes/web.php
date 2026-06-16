<?php

use App\Http\Controllers\PanenController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\HargaReferensiController;
use App\Http\Controllers\AdminPetaniController;
use App\Http\Controllers\LahanPerawatanController;


// Halaman Awal
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Pengarah Rute Otomatis setelah Login / Registrasi
Route::get('/dashboard', function () {
    $user = Auth::user();

    if ($user && $user->role === 'admin_kud') {
        return redirect()->route('admin.dashboard');
    } elseif ($user && $user->role === 'petani_lansia') {
        return redirect()->route('petani.dashboard');
    }

    abort(403, 'Peran pengguna tidak dikenal atau Anda belum masuk.');
})->middleware(['auth', 'verified'])->name('dashboard');

// Grup Rute dengan Autentikasi
Route::middleware(['auth', 'verified'])->group(function () {

    // Rute Khusus Admin KUD
    // RUANG LINGKUP: ADMIN KUD (Menggunakan middleware role:admin_kud)
    Route::middleware(['role:admin_kud'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        // Pengelolaan Panen
        Route::get('/panen', [PanenController::class, 'index'])->name('panen.index');
        Route::post('/panen', [PanenController::class, 'store'])->name('panen.store');
        Route::get('/laporan/panen/{profil_lahan_id}', [LaporanController::class, 'exportLahanPdf'])->name('laporan.panen.pdf');

        // BARU: Pengelolaan Harga Referensi Pupuk & Racun
        Route::get('/harga-referensi', [HargaReferensiController::class, 'index'])->name('harga-referensi.index');
        Route::post('/harga-referensi', [HargaReferensiController::class, 'store'])->name('harga-referensi.store');
        Route::post('/harga-referensi/{id}', [HargaReferensiController::class, 'update'])->name('harga-referensi.update'); // Menggunakan POST karena membawa data File Upload di form Inertia
        Route::delete('/harga-referensi/{id}', [HargaReferensiController::class, 'destroy'])->name('harga-referensi.destroy');
        // BARU: Pengelolaan Petani Anggota (Setup Klien & Wizard)
        Route::get('/petani', [AdminPetaniController::class, 'index'])->name('petani.index');
        Route::post('/petani', [AdminPetaniController::class, 'store'])->name('petani.store');

        // BARU: Pengeluaran Belanja Sinking Fund (Cair / Potong Saldo)
        Route::get('/perawatan', [LahanPerawatanController::class, 'index'])->name('perawatan.index');
        Route::post('/perawatan', [LahanPerawatanController::class, 'store'])->name('perawatan.store');
    });

    // Rute Khusus Petani Lansia
    Route::middleware(['role:petani_lansia'])->prefix('petani')->name('petani.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Petani/Dashboard');
        })->name('dashboard');

        Route::get('/tabungan', function () {
            return Inertia::render('Petani/Tabungan');
        })->name('tabungan');
    });

    // Rute Profil Akun
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rute Logout Darurat khusus untuk dicoba langsung dari URL Browser
Route::get('/logout-darurat', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
});
require __DIR__ . '/auth.php';
