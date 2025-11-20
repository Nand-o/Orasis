<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    // GET: Lihat daftar koleksi milik User yang login
    public function index(Request $request)
    {
        $collections = $request->user()
            ->collections()
            ->withCount('showcases')
            ->with(['showcases' => function ($q) {
                $q->limit(1);
            }])
            ->latest()
            ->get();

        return response()->json(['data' => $collections]);
    }

    // POST: Buat folder koleksi baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $collection = $request->user()->collections()->create([
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Collection created successfully',
            'data' => $collection
        ], 201);
    }

    // GET: Lihat detail isi satu koleksi
    public function show(Request $request, $id)
    {
        // Cari koleksi milik user (jika bukan milik user, otomatis 404)
        $collection = $request->user()->collections()
            ->with(['showcases' => function($q) {
                $q->with('user');
            }])
            ->findOrFail($id);

        return response()->json(['data' => $collection]);
    }

    // PUT: Ganti nama koleksi
    public function update(Request $request, $id)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $collection = $request->user()->collections()->findOrFail($id);
        $collection->update(['name' => $request->name]);

        return response()->json([
            'message' => 'Collection renamed',
            'data' => $collection
        ]);
    }

    // DELETE: Hapus folder koleksi
    public function destroy(Request $request, $id)
    {
        $collection = $request->user()->collections()->findOrFail($id);
        $collection->delete();

        return response()->json(['message' => 'Collection deleted']);
    }

    // === FITUR BOOKMARK (ADD/REMOVE SHOWCASE) ===

    // POST: Simpan showcase ke koleksi
    public function addShowcase(Request $request, $id)
    {
        $request->validate([
            'showcase_id' => 'required|exists:showcases,id'
        ]);

        $collection = $request->user()->collections()->findOrFail($id);

        // syncWithoutDetaching: Tambah data, tapi kalau sudah ada jangan diduplikat
        $collection->showcases()->syncWithoutDetaching([$request->showcase_id]);

        return response()->json(['message' => 'Showcase added to collection']);
    }

    // DELETE: Hapus showcase dari koleksi (tanpa hapus foldernya)
    public function removeShowcase(Request $request, $id, $showcaseId)
    {
        $collection = $request->user()->collections()->findOrFail($id);
        
        $collection->showcases()->detach($showcaseId);

        return response()->json(['message' => 'Showcase removed from collection']);
    }
}