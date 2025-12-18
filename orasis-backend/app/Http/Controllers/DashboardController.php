<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Showcase;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
/**
 * DashboardController
 *
 * Menyediakan endpoint statistik dan analytics untuk dashboard admin.
 * Mengembalikan rangkuman data seperti total users, jumlah showcase,
 * serta data time-series dan top contributors.
 *
 * @package App\Http\Controllers
 */
class DashboardController extends Controller
{
    /**
     * Ringkasan singkat statistik (overview).
     *
     * Endpoint: GET /api/admin/stats (contoh)
     * Access: Admin
     *
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * Endpoint analytics yang mengembalikan dataset lebih lengkap untuk dashboard.
     *
     * Dataset yang dikompilasi:
     * - showacses_per_month (last 6 months)
     * - users_per_month (last 6 months)
     * - top_contributors, showcases_by_category
     * - popular_tags, view_trends (last 30 days), top_viewed_showcases
     *
     * @return \Illuminate\Http\JsonResponse
     */
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
            $showcasesByCategory = Showcase::with('category')
                ->where('status', 'approved')
                ->whereNotNull('category_id')
                ->get()
                ->groupBy(function($item) {
                    return $item->category ? $item->category->name : 'Uncategorized';
                })
                ->map(function($items, $categoryName) {
                    return [
                        'category' => $categoryName,
                        'count' => $items->count()
                    ];
                })
                ->sortByDesc('count')
                ->values();

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

            // View trends (last 30 days)
            $viewTrends = DB::table('showcase_views')
                ->select(DB::raw('DATE(viewed_at) as date'), DB::raw('COUNT(*) as views'))
                ->where('viewed_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Top viewed showcases
            $topViewedShowcases = Showcase::with(['user', 'category'])
                ->where('status', 'approved')
                ->orderBy('views_count', 'desc')
                ->limit(10)
                ->get();

            // Total views
            $totalViews = DB::table('showcase_views')->count();

            return response()->json([
                'data' => [
                    'overview' => [
                        'total_users' => $totalUsers,
                        'total_showcases' => $totalShowcases,
                        'approved_showcases' => $approvedShowcases,
                        'pending_showcases' => $pendingShowcases,
                        'rejected_showcases' => $rejectedShowcases,
                        'total_views' => $totalViews,
                    ],
                    'showcases_per_month' => $showcasesPerMonth,
                    'users_per_month' => $usersPerMonth,
                    'top_contributors' => $topContributors,
                    'showcases_by_category' => $showcasesByCategory,
                    'popular_tags' => $popularTags,
                    'view_trends' => $viewTrends,
                    'top_viewed_showcases' => $topViewedShowcases,
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
