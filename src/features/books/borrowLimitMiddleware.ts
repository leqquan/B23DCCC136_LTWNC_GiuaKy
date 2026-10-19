import { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setBorrowLimitWarning, BooksState } from './booksSlice';

interface MiddlewareState {
  books: BooksState;
}

/**
 * Middleware Redux tự viết kiểm soát giới hạn mượn sách:
 * Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc.
 * Nếu vượt quá, chặn action mượn lại và dispatch cảnh báo.
 */
export const borrowLimitMiddleware: Middleware<{}, MiddlewareState> = (storeAPI) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const state = storeAPI.getState();
    const currentBorrowedCount = state.books.borrowedBooks.length;

    // Giới hạn tối đa 3 cuốn sách cùng lúc
    if (currentBorrowedCount >= 3) {
      storeAPI.dispatch(
        setBorrowLimitWarning('Cảnh báo: Mỗi sinh viên chỉ được mượn tối đa 3 cuốn sách cùng lúc! Vui lòng trả bớt sách trước khi mượn thêm.')
      );
      // Chặn action mượn sách, không chuyển tiếp tới reducer
      return;
    }
  }

  return next(action);
};
