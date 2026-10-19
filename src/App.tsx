import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BooksPage } from './features/books/BooksPage';

// Buổi 5 & Yêu cầu kỹ thuật 6: Lazy load trang Thống kê bằng React.lazy
const StatsPage = lazy(() => import('./features/stats/StatsPage'));

// Fallback spinner hiển thị trong lúc tải chunk của StatsPage
const PageLoadingFallback: React.FC = () => (
  <div className="lazy-loading-fallback">
    <div className="spinner" />
    <p>Đang tải trang thống kê...</p>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <div className="content-container">
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<BooksPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
        <footer className="footer">
          <div className="footer-content">
            <p>© 2026 Mini Library — Hệ thống thư viện chuyên ngành Khoa CNTT</p>
            <p className="footer-sub">Học phần: Lập trình Web nâng cao (LTWNC)</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
