import React from 'react';
import { BookOpenCheck, RotateCcw, Clock, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { returnBook } from '../features/books/booksSlice';
import { BorrowedBook } from '../types/book.types';

interface BorrowedBooksSectionProps {
  onReturnBook?: (bookId: string) => void;
}

export const BorrowedBooksSection: React.FC<BorrowedBooksSectionProps> = ({ onReturnBook }) => {
  const dispatch = useAppDispatch();
  const borrowedBooks = useAppSelector((state) => state.books.borrowedBooks);

  const handleReturn = (bookId: string) => {
    if (onReturnBook) {
      onReturnBook(bookId);
    } else {
      dispatch(returnBook(bookId));
    }
  };

  if (borrowedBooks.length === 0) {
    return null;
  }

  return (
    <section className="borrowed-section" aria-label="Sách đang mượn">
      <div className="section-header">
        <div className="section-title-group">
          <BookOpenCheck className="section-icon" size={22} />
          <h2>Sách bạn đang mượn ({borrowedBooks.length}/3 cuốn)</h2>
        </div>
        <span className="section-subtitle">
          Mỗi sinh viên được mượn tối đa 3 cuốn cùng lúc. Hãy trả sách khi đọc xong.
        </span>
      </div>

      <div className="borrowed-grid">
        {borrowedBooks.map((item: BorrowedBook) => (
          <div key={item.id} className="borrowed-card">
            <div className="borrowed-card-content">
              <span className={`genre-badge genre-${item.genre.toLowerCase().replace(/\s+/g, '-')}`}>
                <Tag size={12} className="icon-mr" />
                {item.genre}
              </span>
              <h4 className="borrowed-title">{item.title}</h4>
              <p className="borrowed-author">Tác giả: {item.author}</p>
              <div className="borrowed-time">
                <Clock size={13} className="icon-mr" />
                <span>Mượn lúc: {new Date(item.borrowedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleReturn(item.bookId)}
              data-testid={`btn-return-section-${item.bookId}`}
            >
              <RotateCcw size={14} className="icon-mr" />
              Trả sách
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
