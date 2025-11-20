<?php

namespace App\Http\Controllers;

use App\Models\Showcase;
use Illuminate\Http\Request;

class ShowcaseController extends Controller
{
    // PUBLIC: Hanya tampilkan yang APPROVED
    public function index(Request $request)
    {
        $query = Showcase::with(['user', 'tags'])
            ->where('status', 'approved')
            ->latest();

        if ($category = $request->query('category')) {
            $query->whereRaw('LOWER(category) = ?', [strtolower($category)]);
        }

        return response()->json($query->paginate(10));
    }

    // USER: Upload showcase baru (Otomatis Pending)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url_website' => 'required|url',
            'image_url' => 'required|url',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id'
        ]);

        // Cek role user (jika admin maka langsung approve upload)
        $initialStatus = $request->user()->role === 'admin' ? 'approved' : 'pending';

        // Create showcase
        $showcase = $request->user()->showcases()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url_website' => $validated['url_website'],
            'image_url' => $validated['image_url'],
            'category' => $validated['category'],
            'status' => $initialStatus
        ]);

        // Attach tags
        if ($request->has('tags')) {
            $showcase->tags()->attach($request->tags);
        }

        $message = $initialStatus === 'pending'
            ? 'Karya berhasil diunggah dan sedang menunggu moderasi.'
            : 'Karya berhasil diterbitkan.';

        return response()->json(['message' => $message, 'data' => $showcase], 201);
    }

    // PUBLIC/USER: Lihat detail
    public function show($id)
    {
        $showcase = Showcase::with(['user', 'tags'])->find($id);

        if (!$showcase) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // cegah intip status pending kecuali pemilik/admin
        $user = request()->user('sanctum');
        $isOwner = $user && $user->id === $showcase->user_id;
        $isAdmin = $user && $user->role === 'admin';

        if ($showcase->status !== 'approved' && !$isOwner && !$isAdmin) {
            return response()->json(['message' => 'Showcase sedang dimoderasi.'], 403);
        }

        return response()->json(['data' => $showcase]);
    }

    // USER: Update showcase sendiri
    public function update(Request $request, $id)
    {
        $showcase = Showcase::findOrFail($id);

        // validasi
        if ($request->user()->id !== $showcase->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string',
            'tags' => 'nullable|array'
        ]);

        $showcase->update($validated);

        // sync tag
        if ($request->has('tags')) {
            $showcase->tags()->sync($request->tags);
        }

        // kembalikan status ke pending jika diedit user biasa
        if (!$request->user()->isAdmin()) {
            $showcase->update(['status' => 'pending']);
        }

        return response()->json(['message' => 'Showcase updated', 'data' => $showcase]);
    }

    // USER: Hapus showcase sendiri
    public function destroy(Request $request, $id)
    {
        $showcase = Showcase::findOrFail($id);

        // validasi
        if ($request->user()->id !== $showcase->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $showcase->delete();
        return response()->json(['message' => 'Showcase deleted'], 200);
    }
}