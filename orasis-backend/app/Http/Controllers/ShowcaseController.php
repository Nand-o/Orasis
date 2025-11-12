<?php

namespace App\Http\Controllers;

use App\Models\Showcase;
use Illuminate\Http\Request;

class ShowcaseController extends Controller
{
    /**
     * READ: Menampilkan semua data showcase.
     * (GET /api/showcases)
     */
    public function index(Request $request)
    {
        $category = $request->query('category');

        $query = Showcase::query()->latest();

        // filter berdasar kategori
        if ($category) {
            $query->whereRaw('LOWER(category) = ?', [strtolower($category)]);
        }

        // jalankan query dengan pagination
        $showcases = $query->paginate(10);

        return response()->json($showcases);
    }

    /**
     * CREATE: Menyimpan data showcase baru.
     * (POST /api/showcases)
     */
    public function store(Request $request)
    {
        // Validasi data yang masuk
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url_website' => 'required|string|url|max:255',
            'image_url' => 'required|string|url',
            'category' => 'nullable|string',
        ]);

        // Buat showcase baru
        $showcase = Showcase::create($validated);

        return response()->json([
            'message' => 'Showcase created successfully',
            'data' => $showcase
        ], 201);
    }

    /**
     * READ: Menampilkan satu data showcase spesifik.
     * (GET /api/showcases/{id})
     */
    public function show(Showcase $showcase)
    {
        return response()->json($showcase);
    }

    /**
     * UPDATE: Memperbarui data showcase spesifik.
     * (PUT /api/showcases/{id})
     */
    public function update(Request $request, Showcase $showcase)
    {
        // Validasi data
        $validated = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'url_website' => 'required|string|url|max:255',
            'image_url' => 'sometimes|required|string|url',
            'category' => 'sometimes|nullable|string',
        ]);

        // Update data showcase
        $showcase->update($validated);

        return response()->json([
            'message' => 'Showcase updated successfully',
            'data' => $showcase
        ]);
    }

    /**
     * DELETE: Menghapus data showcase spesifik.
     * (DELETE /api/showcases/{id})
     */
    public function destroy(Showcase $showcase)
    {
        $showcase->delete();

        return response()->json(null, 204);
    }
}
