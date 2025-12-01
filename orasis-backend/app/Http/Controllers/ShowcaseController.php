<?php

namespace App\Http\Controllers;

use App\Models\Showcase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShowcaseController extends Controller
{
    // PUBLIC: Hanya tampilkan yang APPROVED
    public function index(Request $request)
    {
        // Get parameters
        $sort = $request->get('sort', 'newest');
        $perPage = (int) $request->get('per_page', 10); // Accept custom per_page
        
        // Validate per_page (max 100 to prevent abuse)
        $perPage = min($perPage, 100);
        
        // Start query without eager loading first
        $query = Showcase::query()->where('status', 'approved');

        // Category filter (now uses category relationship)
        if ($category = $request->get('category')) {
            $query->whereHas('category', function($q) use ($category) {
                $q->whereRaw('LOWER(name) = ?', [strtolower($category)]);
            });
        }

        // Apply sorting
        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'most_viewed':
                $query->orderBy('views_count', 'desc');
                break;
            case 'title_asc':
                $query->orderBy('title', 'asc');
                break;
            case 'title_desc':
                $query->orderBy('title', 'desc');
                break;
            default: // newest
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Get results first, then load relationships
        $results = $query->paginate($perPage);
        $results->load(['user', 'tags', 'category']);
        
        return response()->json($results);
    }

    // USER: Upload showcase baru (Otomatis Pending)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url_website' => 'required|url',
            'image_url' => 'nullable|url',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'logo_url' => 'nullable|url',
            'logo_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048', // 2MB max for logo
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id'
        ]);

        // Handle image upload
        $imageUrl = $validated['image_url'] ?? null;
        
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('showcases', $filename, 'public');
            $imageUrl = asset('storage/' . $path);
        }

        // Validate that at least one image source is provided
        if (!$imageUrl) {
            return response()->json([
                'message' => 'Either image_url or image_file must be provided'
            ], 422);
        }

        // Handle logo upload (optional)
        $logoUrl = $validated['logo_url'] ?? null;
        
        if ($request->hasFile('logo_file')) {
            $logoFile = $request->file('logo_file');
            $logoFilename = 'logo_' . time() . '_' . uniqid() . '.' . $logoFile->getClientOriginalExtension();
            $logoPath = $logoFile->storeAs('logos', $logoFilename, 'public');
            $logoUrl = asset('storage/' . $logoPath);
        }

        // Cek role user (jika admin maka langsung approve upload)
        $initialStatus = $request->user()->role === 'admin' ? 'approved' : 'pending';

        // Create showcase
        $showcase = $request->user()->showcases()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url_website' => $validated['url_website'],
            'image_url' => $imageUrl,
            'logo_url' => $logoUrl,
            'category_id' => $validated['category_id'],
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
        $showcase = Showcase::with(['user', 'tags', 'category'])->findOrFail($id);

        // cegah intip status pending kecuali pemilik/admin
        $user = request()->user('sanctum');
        $isOwner = $user && $user->id === $showcase->user_id;
        $isAdmin = $user && $user->role === 'admin';

        if ($showcase->status !== 'approved' && !$isOwner && !$isAdmin) {
            return response()->json(['message' => 'Showcase sedang dimoderasi.'], 403);
        }

        // Track view (if not owner and not admin)
        if (!$isOwner && !$isAdmin) {
            $this->trackView($showcase);
        }

        // Get similar showcases (same category, exclude current, limit 4, order by views)
        $similar = Showcase::with(['user', 'tags', 'category'])
            ->where('category_id', $showcase->category_id)
            ->where('id', '!=', $id)
            ->where('status', 'approved')
            ->orderBy('views_count', 'desc')
            ->limit(4)
            ->get();

        return response()->json([
            'data' => $showcase,
            'similar' => $similar
        ]);
    }

    /**
     * Track showcase view (prevent duplicate within 1 hour per showcase)
     */
    private function trackView($showcase)
    {
        $userId = auth('sanctum')->id();
        $ipAddress = request()->ip();
        $userAgent = request()->userAgent();
        
        // Check if this SPECIFIC showcase was already viewed in last 1 hour (prevent spam/double-calls)
        // Each showcase has independent cooldown - user can view multiple showcases
        $existingView = DB::table('showcase_views')
            ->where('showcase_id', $showcase->id) // IMPORTANT: Check for THIS showcase only
            ->where('viewed_at', '>', now()->subHour()) // 1 hour cooldown per showcase
            ->where(function($query) use ($userId, $ipAddress) {
                if ($userId) {
                    // For logged-in users, check by user_id
                    $query->where('user_id', $userId);
                } else {
                    // For guests, check by IP address
                    $query->where('ip_address', $ipAddress);
                }
            })
            ->exists();
        
        if (!$existingView) {
            // Insert view record
            DB::table('showcase_views')->insert([
                'showcase_id' => $showcase->id,
                'user_id' => $userId,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'viewed_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Increment views_count
            $showcase->increment('views_count');
        }
    }

    /**
     * Public endpoint untuk track view (dipanggil terpisah dari show)
     * Ini memungkinkan tracking view bahkan ketika data diambil dari cache
     */
    public function trackViewEndpoint($id)
    {
        $showcase = Showcase::findOrFail($id);

        // cegah intip status pending kecuali pemilik/admin
        $user = request()->user('sanctum');
        $isOwner = $user && $user->id === $showcase->user_id;
        $isAdmin = $user && $user->role === 'admin';

        if ($showcase->status !== 'approved' && !$isOwner && !$isAdmin) {
            return response()->json(['message' => 'Showcase tidak ditemukan.'], 404);
        }

        // Track view (if not owner and not admin)
        if (!$isOwner && !$isAdmin) {
            $this->trackView($showcase);
        }

        return response()->json(['message' => 'View tracked successfully'], 200);
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
            'url_website' => 'sometimes|url',
            'image_url' => 'nullable|url',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'logo_url' => 'nullable|url',
            'logo_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
            'category_id' => 'sometimes|exists:categories,id',
            'tags' => 'nullable|array'
        ]);

        // Handle image upload
        if ($request->hasFile('image_file')) {
            // Delete old image if it's stored locally
            if ($showcase->image_url && str_contains($showcase->image_url, '/storage/showcases/')) {
                $oldPath = str_replace(asset('storage/'), '', $showcase->image_url);
                \Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('showcases', $filename, 'public');
            $validated['image_url'] = asset('storage/' . $path);
        } elseif ($request->has('image_url')) {
            $validated['image_url'] = $request->image_url;
        }

        // Handle logo upload
        if ($request->hasFile('logo_file')) {
            // Delete old logo if it's stored locally
            if ($showcase->logo_url && str_contains($showcase->logo_url, '/storage/logos/')) {
                $oldLogoPath = str_replace(asset('storage/'), '', $showcase->logo_url);
                \Storage::disk('public')->delete($oldLogoPath);
            }

            $logoFile = $request->file('logo_file');
            $logoFilename = 'logo_' . time() . '_' . uniqid() . '.' . $logoFile->getClientOriginalExtension();
            $logoPath = $logoFile->storeAs('logos', $logoFilename, 'public');
            $validated['logo_url'] = asset('storage/' . $logoPath);
        } elseif ($request->has('logo_url')) {
            $validated['logo_url'] = $request->logo_url;
        }

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

    /**
     * Get trending showcases (most viewed in last 7 days)
     */
    public function trending()
    {
        $showcases = Showcase::with(['user', 'tags', 'category'])
            ->where('status', 'approved')
            ->where('created_at', '>', now()->subDays(7))
            ->orderBy('views_count', 'desc')
            ->limit(12)
            ->get();

        return response()->json(['data' => $showcases]);
    }

    /**
     * Get popular showcases (all time most viewed)
     */
    public function popular()
    {
        $showcases = Showcase::with(['user', 'tags', 'category'])
            ->where('status', 'approved')
            ->orderBy('views_count', 'desc')
            ->limit(12)
            ->get();

        return response()->json(['data' => $showcases]);
    }
}
