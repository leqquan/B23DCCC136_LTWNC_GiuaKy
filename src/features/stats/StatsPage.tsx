import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Book, Genre, GenreStatistics, BorrowedBook } from '../../types/book.types';
import { returnBook } from '../books/booksSlice';
import { BarChart3, BookOpenCheck, Layers, Library, BookmarkCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Buổi 5 & Yêu cầu chức năng 9: Trang Thống kê (route /stats)
 * Được lazy load bởi React.lazy + Suspense
 */
const StatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, borrowedBooks, status } = useAppSelector((state) => state.books);

  // Thống kê số đầu sách theo từng thể loại (sử dụng Utility Type GenreStatistics = Record<Genre, number>)
  const genreTitleCount = useMemo<GenreStatistics>(() => {
    const counts: GenreStatistics = {
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book: Book) => {
      const g = book.genre;
      if (counts[g] !== undefined) {
        counts[g] += 1;
      }
    });

    return counts;
  }, [books]);

  // Thống kê tổng số bản sách còn lại theo từng thể loại
  const genreCopiesCount = useMemo<GenreStatistics>(() => {
    const counts: GenreStatistics = {
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book: Book) => {
      const g = book.genre;
      if (counts[g] !== undefined) {
        counts[g] += book.availableCopies;
      }
    });

    return counts;
  }, [books]);

  // Tổng số đầu sách
  const totalTitles = books.length;
  // Tổng số bản sách còn lại trong thư viện
  const totalAvailableCopies = books.reduce((acc: number, b: Book) => acc + b.availableCopies, 0);
  // Số sách đang được sinh viên mượn
  const totalBorrowedCount = borrowedBooks.length;

  const genres: Genre[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

  return (
    <div className="stats-container">
      <div className="stats-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} className="icon-mr" />
          Quay lại danh mục sách
        </Link>
        <div className="stats-title-block">
          <h1 className="stats-page-title">
            <BarChart3 className="title-icon" size={28} />
            Báo Cáo & Thống Kê Thư Viện Khoa
          </h1>
          <p className="stats-page-subtitle">
            Theo dõi tổng quan tài nguyên sách chuyên ngành và tình hình mượn sách của sinh viên
          </p>
        </div>
      </div>

      {status === 'loading' && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải dữ liệu thống kê...</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box bg-blue">
            <Library size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Tổng số đầu sách</span>
            <strong className="kpi-value">{totalTitles}</strong>
            <span className="kpi-desc">Thuộc 3 ngành đào tạo</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box bg-purple">
            <Layers size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Số bản còn trong kho</span>
            <strong className="kpi-value">{totalAvailableCopies}</strong>
            <span className="kpi-desc">Sẵn sàng để mượn</span>
          </div>
        </div>

        <div className="kpi-card highlight-card">
          <div className="kpi-icon-box bg-emerald">
            <BookOpenCheck size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Sách bạn đang mượn</span>
            <strong className="kpi-value">{totalBorrowedCount} / 3</strong>
            <span className="kpi-desc">
              {totalBorrowedCount >= 3 ? 'Đã đạt giới hạn tối đa' : `Còn được mượn thêm ${3 - totalBorrowedCount} cuốn`}
            </span>
          </div>
        </div>
      </div>

      {/* Chi tiết theo từng thể loại */}
      <section className="stats-section">
        <h2 className="section-title">
          <BookmarkCheck size={20} className="icon-mr" />
          Số đầu sách theo từng thể loại chuyên ngành
        </h2>

        <div className="genre-stats-grid">
          {genres.map((genre) => {
            const count = genreTitleCount[genre];
            const copies = genreCopiesCount[genre];
            const percentage = totalTitles > 0 ? Math.round((count / totalTitles) * 100) : 0;

            return (
              <div key={genre} className="genre-stat-card">
                <div className="genre-card-header">
                  <span className={`genre-badge genre-${genre.toLowerCase().replace(/\s+/g, '-')}`}>
                    {genre}
                  </span>
                  <span className="genre-percent">{percentage}% danh mục</span>
                </div>

                <div className="genre-stat-numbers">
                  <div className="number-item">
                    <span className="number-label">Số đầu sách:</span>
                    <strong className="number-val">{count} đầu sách</strong>
                  </div>
                  <div className="number-item">
                    <span className="number-label">Bản còn lại:</span>
                    <span className="number-val">{copies} bản</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="progress-bar-wrapper">
                  <div
                    className={`progress-fill fill-${genre.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Danh sách sách đang mượn chi tiết */}
      <section className="stats-section">
        <h2 className="section-title">
          <BookOpenCheck size={20} className="icon-mr" />
          Danh sách sách bạn đang mượn ({borrowedBooks.length} cuốn)
        </h2>

        {borrowedBooks.length === 0 ? (
          <div className="empty-state-card">
            <BookOpenCheck size={40} className="empty-icon text-muted" />
            <p className="empty-text">Hiện tại bạn chưa mượn cuốn sách nào từ thư viện.</p>
            <Link to="/" className="btn btn-primary btn-sm">
              Xem sách để mượn
            </Link>
          </div>
        ) : (
          <div className="borrowed-table-wrapper">
            <table className="borrowed-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Thời gian mượn</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map((item: BorrowedBook) => (
                  <tr key={item.id}>
                    <td><strong>{item.title}</strong></td>
                    <td>{item.author}</td>
                    <td>
                      <span className={`genre-badge genre-${item.genre.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.genre}
                      </span>
                    </td>
                    <td>{new Date(item.borrowedAt).toLocaleString('vi-VN')}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => dispatch(returnBook(item.bookId))}
                      >
                        Trả sách
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default StatsPage;
