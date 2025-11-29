# Phase 5: View Counter & Basic Analytics Implementation

## 📋 Overview
Implementasi fitur view counter untuk tracking jumlah views pada setiap showcase dan basic analytics untuk menampilkan statistik viewing trends.

## 🎯 Goals
1. Track view count untuk setiap showcase
2. Prevent duplicate views dari user yang sama (session-based)
3. Display view count di showcase cards dan detail page
4. Add trending/popular showcases section based on views
5. Enhance admin analytics dengan view statistics
6. Track view trends over time (daily/weekly/monthly)

---

## 🗄️ Database Changes

### Migration 1: Add views_count column to showcases table
```sql
-- 2025_XX_XX_XXXXXX_add_views_count_to_showcases_table.php
Schema::table('showcases', function (Blueprint $table) {
    $table->unsignedBigInteger('views_count')->default(0)->after('status');
});
```

### Migration 2: Create showcase_views table (for detailed tracking)
```sql
-- 2025_XX_XX_XXXXXX_create_showcase_views_table.php
Schema::create('showcase_views', function (Blueprint $table) {
    $table->id();
    $table->foreignId('showcase_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // null for guests
    $table->string('ip_address', 45); // IPv6 compatible
    $table->string('user_agent')->nullable();
    $table->timestamp('viewed_at');
    $table->timestamps();
    
    // Indexes
    $table->index('showcase_id');
    $table->index('viewed_at');
    $table->index(['showcase_id', 'ip_address', 'viewed_at']);
});
```

---

## 🔧 Backend Implementation

### 1. ShowcaseController.php - Add View Tracking
```php
/**
 * Show showcase detail + increment view count
 */
public function show($id)
{
    $showcase = Showcase::with(['user', 'tags', 'category'])->findOrFail($id);

    // Prevent intip pending showcase (existing logic)
    $user = request()->user('sanctum');
    if ($showcase->status === 'pending') {
        if (!$user || ($showcase->user_id !== $user->id && $user->role !== 'admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }

    // Track view (if not owner and not admin)
    if (!$user || ($showcase->user_id !== $user->id && $user->role !== 'admin')) {
        $this->trackView($showcase);
    }

    // Get similar showcases
    $similar = Showcase::with(['user', 'tags', 'category'])
        ->where('category_id', $showcase->category_id)
        ->where('id', '!=', $id)
        ->where('status', 'approved')
        ->orderBy('views_count', 'desc') // Order by popularity
        ->limit(4)
        ->get();

    return response()->json([
        'data' => $showcase,
        'similar' => $similar
    ]);
}

/**
 * Track showcase view (prevent duplicate within session/IP)
 */
private function trackView($showcase)
{
    $userId = auth('sanctum')->id();
    $ipAddress = request()->ip();
    $userAgent = request()->userAgent();
    
    // Check if already viewed in last 24 hours (prevent spam)
    $existingView = DB::table('showcase_views')
        ->where('showcase_id', $showcase->id)
        ->where(function($query) use ($userId, $ipAddress) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('ip_address', $ipAddress);
            }
        })
        ->where('viewed_at', '>', now()->subHours(24))
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
```

### 2. DashboardController.php - Add View Analytics
```php
public function analytics()
{
    try {
        // ... existing stats ...

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
                    // ... existing overview stats ...
                    'totalViews' => $totalViews,
                ],
                // ... existing data ...
                'view_trends' => $viewTrends,
                'top_viewed_showcases' => $topViewedShowcases,
            ]
        ]);
    } catch (\Exception $e) {
        \Log::error('Analytics Error: ' . $e->getMessage());
        return response()->json(['message' => 'Failed to fetch analytics'], 500);
    }
}
```

### 3. api.php - Add New Routes
```php
// Public routes
Route::get('/showcases/trending', [ShowcaseController::class, 'trending']);
Route::get('/showcases/popular', [ShowcaseController::class, 'popular']);
```

---

## 🎨 Frontend Implementation

### 1. ShowcaseCard.jsx - Display View Count
```jsx
import { Eye } from 'lucide-react';

const ShowcaseCard = ({ design, onClick, showBookmark = true }) => {
    // ... existing code ...

    return (
        <motion.div>
            {/* Image */}
            <div className="aspect-video">
                {/* ... existing image code ... */}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3>{design.title}</h3>
                        <p>{design.category?.name}</p>
                    </div>
                    {showBookmark && <BookmarkButton />}
                </div>

                {/* Views Count */}
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{design.views_count || 0} views</span>
                    </div>
                    {/* Tags */}
                    {design.tags?.slice(0, 3).map(tag => (
                        <span key={tag.id} className="text-xs">#{tag.name}</span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
```

### 2. DesignDetailPage.jsx - Display View Count
```jsx
const DesignDetailPage = () => {
    // ... existing code ...

    return (
        <div>
            {/* Header Stats */}
            <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full">
                        <span>{design.user?.name?.charAt(0)}</span>
                    </div>
                    <div>
                        <p className="font-semibold">{design.user?.name}</p>
                        <p className="text-sm text-gray-500">Designer</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 ml-auto">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Eye className="w-5 h-5" />
                        <span className="font-semibold">{design.views_count || 0}</span>
                        <span className="text-sm">views</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Bookmark className="w-5 h-5" />
                        <span className="font-semibold">{design.saves_count || 0}</span>
                        <span className="text-sm">saves</span>
                    </div>
                </div>
            </div>

            {/* Rest of content */}
        </div>
    );
};
```

### 3. HomePage.jsx - Add Trending Section
```jsx
import { TrendingUp } from 'lucide-react';

const HomePage = ({ searchValue }) => {
    const [showcases, setShowcases] = useState([]);
    const [trendingShowcases, setTrendingShowcases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShowcases();
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            const response = await showcaseService.getTrending();
            setTrendingShowcases(response.data);
        } catch (error) {
            console.error('Failed to fetch trending:', error);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section>
                {/* ... existing hero ... */}
            </section>

            {/* Trending This Week Section */}
            {trendingShowcases.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Trending This Week
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {trendingShowcases.slice(0, 8).map((showcase) => (
                            <ShowcaseCard key={showcase.id} design={showcase} />
                        ))}
                    </div>
                </section>
            )}

            {/* Main Content */}
            <section>
                {/* ... existing content ... */}
            </section>
        </div>
    );
};
```

### 4. AdminAnalyticsPage.jsx - Add View Analytics
```jsx
const AdminAnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    // ... existing code ...

    return (
        <div>
            {/* Overview Stats (add Total Views) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* ... existing stats cards ... */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Views
                        </h3>
                        <Eye className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {analytics.overview.totalViews?.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* View Trends Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    View Trends (Last 30 Days)
                </h2>
                {/* Line chart for view trends */}
                <div className="h-64">
                    {/* Implement with recharts or chart.js */}
                </div>
            </div>

            {/* Top Viewed Showcases */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Most Viewed Showcases
                </h2>
                <div className="space-y-4">
                    {analytics.top_viewed_showcases?.map((showcase, index) => (
                        <div key={showcase.id} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                {index + 1}
                            </div>
                            <img 
                                src={showcase.image_url} 
                                alt={showcase.title}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {showcase.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {showcase.category?.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Eye className="w-4 h-4" />
                                <span className="font-semibold">{showcase.views_count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
```

### 5. showcase.service.js - Add New Methods
```js
const showcaseService = {
    // ... existing methods ...

    /**
     * Get trending showcases (most viewed in last 7 days)
     */
    getTrending: async () => {
        const response = await api.get('/showcases/trending');
        return response.data;
    },

    /**
     * Get popular showcases (all time most viewed)
     */
    getPopular: async () => {
        const response = await api.get('/showcases/popular');
        return response.data;
    },
};

export default showcaseService;
```

---

## 📊 Additional Enhancements

### 1. Sort by Views in FilterBar
Update `FilterBar.jsx` to add sort options:
```jsx
const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_viewed', label: 'Most Viewed' }, // NEW
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' }
];
```

Update `ShowcaseController.php` index method:
```php
switch ($sort) {
    case 'newest':
        $query->latest();
        break;
    case 'oldest':
        $query->oldest();
        break;
    case 'most_viewed': // NEW
        $query->orderBy('views_count', 'desc');
        break;
    case 'title_asc':
        $query->orderBy('title', 'asc');
        break;
    case 'title_desc':
        $query->orderBy('title', 'desc');
        break;
    default:
        $query->latest();
}
```

### 2. User Profile Stats
Add view count to user stats in `ProfilePage.jsx`:
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard 
        label="Total Showcases" 
        value={stats.total} 
        icon={<FileText />}
    />
    <StatCard 
        label="Approved" 
        value={stats.approved} 
        icon={<CheckCircle />}
    />
    <StatCard 
        label="Total Views" 
        value={stats.totalViews} 
        icon={<Eye />}
    />
    <StatCard 
        label="Avg. Views" 
        value={Math.round(stats.totalViews / stats.total || 0)} 
        icon={<TrendingUp />}
    />
</div>
```

---

## ✅ Testing Checklist

### Backend Testing
- [ ] View counter increments correctly on showcase detail view
- [ ] Duplicate views from same IP blocked (24h window)
- [ ] Duplicate views from same user blocked (24h window)
- [ ] Owner viewing own showcase doesn't increment counter
- [ ] Admin viewing showcase doesn't increment counter
- [ ] Trending endpoint returns last 7 days most viewed
- [ ] Popular endpoint returns all-time most viewed
- [ ] Analytics endpoint includes view trends data
- [ ] View count displays correctly in admin dashboard

### Frontend Testing
- [ ] View count displays on ShowcaseCard
- [ ] View count displays on DesignDetailPage
- [ ] Trending section displays on HomePage
- [ ] Sort by "Most Viewed" works correctly
- [ ] Admin analytics shows view trends chart
- [ ] Admin analytics shows top viewed showcases
- [ ] User profile shows total views stat
- [ ] View count updates in real-time after viewing

### Edge Cases
- [ ] Handle showcase with 0 views gracefully
- [ ] Handle very large view counts (1M+)
- [ ] Handle rapid consecutive views (rate limiting)
- [ ] Handle deleted showcase views cleanup
- [ ] Handle guest vs authenticated user tracking

---

## 🚀 Deployment Steps

1. **Backup Database**
   ```bash
   php artisan backup:run
   ```

2. **Run Migrations**
   ```bash
   php artisan migrate
   ```

3. **Clear Cache**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   ```

4. **Test in Staging**
   - Verify view tracking works
   - Check analytics data
   - Test trending/popular endpoints

5. **Deploy to Production**
   ```bash
   git push origin main
   php artisan migrate --force
   php artisan optimize
   ```

---

## 📈 Success Metrics

- View tracking accuracy: >95%
- Duplicate view prevention: 100%
- API response time: <200ms
- Analytics load time: <1s
- User engagement: Track trending section CTR

---

## 🔮 Future Enhancements (Phase 6+)

- [ ] Add "Saves/Bookmarks" counter similar to views
- [ ] Add "Likes/Hearts" feature
- [ ] Add "Most Saves This Week" section
- [ ] Add view duration tracking (time spent on page)
- [ ] Add geographic analytics (view by country/region)
- [ ] Add device analytics (mobile vs desktop views)
- [ ] Add referrer tracking (where views come from)
- [ ] Add real-time view counter (WebSocket)
- [ ] Add view heatmaps for showcase images
- [ ] Add A/B testing for showcase thumbnails

---

## 📝 Notes

- View tracking uses IP + User ID combination to prevent duplicate counting
- 24-hour window prevents spam but allows re-visits to count
- Owner and admin views excluded to prevent artificial inflation
- All queries are indexed for performance
- Cache invalidation strategy: Clear showcase cache when views_count changes
- Consider adding Redis for real-time view counting at scale

---

**Estimated Time:** 8-12 hours
**Priority:** High
**Dependencies:** None (current phase complete)
**Assigned To:** TBD
