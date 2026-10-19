import React from 'react';
import { Book } from '../types/book.types';
import { BookOpen, User, Tag, Calendar, Layers, CheckCircle2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  borrowedCount: number;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

/**
 * Buổi 5 & Yêu cầu kỹ thuật 6: Component hiển thị 1 cuốn sách được bọc React.memo
 * Giúp tránh re-render khi các item khác trong danh sách thay đổi state
 */
export const BookCard: React.FC<BookCardProps> = React.memo(({
  book,
  borrowedCount,
  onBorrow,
  onReturn,
}) => {
  const isOutOfStock = book.availableCopies <= 0;

  return (
    <div
      className={`book-card ${isOutOfStock ? 'out-of-stock' : ''}`}
      data-testid={`book-card-${book.id}`}
    >
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

      <h3 className="book-title" title={book.title}>
        {book.title}
      </h3>

      <div className="book-author">
        <User size={14} className="icon-mr" />
        <span>Tác giả: {book.author}</span>
      </div>

      <div className="book-copies-info">
        <div className="copies-status">
          <Layers size={14} className="icon-mr" />
          <span>Số bản còn lại: </span>
          <strong
            className={`copies-count ${isOutOfStock ? 'text-danger' : 'text-success'}`}
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

      <div className="book-card-actions">
        {/* Nút mượn sách: vô hiệu hóa khi hết bản (availableCopies = 0) */}
        <button
          type="button"
          className="btn btn-primary"
          disabled={isOutOfStock}
          onClick={() => onBorrow(book.id)}
          aria-label={`Mượn sách ${book.title}`}
          data-testid={`btn-borrow-${book.id}`}
        >
          <BookOpen size={16} className="icon-mr" />
          {isOutOfStock ? 'Hết sách' : 'Mượn sách'}
        </button>

        {/* Nút trả sách: hiển thị khi sinh viên đang mượn cuốn này */}
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
  );
});

BookCard.displayName = 'BookCard';
