# Panduan Penggunaan Template

## Cara Memulai

1. **Install Dependencies** (jika belum)
   ```bash
   npm install
   ```

2. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   
   Atau jika ada masalah dengan path, gunakan:
   ```bash
   .\node_modules\.bin\vite.cmd
   ```

3. **Buka Browser**
   - URL: http://localhost:5173

## Struktur Project

```
src/
├── components/          # Komponen reusable
│   ├── Button.jsx      # Komponen button dengan berbagai variant
│   ├── Card.jsx        # Komponen card untuk layout
│   └── index.js        # Export semua komponen
├── pages/              # Halaman aplikasi
│   └── ExamplePage.jsx # Contoh halaman dengan berbagai komponen
├── assets/             # File static (gambar, dll)
├── App.jsx             # Komponen utama aplikasi
├── main.jsx            # Entry point aplikasi
└── index.css           # Global styles dengan Tailwind
```

## Tailwind CSS

### Utility Classes yang Sering Digunakan

**Layout & Spacing:**
- `container` - Container responsif
- `mx-auto` - Center horizontal
- `p-4` - Padding 1rem (4 x 0.25rem)
- `m-4` - Margin 1rem
- `space-y-4` - Vertical spacing antar children

**Flexbox & Grid:**
- `flex` - Display flex
- `flex-col` - Flex direction column
- `justify-center` - Center horizontal
- `items-center` - Center vertical
- `grid grid-cols-3` - Grid dengan 3 kolom

**Colors:**
- `bg-blue-500` - Background blue
- `text-white` - Text putih
- `border-gray-300` - Border gray

**Typography:**
- `text-xl` - Font size extra large
- `font-bold` - Font weight bold
- `text-center` - Text align center

**Effects:**
- `rounded-lg` - Border radius large
- `shadow-lg` - Box shadow large
- `hover:bg-blue-700` - Hover state
- `transition-all` - Smooth transition

**Responsive:**
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)

Contoh:
```jsx
<div className="container mx-auto p-4">
  <h1 className="text-3xl font-bold text-center mb-8">
    Hello Tailwind
  </h1>
</div>
```

## Membuat Komponen Baru

### 1. Buat file komponen di `src/components/`

```jsx
// src/components/MyComponent.jsx
const MyComponent = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default MyComponent;
```

### 2. Export di `src/components/index.js`

```javascript
export { default as MyComponent } from './MyComponent';
```

### 3. Import dan gunakan

```jsx
import { MyComponent } from './components';

function App() {
  return (
    <MyComponent title="Hello">
      <p>Content here</p>
    </MyComponent>
  );
}
```

## Membuat Halaman Baru

1. Buat file di `src/pages/`
2. Import komponen yang dibutuhkan
3. Export default komponen halaman

```jsx
// src/pages/AboutPage.jsx
import { Card, Button } from '../components';

const AboutPage = () => {
  return (
    <div className="container mx-auto p-8">
      <Card title="About Us">
        <p>Content here...</p>
        <Button>Learn More</Button>
      </Card>
    </div>
  );
};

export default AboutPage;
```

## Tips & Tricks

### 1. Dark Mode
Tambahkan prefix `dark:` untuk dark mode styles:
```jsx
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Content
</div>
```

### 2. Hover & Focus States
```jsx
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
  Click me
</button>
```

### 3. Responsive Design
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 kolom di mobile, 2 di tablet, 3 di desktop */}
</div>
```

### 4. Custom Classes di tailwind.config.js
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': '#ff6b6b',
      },
      spacing: {
        '128': '32rem',
      }
    }
  }
}
```

## Troubleshooting

### Dev server tidak jalan
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Tailwind classes tidak terdeteksi
- Pastikan file ada di `content` array di `tailwind.config.js`
- Restart dev server

### CSS tidak update
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache

## Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)
