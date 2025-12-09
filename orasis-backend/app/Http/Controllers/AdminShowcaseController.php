<?php

namespace App\Http\Controllers;

use App\Models\Showcase;
use Illuminate\Http\Request;

/**
 * AdminShowcaseController
 * 
 * Controller khusus untuk admin mengelola semua showcase dalam sistem.
 * Fitur moderasi termasuk approve/reject showcase dan bulk operations.
 * 
 * Hanya dapat diakses oleh user dengan role 'admin' (middleware: admin).
 * 
 * @package App\Http\Controllers
 * @author Orasis Team
 */
class AdminShowcaseController extends Controller
{
    /**
     * Menampilkan Semua Showcase untuk Admin
     * 
     * Endpoint untuk admin melihat semua showcase tanpa filter status.
     * Digunakan untuk dashboard admin untuk monitoring seluruh showcase.
     * Tidak menggunakan pagination agar admin bisa melihat overview lengkap.
     * 
     * @return \Illuminate\Http\JsonResponse
     * 
     * @endpoint GET /api/admin/showcases/all
     * @access Admin Only
     * 
     * @response 200 {
     *   "message": "List all showcases for admin",
     *   "data": [...],
     *   "total": 50
     * }
     */
    public function indexAll()
    {
        $showcases = Showcase::with(['user', 'tags', 'category'])
            ->latest()
            ->get();

        return response()->json([
            'message' => 'List all showcases for admin',
            'data' => $showcases,
            'total' => $showcases->count()
        ]);
    }

    // melihat daftar showcase yang MENUNGGU persetujuan
    public function indexPending()
    {
        $pendingShowcases = Showcase::with(['user', 'tags', 'category'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json([
            'message' => 'List pending showcases',
            'data' => $pendingShowcases
        ]);
    }

    // mengubah status showcase (approve/rejected)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $showcase = Showcase::findOrFail($id);
        $showcase->update(['status' => $request->status]);

        return response()->json([
            'message' => "Showcase status updated to {$request->status}",
            'data' => $showcase
        ]);
    }

    // bulk update status (untuk multiple showcases sekaligus)
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'showcase_ids' => 'required|array',
            'showcase_ids.*' => 'exists:showcases,id',
            'status' => 'required|in:approved,rejected'
        ]);

        $updated = Showcase::whereIn('id', $request->showcase_ids)
            ->update(['status' => $request->status]);

        return response()->json([
            'message' => "Successfully updated {$updated} showcases to {$request->status}",
            'updated_count' => $updated
        ]);
    }
}
