import React, { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchBooks, borrowBook, returnBook } from './booksSlice';
import { useFilterStore } from '../../stores/filterStore';
import { BookCard } from '../../components/BookCard';
import { SearchBar } from '../../components/SearchBar';
import { BorrowWarningAlert } from '../../components/BorrowWarningAlert';
import { BorrowedBooksSection } from '../../components/BorrowedBooksSection';
import { Book, BorrowedBook } from '../../types/book.types';
import { AlertCircle, RefreshCw, BookX, Sparkles } from 'lucide-react';

export const BooksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { books, borrowedBooks, status, error } = useAppSelector((state) => state.books);
  const { searchKeyword, selectedGenre } = useFilterStore();

  // Yêu cầu chức năng 1: Lấy danh sách sách khi khởi động app
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks(false));
    }
  }, [dispatch, status]);

  // Handler thử lại tải danh sách sách
  const handleReload = useCallback(() => {
    dispatch(fetchBooks(false));
  }, [dispatch]);

  // Buổi 5 & Yêu cầu kỹ thuật 6: Các handler truyền xuống BookCard được bọc useCallback
  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  // Đếm số lượng sinh viên đang mượn đối với từng cuốn sách (memoized map)
  const borrowedCountMap = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    borrowedBooks.forEach((item: BorrowedBook) => {
      map[item.bookId] = (map[item.bookId] || 0) + 1;
    });
    return map;
  }, [borrowedBooks]);

  // Buổi 5 & Yêu cầu kỹ thuật 6: Danh sách sau khi lọc tính bằng useMemo
  // Tìm kiếm theo tên hoặc tác giả (không phân biệt hoa thường), lọc theo thể loại
  const filteredBooks = useMemo<Book[]>(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return books.filter((book: Book) => {
      // 1. Lọc theo thể loại
      const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;

      // 2. Lọc theo từ khóa tìm kiếm (tên sách hoặc tác giả)
      const matchesKeyword =
        keyword === '' ||
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword);

      return matchesGenre && matchesKeyword;
    });
  }, [books, searchKeyword, selectedGenre]);

  return (
    <main className="main-content">
      {/* Banner giới thiệu */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="icon-mr" />
            Hệ thống quản lý mượn trả sách thông minh
          </div>
          <h1 className="hero-title">Tra cứu & Mượn sách Thư viện Khoa</h1>
          <p className="hero-description">
            Tìm kiếm hàng trăm đầu sách chuyên ngành CNTT, Kinh tế và Ngoại ngữ. Đặt mượn trực tuyến nhanh chóng với hạn mức tối đa 3 cuốn.
          </p>
        </div>
      </section>

      {/* Cảnh báo khi vượt quá hạn mức 3 cuốn */}
      <BorrowWarningAlert />

      {/* Khối sách sinh viên đang mượn */}
      <BorrowedBooksSection onReturnBook={handleReturn} />

      {/* Thanh tìm kiếm & bộ lọc */}
      <SearchBar />

      {/* Xử lý 3 trạng thái của API: Loading, Error, Success */}
      {status === 'loading' && (
        <div className="status-container" data-testid="loading-state">
          <div className="spinner" />
          <p className="status-text">Đang tải danh sách sách từ thư viện...</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="status-container error-state" data-testid="error-state">
          <AlertCircle size={44} className="error-icon" />
          <h3 className="error-heading">Không thể tải danh sách sách</h3>
          <p className="error-message">{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleReload}
          >
            <RefreshCw size={16} className="icon-mr" />
            Thử lại
          </button>
        </div>
      )}

      {status === 'succeeded' && (
        <section className="books-list-section" aria-label="Danh mục sách">
          <div className="list-meta">
            <span className="results-count">
              Tìm thấy <strong>{filteredBooks.length}</strong> cuốn sách phù hợp
            </span>
            {selectedGenre !== 'All' && (
              <span className="current-filter-tag">
                Thể loại: <strong>{selectedGenre}</strong>
              </span>
            )}
          </div>

          {filteredBooks.length === 0 ? (
            <div className="empty-results">
              <BookX size={48} className="empty-icon text-muted" />
              <h3>Không tìm thấy cuốn sách nào</h3>
              <p>Hãy thử tìm kiếm với từ khóa khác hoặc bỏ bớt tiêu chí lọc.</p>
            </div>
          ) : (
            <div className="books-grid">
              {/* Buổi 5 & Yêu cầu kỹ thuật 6: key không dùng index (dùng book.id) */}
              {filteredBooks.map((book: Book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  borrowedCount={borrowedCountMap[book.id] || 0}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
};
