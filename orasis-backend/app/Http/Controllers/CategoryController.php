<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
/**
 * CategoryController
 *
 * Mengelola operasi CRUD untuk kategori showcase.
 * Semua response dan error handling dikembalikan dalam format JSON.
 *
 * @package App\Http\Controllers
 */
class CategoryController extends Controller
{
    /**
     * Menampilkan daftar kategori yang tersedia.
     *
     * Endpoint: GET /api/categories
     * Access: Public
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $categories = DB::table('categories')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json($categories);
        } catch (\Exception $e) {
            Log::error('Failed to fetch categories: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch categories'], 500);
        }
    }

    /**
     * Membuat kategori baru.
     *
     * Endpoint: POST /api/categories
     * Body: { name: string }
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:categories,name',
            ]);

            $categoryId = DB::table('categories')->insertGetId([
                'name' => $request->name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $category = DB::table('categories')->find($categoryId);

            return response()->json([
                'message' => 'Category created successfully',
                'category' => $category
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create category: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create category'], 500);
        }
    }

    /**
     * Menampilkan detail kategori berdasarkan ID.
     *
     * Endpoint: GET /api/categories/{id}
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $category = DB::table('categories')->find($id);

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            return response()->json($category);
        } catch (\Exception $e) {
            Log::error('Failed to fetch category: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch category'], 500);
        }
    }

    /**
     * Memperbarui nama kategori.
     *
     * Endpoint: PUT /api/categories/{id}
     * Body: { name: string }
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $category = DB::table('categories')->find($id);

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            $request->validate([
                'name' => 'required|string|max:255|unique:categories,name,' . $id,
            ]);

            DB::table('categories')
                ->where('id', $id)
                ->update([
                    'name' => $request->name,
                    'updated_at' => now(),
                ]);

            $updatedCategory = DB::table('categories')->find($id);

            return response()->json([
                'message' => 'Category updated successfully',
                'category' => $updatedCategory
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update category: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update category'], 500);
        }
    }

    /**
     * Menghapus kategori jika tidak sedang digunakan oleh showcase mana pun.
     *
     * Endpoint: DELETE /api/categories/{id}
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $category = DB::table('categories')->find($id);

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            // Check if category is in use
            $showcasesCount = DB::table('showcases')
                ->where('category_id', $id)
                ->count();

            if ($showcasesCount > 0) {
                return response()->json([
                    'message' => "Cannot delete category. It is used by {$showcasesCount} showcase(s)."
                ], 409);
            }

            DB::table('categories')->where('id', $id)->delete();

            return response()->json([
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete category: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete category'], 500);
        }
    }
}
