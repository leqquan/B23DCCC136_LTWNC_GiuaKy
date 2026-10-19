import booksReducer, {
  initialState,
  borrowBook,
  returnBook,
  setBorrowLimitWarning,
  clearBorrowLimitWarning,
  fetchBooks,
  BooksState,
} from '../booksSlice';
import { Book } from '../../../types/book.types';

describe('booksSlice reducer tests (Yêu cầu kỹ thuật 7)', () => {
  const mockBook1: Book = {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'CNTT',
    publicationYear: 2008,
    availableCopies: 2,
  };

  const mockBookOutOfStock: Book = {
    id: 'b2',
    title: 'Kinh Tế Vi Mô',
    author: 'Mankiw',
    genre: 'Kinh tế',
    publicationYear: 2018,
    availableCopies: 0,
  };

  // Test 1: Kiểm tra initial state
  test('1. Trả về initial state mặc định khi action không xác định', () => {
    const state = booksReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
    expect(state.books).toEqual([]);
    expect(state.borrowedBooks).toEqual([]);
    expect(state.status).toBe('idle');
  });

  // Test 2: fetchBooks.pending & fulfilled
  test('2. Cập nhật status loading khi fetchBooks.pending và succeeded khi fulfilled', () => {
    const loadingState = booksReducer(initialState, fetchBooks.pending('', false));
    expect(loadingState.status).toBe('loading');
    expect(loadingState.error).toBeNull();

    const booksList = [mockBook1, mockBookOutOfStock];
    const fulfilledState = booksReducer(
      loadingState,
      fetchBooks.fulfilled(booksList, '', false)
    );
    expect(fulfilledState.status).toBe('succeeded');
    expect(fulfilledState.books).toEqual(booksList);
    expect(fulfilledState.books.length).toBe(2);
  });

  // Test 3: fetchBooks.rejected
  test('3. Cập nhật status failed và error message khi fetchBooks.rejected', () => {
    const errorMessage = 'Lỗi kết nối máy chủ';
    const rejectedAction = {
      type: fetchBooks.rejected.type,
      payload: errorMessage,
    };
    const state = booksReducer(initialState, rejectedAction);
    expect(state.status).toBe('failed');
    expect(state.error).toBe(errorMessage);
  });

  // Test 4: borrowBook thành công
  test('4. borrowBook: giảm availableCopies của cuốn sách đi 1 và thêm vào borrowedBooks', () => {
    const populatedState: BooksState = {
      ...initialState,
      books: [{ ...mockBook1 }],
    };

    const nextState = booksReducer(populatedState, borrowBook('b1'));

    // Số bản còn lại giảm từ 2 xuống 1
    const updatedBook = nextState.books.find((b) => b.id === 'b1');
    expect(updatedBook?.availableCopies).toBe(1);

    // Danh sách sách đang mượn có thêm 1 cuốn
    expect(nextState.borrowedBooks.length).toBe(1);
    expect(nextState.borrowedBooks[0].bookId).toBe('b1');
    expect(nextState.borrowedBooks[0].title).toBe('Clean Code');
  });

  // Test 5: borrowBook không giảm khi sách đã hết bản (availableCopies = 0)
  test('5. borrowBook: không cho mượn nếu availableCopies = 0', () => {
    const populatedState: BooksState = {
      ...initialState,
      books: [{ ...mockBookOutOfStock }],
    };

    const nextState = booksReducer(populatedState, borrowBook('b2'));

    const updatedBook = nextState.books.find((b) => b.id === 'b2');
    expect(updatedBook?.availableCopies).toBe(0);
    expect(nextState.borrowedBooks.length).toBe(0);
  });

  // Test 6: returnBook thành công
  test('6. returnBook: tăng availableCopies lên 1 và xoá khỏi borrowedBooks', () => {
    const populatedState: BooksState = {
      ...initialState,
      books: [{ ...mockBook1, availableCopies: 1 }],
      borrowedBooks: [
        {
          id: 'borrow-1',
          bookId: 'b1',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          genre: 'CNTT',
          borrowedAt: new Date().toISOString(),
        },
      ],
    };

    const nextState = booksReducer(populatedState, returnBook('b1'));

    // Số bản tăng từ 1 lên 2
    const updatedBook = nextState.books.find((b) => b.id === 'b1');
    expect(updatedBook?.availableCopies).toBe(2);

    // Danh sách đang mượn đã bị xóa
    expect(nextState.borrowedBooks.length).toBe(0);
  });

  // Test 7: setBorrowLimitWarning và clearBorrowLimitWarning
  test('7. setBorrowLimitWarning và clearBorrowLimitWarning hoạt động đúng', () => {
    const warningMsg = 'Đã đạt giới hạn tối đa 3 cuốn';
    const stateWithWarning = booksReducer(initialState, setBorrowLimitWarning(warningMsg));
    expect(stateWithWarning.warning).toBe(warningMsg);

    const clearedState = booksReducer(stateWithWarning, clearBorrowLimitWarning());
    expect(clearedState.warning).toBeNull();
  });
});
