import React from 'react';
import { Book } from '../types/book.types';
import {
  BookOpen,
  User,
  Tag,
  Calendar,
  Layers,
  CheckCircle2,
  Code2,
  TrendingUp,
  Languages,
  Bookmark,
  Sparkles,
} from 'lucide-react';

interface BookCardProps {
  book: Book;
  borrowedCount: number;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

/**
 * Buổi 5 & Yêu cầu kỹ thuật 6: Component hiển thị 1 cuốn sách được bọc React.memo
 * Được nâng cấp giao diện chuẩn Glassmorphism hiện đại với bìa sách nghệ thuật
 */
export const BookCard: React.FC<BookCardProps> = React.memo(({
  book,
  borrowedCount,
  onBorrow,
  onReturn,
}) => {
  const isOutOfStock = book.availableCopies <= 0;
  const isLowStock = book.availableCopies === 1;

  // Lấy icon và màu nền bìa sách theo thể loại
  const getGenreVisual = () => {
    switch (book.genre) {
      case 'CNTT':
        return {
          icon: <Code2 size={32} className="cover-icon" />,
          code: 'cntt',
          label: 'Công Nghệ Thông Tin',
        };
      case 'Kinh tế':
        return {
          icon: <TrendingUp size={32} className="cover-icon" />,
          code: 'kinh-te',
          label: 'Kinh Tế & Quản Trị',
        };
      case 'Ngoại ngữ':
        return {
          icon: <Languages size={32} className="cover-icon" />,
          code: 'ngoai-ngu',
          label: 'Ngoại Ngữ & Ngôn Ngữ Học',
        };
      default:
        return {
          icon: <Bookmark size={32} className="cover-icon" />,
          code: 'default',
          label: book.genre,
        };
    }
  };

  const visual = getGenreVisual();

  return (
    <div
      className={`book-card ${isOutOfStock ? 'out-of-stock' : ''} ${borrowedCount > 0 ? 'is-borrowing' : ''}`}
      data-testid={`book-card-${book.id}`}
    >
      {/* Khối bìa sách nghệ thuật (Book Visual Cover) */}
      <div className={`book-cover-banner cover-${visual.code}`}>
        <div className="cover-pattern" />
        <div className="cover-icon-wrapper">
          {visual.icon}
        </div>
        <div className="cover-meta-tags">
          <span className="cover-genre-name">{visual.label}</span>
          {isOutOfStock ? (
            <span className="stock-pill stock-empty">Hết bản</span>
          ) : isLowStock ? (
            <span className="stock-pill stock-low">Chỉ còn 1 cuốn</span>
          ) : (
            <span className="stock-pill stock-available">Còn {book.availableCopies} bản</span>
          )}
        </div>
      </div>

      <div className="book-card-body">
        {/* Header thẻ: Thể loại + Năm xuất bản */}
        <div className="book-card-header">
          <span className={`genre-badge genre-${book.genre.toLowerCase().replace(/\s+/g, '-')}`}>
            <Tag size={12} className="icon-mr" />
            {book.genre}
          </span>
          <span className="book-year">
            <Calendar size={12} className="icon-mr" />
            {book.publicationYear}
          </span>
        </div>

        {/* Tên sách */}
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>

        {/* Tác giả */}
        <div className="book-author">
          <User size={14} className="icon-mr" />
          <span>Tác giả: {book.author}</span>
        </div>

        {/* Thông tin số lượng & trạng thái mượn */}
        <div className="book-copies-info">
          <div className="copies-status">
            <Layers size={14} className="icon-mr" />
            <span>Số bản còn lại: </span>
            <strong
              className={`copies-count ${isOutOfStock ? 'text-danger' : isLowStock ? 'text-warning' : 'text-success'}`}
              data-testid={`available-copies-${book.id}`}
            >
              {book.availableCopies}
            </strong>
          </div>

          {borrowedCount > 0 && (
            <div className="borrowed-indicator" data-testid={`borrowed-badge-${book.id}`}>
              <CheckCircle2 size={13} className="icon-mr text-primary" />
              <span>Bạn đang mượn: <strong>{borrowedCount}</strong></span>
            </div>
          )}
        </div>

        {/* Nút hành động Mượn / Trả */}
        <div className="book-card-actions">
          <button
            type="button"
            className={`btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'}`}
            disabled={isOutOfStock}
            onClick={() => onBorrow(book.id)}
            aria-label={`Mượn sách ${book.title}`}
            data-testid={`btn-borrow-${book.id}`}
          >
            <BookOpen size={16} className="icon-mr" />
            {isOutOfStock ? 'Hết sách' : 'Mượn sách'}
          </button>

          {borrowedCount > 0 && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => onReturn(book.id)}
              aria-label={`Trả sách ${book.title}`}
              data-testid={`btn-return-${book.id}`}
            >
              Trả sách
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';
