<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
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
     * Store a newly created category.
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
     * Display the specified category.
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
     * Update the specified category.
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
     * Remove the specified category.
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
