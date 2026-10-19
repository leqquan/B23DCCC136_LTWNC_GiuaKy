import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearBorrowLimitWarning } from '../features/books/booksSlice';

export const BorrowWarningAlert: React.FC = () => {
  const dispatch = useAppDispatch();
  const warning = useAppSelector((state) => state.books.warning);

  if (!warning) return null;

  return (
    <div className="borrow-warning-alert" role="alert" data-testid="borrow-warning-alert">
      <div className="alert-content">
        <AlertTriangle className="alert-icon text-warning" size={22} />
        <div>
          <strong className="alert-heading">Giới hạn mượn sách:</strong>
          <span className="alert-message">{warning}</span>
        </div>
      </div>
      <button
        type="button"
        className="alert-close-btn"
        onClick={() => dispatch(clearBorrowLimitWarning())}
        aria-label="Đóng cảnh báo"
      >
        <X size={18} />
      </button>
    </div>
  );
};
