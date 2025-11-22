<?php

namespace App\Http\Controllers;

use App\Models\Showcase;
use Illuminate\Http\Request;

class AdminShowcaseController extends Controller
{
    // melihat SEMUA showcase untuk admin dashboard (tanpa pagination)
    public function indexAll()
    {
        $showcases = Showcase::with(['user', 'tags'])
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
        $pendingShowcases = Showcase::with(['user', 'tags'])
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
}
