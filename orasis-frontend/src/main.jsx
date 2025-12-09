/**
 * Entry point aplikasi front-end
 *
 * File ini bertanggung jawab untuk mount React app ke DOM.
 * - Menggunakan `StrictMode` untuk menangkap potensi masalah runtime
 * - Membungkus aplikasi dengan `ErrorBoundary` untuk menangani error runtime
 *
 * Dokumentasi singkat ini ditulis dalam Bahasa Indonesia untuk keperluan akademik.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
