import React from 'react';
import { NavLink } from 'react-router-dom';
import { Library, Moon, Sun, BarChart3, BookMarked } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppSelector } from '../app/hooks';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const borrowedBooks = useAppSelector((state) => state.books.borrowedBooks);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Library size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Mini Library</span>
            <span className="brand-subtitle">Khoa Công nghệ Thông tin</span>
          </div>
        </NavLink>

        <nav className="navbar-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <BookMarked size={18} className="icon-mr" />
            Tra cứu & Mượn sách
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={18} className="icon-mr" />
            Thống kê
          </NavLink>
        </nav>

        <div className="navbar-actions">
          {/* Badge hiển thị số lượng sách đang mượn trên tổng 3 cuốn */}
          <div
            className={`borrow-status-pill ${borrowedBooks.length >= 3 ? 'pill-warning' : ''}`}
            title="Mỗi sinh viên được mượn tối đa 3 cuốn cùng lúc"
          >
            <span className="pill-dot" />
            <span>Đang mượn: <strong>{borrowedBooks.length}/3</strong> cuốn</span>
          </div>

          {/* Nút chuyển đổi Theme Sáng / Tối */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}
            title={`Đổi sang chế độ ${theme === 'light' ? 'Tối' : 'Sáng'}`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
