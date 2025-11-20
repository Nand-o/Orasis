<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Showcase;
use App\Models\Tag;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'data' => [
                'total_users' => User::count(),
                'total_showcases' => Showcase::where('status', 'approved')->count(),
                'pending_review' => Showcase::where('status', 'pending')->count(),
                'total_tags' => Tag::count(),
            ]
        ]);
    }
}