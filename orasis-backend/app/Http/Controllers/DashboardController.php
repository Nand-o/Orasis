<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Showcase;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function analytics()
    {
        try {
            // Total stats
            $totalUsers = User::count();
            $totalShowcases = Showcase::count();
            $approvedShowcases = Showcase::where('status', 'approved')->count();
            $pendingShowcases = Showcase::where('status', 'pending')->count();
            $rejectedShowcases = Showcase::where('status', 'rejected')->count();

            // Showcases per month (last 6 months) - Get raw data then group in PHP
            $showcases = Showcase::where('created_at', '>=', now()->subMonths(6))
                ->orderBy('created_at', 'asc')
                ->get();
            
            $showcasesPerMonth = $showcases->groupBy(function($item) {
                return date('Y-m', strtotime($item->created_at));
            })->map(function($items, $month) {
                return ['month' => $month, 'count' => $items->count()];
            })->values();

            // Top contributors - Get users with showcases, group in PHP
            $topContributors = User::with(['showcases' => function($query) {
                $query->where('status', 'approved');
            }])->get()
            ->filter(function($user) {
                return $user->showcases->count() > 0;
            })
            ->map(function($user) {
                $user->showcases_count = $user->showcases->count();
                return $user;
            })
            ->sortByDesc('showcases_count')
            ->take(5)
            ->values();

            // Showcases by category
            $showcasesByCategory = Showcase::select('category', DB::raw('COUNT(*) as count'))
                ->where('status', 'approved')
                ->groupBy('category')
                ->orderBy('count', 'desc')
                ->get();

            // Most used tags - Get all then count in PHP
            $popularTags = Tag::with('showcases')->get()
                ->map(function($tag) {
                    $tag->showcases_count = $tag->showcases->count();
                    return $tag;
                })
                ->sortByDesc('showcases_count')
                ->take(10)
                ->values();

            // User registrations per month - Get raw data then group in PHP
            $users = User::where('created_at', '>=', now()->subMonths(6))
                ->orderBy('created_at', 'asc')
                ->get();
            
            $usersPerMonth = $users->groupBy(function($item) {
                return date('Y-m', strtotime($item->created_at));
            })->map(function($items, $month) {
                return ['month' => $month, 'count' => $items->count()];
            })->values();

            return response()->json([
                'data' => [
                    'overview' => [
                        'total_users' => $totalUsers,
                        'total_showcases' => $totalShowcases,
                        'approved_showcases' => $approvedShowcases,
                        'pending_showcases' => $pendingShowcases,
                        'rejected_showcases' => $rejectedShowcases,
                    ],
                    'showcases_per_month' => $showcasesPerMonth,
                    'users_per_month' => $usersPerMonth,
                    'top_contributors' => $topContributors,
                    'showcases_by_category' => $showcasesByCategory,
                    'popular_tags' => $popularTags,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
