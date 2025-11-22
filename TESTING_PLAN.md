# 🎯 Orasis Frontend Integration Plan

## 📊 Overall Progress: Phase 1-3 Complete (60%)

### ✅ **COMPLETED PHASES**

#### **Phase 1: Backend Setup & Authentication** ✅ DONE
- ✅ Laragon Apache setup (orasis-backend.test)
- ✅ Database fresh migration with 21 seeded showcases
- ✅ CORS configuration
- ✅ Laravel Sanctum authentication
- ✅ All CRUD endpoints tested and working

#### **Phase 2: Frontend Authentication & Showcase CRUD** ✅ DONE
- ✅ auth.service.js with login/register/logout
- ✅ AuthContext for global auth state
- ✅ LoginPage and RegisterPage components
- ✅ showcaseService.js with full CRUD operations
- ✅ ShowcaseTestPage with visual UPDATE mode
- ✅ Authorization (only owner/admin can modify)
- ✅ Pagination handling (fetch all pages)
- ✅ Snake_case to camelCase transformation
- ✅ Image display fixed (Unsplash integration)
- ✅ SearchResultPage uses API data
- ✅ HomePage displays real data from API

**Last Commit:** `feat: implement authentication and enhance showcase CRUD operations`

---

## 🎯 UPCOMING PHASES (Prioritized Roadmap)

---

## 🚀 RENCANA BARU - Step by Step

### **FASE 1: Setup Backend dengan Laragon Apache** ⏱️ 10 menit

#### Step 1.1: Persiapan Project di Laragon
```powershell
# Sudah dilakukan: Copy project ke Laragon
# Project location: C:\laragon\www\orasis-backend
```

#### Step 1.2: Konfigurasi Apache Virtual Host
**Manual Steps:**
1. Buka **Laragon**
2. Klik **Start All** (Apache + PostgreSQL)
3. Menu → **Apache** → **sites-enabled**
4. Cek file `auto.orasis-backend.test.conf` sudah dibuat otomatis
5. Edit `C:\Windows\System32\drivers\etc\hosts` (as Admin):
   ```
   127.0.0.1 orasis-backend.test
   ```
6. Restart Apache di Laragon

#### Step 1.3: Test Backend
Buka browser dan test:
- ✅ `http://orasis-backend.test` → Laravel welcome page
- ✅ `http://orasis-backend.test/api/showcases` → JSON response

**Expected Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "E-Commerce Modern",
      "category": "E-Commerce",
      "status": "published",
      ...
    }
  ]
}
```

### **Phase 3: Collection System** ✅ COMPLETE
**Priority:** HIGH | **Completed:** November 22, 2025

**Goals:**
- ✅ Implement collection.service.js for CRUD operations
- ✅ Integrate CollectionContext with real API
- ✅ Test collections on CollectionPage
- ✅ Add/remove showcases to/from collections
- ✅ Display user's collections

**Tasks:**
1. ✅ Check backend API endpoints (/api/collections)
2. ✅ Create collection.service.js with 7 methods
3. ✅ Update CollectionContext with API calls (moved to /context/)
4. ✅ Build CollectionTestPage with modern UI (Tailwind + Framer Motion)
5. ✅ Integrate bookmark functionality on showcase cards
6. ✅ Update CollectionPage with real API data
7. ✅ Fix data structure migration (designIds → showcases)
8. ✅ Update all components to use image_url from API
9. ✅ Create comprehensive testing guide

**Files Created/Updated:**
- ✅ `orasis-frontend/src/services/collection.service.js`
- ✅ `orasis-frontend/src/context/CollectionContext.jsx` (new location)
- ✅ `orasis-frontend/src/features/collections/CollectionTestPage.jsx` (professional UI)
- ✅ `orasis-frontend/src/features/collections/CollectionPage.jsx`
- ✅ `orasis-frontend/src/features/collections/components/CollectionCard.jsx`
- ✅ `orasis-frontend/src/features/collections/components/CollectionModal.jsx`
- ✅ `orasis-frontend/src/features/collections/components/CollectionDetailModal.jsx`
- ✅ `orasis-frontend/src/features/design/components/ShowcaseCard.jsx`
- ✅ `orasis-frontend/src/features/home/components/FilterBar.jsx`
- ✅ `COLLECTION_TESTING_GUIDE.md`

**Last Commit:** `feat: complete Phase 3 - Collection System with API integration`

**Success Criteria:**
- ✅ Can create new collection
- ✅ Can view all user collections
- ✅ Can update collection name/description
- ✅ Can delete collection
- ✅ Can add showcase to collection
- ✅ Can remove showcase from collection
- ✅ Collections display properly on CollectionPage

---

### **Phase 4: Showcase Detail Page Integration**
**Priority:** HIGH | **Estimasi:** 1 sesi

**Goals:**
- Replace mockData with API calls
- Display real showcase details from database
- Show related showcases from API
- Add "Add to Collection" functionality
- Display real owner information

**Tasks:**
1. ⏳ Update DesignDetailPage to fetch from API
2. ⏳ Implement getById with proper error handling
3. ⏳ Fetch related showcases from API (by category)
4. ⏳ Add "Add to Collection" button/modal
5. ⏳ Display owner info (name, avatar)
6. ⏳ Add loading and error states

**Files to Update:**
- `orasis-frontend/src/features/design/DesignDetailPage.jsx`

**Success Criteria:**
- ✅ Detail page shows data from API
- ✅ Related showcases are real data
- ✅ Can add showcase to collection from detail
- ✅ 404 page shown if showcase not found
- ✅ Owner information displayed correctly

---

### **Phase 5: Profile & User Dashboard**
**Priority:** MEDIUM | **Estimasi:** 1-2 sesi

**Goals:**
- User can view and edit their profile
- Dashboard showing user's showcases
- List of user's collections
- Change password functionality

**Tasks:**
1. ⏳ Create ProfilePage.jsx
2. ⏳ Create DashboardPage.jsx  
3. ⏳ Implement profile update service
4. ⏳ Add "My Showcases" section
5. ⏳ Add "My Collections" section
6. ⏳ Implement change password
7. ⏳ Add profile routes to App.jsx

**Files to Create:**
- `orasis-frontend/src/features/profile/ProfilePage.jsx`
- `orasis-frontend/src/features/profile/DashboardPage.jsx`
- `orasis-frontend/src/services/user.service.js`

**Success Criteria:**
- ✅ User can view profile information
- ✅ User can update name and email
- ✅ User can change password
- ✅ Dashboard shows user's showcases
- ✅ Dashboard shows user's collections
- ✅ Proper validation and error handling

---

### **Phase 6: Enhanced Search & Filter**
**Priority:** MEDIUM | **Estimasi:** 1 sesi

**Goals:**
- Advanced filtering options
- Multiple sort options
- Tag-based filtering
- Better search UX

**Tasks:**
1. ⏳ Add sort dropdown (newest, popular, title A-Z)
2. ⏳ Multi-category filter
3. ⏳ Tag-based filter
4. ⏳ Status filter (for admin/owner)
5. ⏳ Update SearchResultPage with filters
6. ⏳ Add filter persistence (URL params)

**Files to Update:**
- `orasis-frontend/src/features/home/HomePage.jsx`
- `orasis-frontend/src/features/design/SearchResultPage.jsx`
- `orasis-frontend/src/features/home/components/FilterBar.jsx`

**Success Criteria:**
- ✅ Can sort showcases by different criteria
- ✅ Can filter by multiple categories
- ✅ Can filter by tags
- ✅ Filters persist in URL
- ✅ Clear filters button works properly

---

### **Phase 7: Admin Dashboard**
**Priority:** MEDIUM | **Estimasi:** 1-2 sesi

**Goals:**
- Admin-only pages for management
- Approve/reject showcase submissions
- User management
- Statistics overview

**Tasks:**
1. ⏳ Create AdminDashboard.jsx
2. ⏳ Implement admin route protection
3. ⏳ Build showcase approval interface
4. ⏳ Create user management table
5. ⏳ Add statistics cards
6. ⏳ Implement admin.service.js

**Files to Create:**
- `orasis-frontend/src/features/admin/AdminDashboard.jsx`
- `orasis-frontend/src/features/admin/ShowcaseManagement.jsx`
- `orasis-frontend/src/features/admin/UserManagement.jsx`
- `orasis-frontend/src/services/admin.service.js`
- `orasis-frontend/src/components/ProtectedRoute.jsx`

**Success Criteria:**
- ✅ Only admin can access admin pages
- ✅ Admin can approve/reject showcases
- ✅ Admin can view all users
- ✅ Admin can see statistics
- ✅ Proper authorization checks

---

### **Phase 8: Image Upload Feature** (Optional)
**Priority:** LOW | **Estimasi:** 2 sesi

**Goals:**
- Upload images instead of URL input
- Image preview before upload
- File validation
- Backend storage integration

**Tasks:**
1. ⏳ Create ImageUpload component
2. ⏳ Implement file validation (size, type)
3. ⏳ Add image preview
4. ⏳ Update backend controller for file upload
5. ⏳ Configure Laravel storage
6. ⏳ Update showcase form with upload

**Files to Create/Update:**
- `orasis-frontend/src/components/ImageUpload.jsx`
- `orasis-backend/app/Http/Controllers/ShowcaseController.php`
- `orasis-backend/config/filesystems.php`

**Success Criteria:**
- ✅ Can upload image files
- ✅ Image preview works
- ✅ File size/type validation
- ✅ Images stored properly on server
- ✅ URLs generated correctly

---

## 📝 Development Notes

### Current Environment:
- **Backend:** http://orasis-backend.test (Laragon Apache)
- **Frontend:** http://localhost:5173 (Vite Dev Server)
- **Database:** PostgreSQL via Laragon
- **Total Showcases:** 21 (6 Mobile, 3 each for other categories)

### API Endpoints Available:
```
Authentication:
POST   /api/register
POST   /api/login
POST   /api/logout

Showcases:
GET    /api/showcases (with pagination)
GET    /api/showcases/{id}
POST   /api/showcases (auth required)
PUT    /api/showcases/{id} (auth required, owner/admin only)
DELETE /api/showcases/{id} (auth required, owner/admin only)

Collections:
GET    /api/collections (auth required)
GET    /api/collections/{id} (auth required)
POST   /api/collections (auth required)
PUT    /api/collections/{id} (auth required, owner only)
DELETE /api/collections/{id} (auth required, owner only)
POST   /api/collections/{id}/showcases/{showcase_id} (auth required)
DELETE /api/collections/{id}/showcases/{showcase_id} (auth required)
```

### Test Credentials:
- **Admin:** admin@orasis.com / admin123
- **User:** faris@orasis.com / password

---

## 🎯 Quick Start Commands

### Backend (Laragon):
```powershell
# Start Laragon Services
# Open Laragon → Click "Start All"

# Refresh database (if needed)
cd C:\laragon\www\orasis-backend
php artisan migrate:fresh --seed
php artisan tinker --execute="DB::table('showcases')->update(['status' => 'approved']);"
```

### Frontend:
```powershell
cd orasis-frontend
npm run dev
# Open http://localhost:5173
```

### Testing:
- **Test Page:** http://localhost:5173/test-crud
- **Login:** http://localhost:5173/login
- **Collections:** http://localhost:5173/collections

---

## ⚠️ Common Issues & Solutions

### Issue: CORS Error
**Solution:** Check `orasis-backend/config/cors.php` includes `http://localhost:5173`

### Issue: 401 Unauthorized
**Solution:** Check auth token in localStorage, re-login if needed

### Issue: Images not loading
**Solution:** Verify image_url → imageUrl transformation in HomePage.jsx

### Issue: Pagination only shows 10 items
**Solution:** Check multi-page fetch implementation with `while (hasMorePages)` loop

---

**Last Updated:** November 22, 2025  
**Current Phase:** Phase 3 - Collection System  
**Next Milestone:** Complete Collection CRUD and Detail Page Integration  
**Overall Progress:** 40% (Phase 1-2 Complete)
