<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * READ: Menampilkan semua data tag.
     * (GET /api/tags)
     */
    public function index()
    {
        return response()->json(Tag::all());
    }

    /**
     * CREATE: Menyimpan data tag baru.
     * (POST /api/tags)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:tags|max:255',
        ]);

        $tag = Tag::create($validated);

        return response()->json([
            'message' => 'Tag created successfully',
            'data' => $tag
        ], 201);
    }

    /**
     * READ: Menampilkan satu data tag spesifik.
     * (GET /api/tags/{id})
     */
    public function show(Tag $tag)
    {
        return response()->json($tag);
    }

    /**
     * UPDATE: Memperbarui data tag spesifik.
     * (PUT /api/tags/{id})
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:tags,name,' . $tag->id,
        ]);

        $tag->update($validated);

        return response()->json([
            'message' => 'Tag updated successfully',
            'data' => $tag
        ]);
    }

    /**
     * DELETE: Menghapus data tag spesifik.
     * (DELETE /api/tags/{id})
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();
        return response()->json(null, 204);
    }
}