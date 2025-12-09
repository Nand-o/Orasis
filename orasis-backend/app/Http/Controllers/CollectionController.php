<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;
/**
 * CollectionController
 *
 * Mengelola fitur collection (bookmark) milik user.
 * Collection berfungsi sebagai folder untuk menyimpan showcase favorit.
 * Semua operasi membutuhkan autentikasi (user harus login).
 *
 * @package App\Http\Controllers
 */
class CollectionController extends Controller
{
    /**
     * Menampilkan semua collection milik user yang sedang login.
     *
     * Endpoint: GET /api/collections
     * Access: Authenticated
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $collections = $request->user()
            ->collections()
            ->withCount('showcases')
            ->with(['showcases' => function($q) {
                $q->with(['user', 'category']);
            }])
            ->latest()
            ->get();

        return response()->json(['data' => $collections]);
    }

    /**
     * Membuat collection baru untuk user.
     *
     * Endpoint: POST /api/collections
     * Body: { name: string }
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * Menampilkan detail satu collection beserta showcases di dalamnya.
     *
     * Endpoint: GET /api/collections/{id}
     * Access: Owner (user yang sama)
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        // Cari koleksi milik user (jika bukan milik user, otomatis 404)
        $collection = $request->user()->collections()
            ->with(['showcases' => function($q) {
                $q->with(['user', 'category']);
            }])
            ->findOrFail($id);

        return response()->json(['data' => $collection]);
    }

    /**
     * Mengubah nama collection milik user.
     *
     * Endpoint: PUT /api/collections/{id}
     * Body: { name: string }
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $request->validate(['name' => 'required|string|max:255']);

        $collection = $request->user()->collections()->findOrFail($id);
        $collection->update(['name' => $request->name]);

        return response()->json([
            'message' => 'Collection updated successfully',
            'data' => $collection
        ]);
    }

    /**
     * Menghapus collection milik user.
     *
     * Endpoint: DELETE /api/collections/{id}
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $collection = $request->user()->collections()->findOrFail($id);
        $collection->delete();

        return response()->json(['message' => 'Collection deleted successfully']);
    }

    // === FITUR BOOKMARK (ADD/REMOVE SHOWCASE) ===

    /**
     * Menambahkan showcase ke dalam collection (bookmark).
     *
     * Endpoint: POST /api/collections/{id}/showcases
     * Body: { showcase_id: number }
     *
     * @param Request $request
     * @param int $id Collection ID
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * Menghapus showcase dari collection (unbookmark).
     *
     * Endpoint: DELETE /api/collections/{collectionId}/showcases/{showcaseId}
     *
     * @param Request $request
     * @param int $id Collection ID
     * @param int $showcaseId Showcase ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeShowcase(Request $request, $id, $showcaseId)
    {
        $collection = $request->user()->collections()->findOrFail($id);
        
        $collection->showcases()->detach($showcaseId);

        return response()->json(['message' => 'Showcase removed from collection']);
    }
}
