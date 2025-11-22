# 🎯 Rencana Testing Axios Integration - Orasis Project

## 📋 Status Saat Ini
✅ **Sudah Selesai:**
- Laragon terinstall (PHP, Composer, PostgreSQL)
- Backend Laravel sudah setup lengkap
- Database migrations dan seeding sudah berjalan
- Axios sudah terinstall di frontend
- Service layer sudah dibuat (showcase.service.js, api.js)
- HomePage sudah menggunakan API (dengan loading & error handling)

## ⚠️ Masalah yang Ditemui
❌ **Server Backend tidak bisa diakses:**
- `php artisan serve` dan `php -S` tidak listening di port yang ditentukan
- Kemungkinan issue: Windows Firewall, Antivirus, atau PHP configuration
- Solusi: **Gunakan Apache di Laragon** (lebih stabil untuk development)

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

---

### **FASE 2: Update Frontend Configuration** ⏱️ 5 menit

#### Step 2.1: Update .env
File: `orasis-frontend/.env`
```env
VITE_API_URL=http://orasis-backend.test/api
VITE_BASE_URL=http://orasis-backend.test
```

#### Step 2.2: Update CORS di Backend
File: `orasis-backend/config/cors.php`
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://orasis-backend.test',
],
```

#### Step 2.3: Clear Cache Backend
```powershell
cd C:\laragon\www\orasis-backend
php artisan config:clear
php artisan cache:clear
```

---

### **FASE 3: Test Homepage Integration** ⏱️ 5 menit

#### Step 3.1: Start Frontend
```powershell
cd orasis-frontend
npm run dev
```

#### Step 3.2: Akses Homepage
- Buka: `http://localhost:5173`
- **Expected:**
  - Loading spinner muncul sebentar
  - Showcase cards muncul dari API
  - Console log: "Fetching showcases from API..."
  - Console log: "API Response:", {data: [...]}

#### Step 3.3: Verifikasi di DevTools
**Network Tab:**
- Request: `http://orasis-backend.test/api/showcases`
- Status: `200 OK`
- Response: JSON dengan array showcases

**Console Tab:**
- ✅ Tidak ada error merah
- ✅ Ada log "API Response"
- ✅ Tidak ada CORS error

---

### **FASE 4: Buat Test Page untuk CRUD** ⏱️ 15 menit

#### Step 4.1: Buat ShowcaseTestPage.jsx
**Lokasi:** `orasis-frontend/src/features/design/ShowcaseTestPage.jsx`

**Fitur:**
- Display API URL yang sedang digunakan
- Button: GET All Showcases
- Button: GET by ID (dengan input field)
- Display hasil dalam format JSON readable
- Display error dengan jelas (jika ada)

#### Step 4.2: Add Route
File: `orasis-frontend/src/App.jsx`
```jsx
import ShowcaseTestPage from './features/design/ShowcaseTestPage';

// Di dalam Routes:
<Route path="/test-crud" element={<ShowcaseTestPage />} />
```

#### Step 4.3: Test GET Operations
Akses: `http://localhost:5173/test-crud`

**Test Cases:**
1. ✅ Click "GET All" → Tampil semua showcases
2. ✅ Click "GET by ID" (ID: 1) → Tampil showcase detail
3. ✅ Click "GET by ID" (ID: 999) → Error 404 handled with grace

---

### **FASE 5: Test CREATE/UPDATE/DELETE** ⏱️ 10 menit

#### Step 5.1: Pahami Requirement Auth
**Catatan Penting:**
- CREATE, UPDATE, DELETE **memerlukan authentication**
- Tanpa token, akan dapat response: `401 Unauthenticated`
- Ini adalah **behavior yang BENAR**

#### Step 5.2: Test Protected Endpoints (Expected to Fail)
**Test Cases:**
1. ❌ Click "CREATE" → Error 401 (Expected)
2. ❌ Click "UPDATE" → Error 401 (Expected)
3. ❌ Click "DELETE" → Error 401 (Expected)

**Confirmation:**
- Error 401 muncul dengan message jelas
- Tidak ada network error atau CORS error
- Error dari backend (bukan connection refused)

---

### **FASE 6: Implementasi Authentication** ⏱️ 30 menit
**Note:** Fase ini akan dilakukan SETELAH FASE 1-5 berhasil

#### Step 6.1: Buat Auth Service
File: `orasis-frontend/src/services/auth.service.js`
```javascript
- register()
- login()
- logout()
- getCurrentUser()
```

#### Step 6.2: Buat AuthContext
File: `orasis-frontend/src/context/AuthContext.jsx`

#### Step 6.3: Buat Login/Register Pages
- LoginPage.jsx
- RegisterPage.jsx

#### Step 6.4: Test Full CRUD dengan Auth Token
- Login → Dapat token
- CREATE showcase → Success
- UPDATE showcase → Success
- DELETE showcase → Success

---

### **FASE 7: Implementasi Collection Service** ⏱️ 20 menit

#### Step 7.1: Buat Collection Service
File: `orasis-frontend/src/services/collection.service.js`

#### Step 7.2: Update Collection Pages
- CollectionsPage.jsx
- CollectionDetailPage.jsx

---

## 📊 Success Criteria

### Minimal Success (Fase 1-3):
- ✅ Backend accessible via Laragon
- ✅ Frontend dapat fetch data dari API
- ✅ HomePage menampilkan data real dari database
- ✅ No CORS errors
- ✅ Loading states berfungsi

### Complete Success (Fase 1-7):
- ✅ Semua GET operations berfungsi
- ✅ Authentication implemented
- ✅ CREATE/UPDATE/DELETE berfungsi dengan auth
- ✅ Collection service integrated
- ✅ Error handling comprehensive

---

## 🛠️ Troubleshooting Guide

### Problem: "Unable to connect to remote server"
**Solution:**
- Pastikan Laragon Apache running
- Test manual: `http://orasis-backend.test` di browser
- Cek Windows hosts file

### Problem: "CORS Error"
**Solution:**
- Update `config/cors.php` dengan allowed origin yang benar
- Run `php artisan config:clear`
- Restart Apache di Laragon

### Problem: "404 Not Found /api/showcases"
**Solution:**
- Cek `routes/api.php` ada route yang benar
- Pastikan `.htaccess` di folder public
- Cek Apache mod_rewrite enabled

### Problem: "Database connection error"
**Solution:**
- Pastikan PostgreSQL running di Laragon
- Cek `.env` backend: DB_HOST, DB_PORT, DB_DATABASE
- Test connection: `psql -U postgres -d orasis`

---

## 📝 Next Steps (Sekarang)

1. **Buka Laragon** → Start All
2. **Test backend**: `http://orasis-backend.test/api/showcases`
3. **Jika berhasil** → Lanjut update frontend .env
4. **Jika gagal** → Debug Apache/hosts configuration

---

## 🎓 Lessons Learned

### Apa yang TIDAK Berhasil:
❌ `php artisan serve` - tidak reliable di Windows
❌ `php -S localhost:8000` - tidak listening properly
❌ Multiple port changes tanpa diagnose root cause

### Apa yang LEBIH BAIK:
✅ Gunakan Apache (via Laragon/XAMPP) untuk stability
✅ Virtual hosts untuk project organization
✅ Test manual di browser sebelum frontend integration
✅ Step-by-step verification dengan clear success criteria

---

**Created:** 2025-11-22
**Status:** Ready for Phase 1 Implementation
