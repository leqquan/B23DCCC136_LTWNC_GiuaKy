import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, BorrowedBook, isSuccessResponse } from '../../types/book.types';
import { fetchBooksApi } from '../../api/booksApi';

export interface BooksState {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  warning: string | null;
}

export const initialState: BooksState = {
  books: [],
  borrowedBooks: [],
  status: 'idle',
  error: null,
  warning: null,
};

// createAsyncThunk xử lý gọi API lấy danh sách sách
export const fetchBooks = createAsyncThunk<Book[], boolean | undefined, { rejectValue: string }>(
  'books/fetchBooks',
  async (shouldFail = false, { rejectWithValue }) => {
    const response = await fetchBooksApi(shouldFail);
    if (isSuccessResponse(response)) {
      return response.data;
    } else {
      return rejectWithValue(response.error);
    }
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // Action mượn sách: giảm availableCopies của cuốn sách đi 1 và thêm vào danh sách đang mượn
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const targetBook = state.books.find((b) => b.id === bookId);

      // Chỉ cho phép mượn nếu sách tồn tại và còn bản
      if (targetBook && targetBook.availableCopies > 0) {
        targetBook.availableCopies -= 1;
        state.borrowedBooks.push({
          id: `borrow-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          bookId: targetBook.id,
          title: targetBook.title,
          author: targetBook.author,
          genre: targetBook.genre,
          borrowedAt: new Date().toISOString(),
        });
        state.warning = null; // Xóa cảnh báo nếu mượn hợp lệ
      }
    },
    // Action trả sách: tăng availableCopies của cuốn sách lên 1 và xoá khỏi danh sách đang mượn
    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const targetBook = state.books.find((b) => b.id === bookId);
      if (targetBook) {
        targetBook.availableCopies += 1;
      }

      // Xóa 1 bản sách khỏi danh sách đang mượn
      const index = state.borrowedBooks.findIndex((b) => b.bookId === bookId);
      if (index !== -1) {
        state.borrowedBooks.splice(index, 1);
      }
      state.warning = null;
    },
    // Đặt thông báo cảnh báo (thường được gọi bởi borrowLimitMiddleware)
    setBorrowLimitWarning: (state, action: PayloadAction<string>) => {
      state.warning = action.payload;
    },
    // Xóa cảnh báo
    clearBorrowLimitWarning: (state) => {
      state.warning = null;
    },
  },
  extraReducers: (builder) => {
    // Xử lý đầy đủ 3 trạng thái của createAsyncThunk: pending, fulfilled, rejected
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.books = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Đã có lỗi xảy ra khi tải danh sách sách.';
      });
  },
});

export const {
  borrowBook,
  returnBook,
  setBorrowLimitWarning,
  clearBorrowLimitWarning,
} = booksSlice.actions;

export default booksSlice.reducer;
