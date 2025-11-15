<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * READ: Menampilkan daftar semua pengguna
     * (GET /api/users)
     */
    public function index()
    {
        // urutkan dari user terbaru
        return response()->json(User::latest()->paginate(10));
    }

    /**
     * CREATE: Menyimpan pengguna baru (dibuat oleh Admin)
     * (POST /api/users)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    /**
     * READ: Menampilkan satu pengguna spesifik
     * (GET /api/users/{id})
     */
    public function show(User $user)
    {
        return response()->json($user);
    }

    /**
     * UPDATE: Memperbarui data pengguna (oleh Admin)
     * (PUT /api/users/{id})
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            // password tidak akan diubah jika kosong
            'password' => 'sometimes|nullable|string|min:8',
            'role' => ['sometimes', 'required', Rule::in(['admin', 'user'])],
        ]);

        // Cek jika admin mengirim password baru
        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    /**
     * DELETE: Menghapus pengguna
     * (DELETE /api/users/{id})
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }
}