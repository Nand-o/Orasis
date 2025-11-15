<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah user sudah login
        // 2. Cek apakah role user adalah 'admin'
        if (auth()->check() && auth()->user()->role === 'admin') {
            // Jika ya, izinkan request lanjut
            return $next($request);
        }

        // Jika tidak, tolak akses
        return response()->json([
            'message' => 'Forbidden: Administrator access required.'
        ], 403); // 403 Forbidden
    }
}