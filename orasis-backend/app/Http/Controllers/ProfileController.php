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
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
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
            ->with('tags')
            ->latest()
            ->get();

        return response()->json([
            'data' => $showcases
        ]);
    }

    public function stats(Request $request)
    {
        $user = $request->user();
        
        $stats = [
            'total_showcases' => $user->showcases()->count(),
            'approved_showcases' => $user->showcases()->where('status', 'approved')->count(),
            'pending_showcases' => $user->showcases()->where('status', 'pending')->count(),
            'rejected_showcases' => $user->showcases()->where('status', 'rejected')->count(),
            'total_collections' => $user->collections()->count(),
        ];

        return response()->json([
            'data' => $stats
        ]);
    }
}
