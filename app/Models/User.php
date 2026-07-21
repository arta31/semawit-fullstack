<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'jenis_kelamin',
        'email',
        'phone_number',
        'password',
        'role',
        'akun_aktif',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'akun_aktif' => 'boolean',
        ];
    }

    /**
     * Relasi ke Profil Lahan (Satu user/petani bisa memiliki banyak lahan)
     */
    public function profilLahans(): HasMany
    {
        return $this->hasMany(ProfilLahan::class);
    }
}