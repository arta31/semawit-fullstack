<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Periksa apakah pengguna sudah login dan memiliki peran yang sesuai
        if (!$request->user() || $request->user()->role !== $role) {
            abort(403, 'Aksi ini tidak sah. Anda tidak memiliki hak akses.');
        }

        return $next($request);
    }
}