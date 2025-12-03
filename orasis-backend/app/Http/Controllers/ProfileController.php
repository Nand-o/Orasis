<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if it exists
            if ($user->profile_picture) {
                $oldPath = str_replace(url('/storage/'), '', $user->profile_picture);
                if (\Storage::disk('public')->exists($oldPath)) {
                    \Storage::disk('public')->delete($oldPath);
                }
            }

            $file = $request->file('profile_picture');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profiles', $filename, 'public');
            $user->profile_picture = url('/storage/' . $path);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        // Add no-cache headers
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        $user = $request->user();

        // DEBUG: Log what we receive
        \Log::info('PASSWORD CHANGE REQUEST RECEIVED', [
            'all_input' => $request->all(),
            'current_password_exists' => $request->has('current_password'),
            'password_exists' => $request->has('password'),
            'password_confirmation_exists' => $request->has('password_confirmation'),
        ]);

        // Get input
        $currentPassword = $request->input('current_password');
        $newPassword = $request->input('password');
        $confirmPassword = $request->input('password_confirmation');

        // Manual validation
        if (!$currentPassword) {
            return response()->json(['message' => 'Current password is required'], 422);
        }

        if (!$newPassword) {
            return response()->json(['message' => 'New password is required'], 422);
        }

        if (strlen($newPassword) < 8) {
            return response()->json(['message' => 'Password must be at least 8 characters'], 422);
        }

        if ($newPassword !== $confirmPassword) {
            return response()->json(['message' => 'Password confirmation does not match'], 422);
        }

        // Verify current password
        if (!Hash::check($currentPassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        // Update password
        $user->password = Hash::make($newPassword);
        $user->save();

        \Log::info('PASSWORD CHANGED SUCCESSFULLY for user: ' . $user->id);

        return response()->json([
            'message' => 'Password changed successfully',
            'timestamp' => now()->toIso8601String(), // Unique timestamp to prevent cache
        ]);
    }

    public function showcases(Request $request)
    {
        $user = $request->user();
        
        $showcases = $user->showcases()
            ->with(['tags', 'category'])
            ->latest()
            ->get();

        return response()->json([
            'data' => $showcases
        ]);
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        
        // Calculate total views from all user's showcases
        $totalViews = $user->showcases()->sum('views_count');
        
        $stats = [
            'total_showcases' => $user->showcases()->count(),
            'approved_showcases' => $user->showcases()->where('status', 'approved')->count(),
            'pending_showcases' => $user->showcases()->where('status', 'pending')->count(),
            'rejected_showcases' => $user->showcases()->where('status', 'rejected')->count(),
            'total_collections' => $user->collections()->count(),
            'total_views' => $totalViews,
        ];

        return response()->json([
            'data' => $stats
        ]);
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        try {
            // Delete user's profile picture if exists
            if ($user->profile_picture) {
                $oldPath = str_replace(url('/storage/'), '', $user->profile_picture);
                if (\Storage::disk('public')->exists($oldPath)) {
                    \Storage::disk('public')->delete($oldPath);
                }
            }

            // Delete all user's showcase images
            foreach ($user->showcases as $showcase) {
                if ($showcase->image_url) {
                    $imagePath = str_replace(url('/storage/'), '', $showcase->image_url);
                    if (\Storage::disk('public')->exists($imagePath)) {
                        \Storage::disk('public')->delete($imagePath);
                    }
                }
            }

            // Delete all user's showcases (will cascade to pivot tables)
            $user->showcases()->delete();

            // Delete all user's collections (will cascade to pivot tables)
            $user->collections()->delete();

            // Revoke all tokens
            $user->tokens()->delete();

            // Delete the user account
            $user->delete();

            return response()->json([
                'message' => 'Account deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to delete account: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete account. Please try again.'
            ], 500);
        }
    }
}
