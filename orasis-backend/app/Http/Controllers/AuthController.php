<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * AuthController
 * 
 * Controller untuk menangani autentikasi pengguna (registrasi, login, logout).
 * Menggunakan Laravel Sanctum untuk token-based authentication.
 * 
 * @package App\Http\Controllers
 * @author Orasis Team
 */
class AuthController extends Controller
{
    /**
     * Registrasi Pengguna Baru
     * 
     * Endpoint untuk mendaftarkan pengguna baru ke dalam sistem.
     * Validasi input dilakukan untuk memastikan data valid dan unik.
     * Password akan di-hash menggunakan bcrypt sebelum disimpan ke database.
     * 
     * @param Request $request Data registrasi (name, email, password, password_confirmation)
     * @return \Illuminate\Http\JsonResponse
     * 
     * @endpoint POST /api/register
     * @access Public
     * 
     * @bodyParam name string required Nama lengkap pengguna. Contoh: John Doe
     * @bodyParam email string required Email pengguna (harus unik). Contoh: john@example.com
     * @bodyParam password string required Password minimal 8 karakter. Contoh: password123
     * @bodyParam password_confirmation string required Konfirmasi password (harus sama dengan password)
     * 
     * @response 201 {
     *   "message": "User registered successfully",
     *   "data": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "john@example.com",
     *     "role": "user"
     *   }
     * }
     * 
     * @response 422 {
     *   "message": "Validation error",
     *   "errors": {...}
     * }
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user'
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'data' => $user
        ], 201);
    }

    /**
     * Login Pengguna
     * 
     * Endpoint untuk autentikasi pengguna yang sudah terdaftar.
     * Memverifikasi kredensial (email & password) dan menghasilkan token akses
     * menggunakan Laravel Sanctum untuk sesi yang aman.
     * 
     * @param Request $request Data login (email, password)
     * @return \Illuminate\Http\JsonResponse
     * 
     * @endpoint POST /api/login
     * @access Public
     * 
     * @bodyParam email string required Email pengguna yang terdaftar. Contoh: john@example.com
     * @bodyParam password string required Password pengguna. Contoh: password123
     * 
     * @response 200 {
     *   "message": "Login successful",
     *   "access_token": "1|xxxx...",
     *   "token_type": "Bearer",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "john@example.com",
     *     "role": "user"
     *   }
     * }
     * 
     * @response 401 {
     *   "message": "Invalid login credentials"
     * }
     */
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }


    /**
     * Logout Pengguna
     * 
     * Endpoint untuk mengeluarkan pengguna dari sesi aktif.
     * Menghapus token akses saat ini dari database sehingga token tidak dapat
     * digunakan lagi untuk autentikasi di request berikutnya.
     * 
     * @param Request $request Request yang berisi user terautentikasi
     * @return \Illuminate\Http\JsonResponse
     * 
     * @endpoint POST /api/logout
     * @access Protected (memerlukan Bearer Token)
     * 
     * @response 200 {
     *   "message": "Logged out successfully"
     * }
     */
    public function logout(Request $request)
    {
        // Menghapus token akses pengguna yang sedang aktif
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }
}
