import { configureStore } from '@reduxjs/toolkit';
import booksReducer, { borrowBook, BooksState } from '../booksSlice';
import { borrowLimitMiddleware } from '../borrowLimitMiddleware';
import { Book } from '../../../types/book.types';

describe('borrowLimitMiddleware tests (Yêu cầu kỹ thuật 3 & chức năng 7)', () => {
  const sampleBooks: Book[] = [
    { id: 'b1', title: 'Sách 1', author: 'TG 1', genre: 'CNTT', publicationYear: 2020, availableCopies: 2 },
    { id: 'b2', title: 'Sách 2', author: 'TG 2', genre: 'CNTT', publicationYear: 2021, availableCopies: 2 },
    { id: 'b3', title: 'Sách 3', author: 'TG 3', genre: 'CNTT', publicationYear: 2022, availableCopies: 2 },
    { id: 'b4', title: 'Sách 4', author: 'TG 4', genre: 'CNTT', publicationYear: 2023, availableCopies: 2 },
  ];

  const initialBooksState: BooksState = {
    books: sampleBooks,
    borrowedBooks: [],
    status: 'succeeded',
    error: null,
    warning: null,
  };

  const createTestStore = () => {
    return configureStore({
      reducer: {
        books: booksReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(borrowLimitMiddleware),
      preloadedState: {
        books: initialBooksState,
      },
    });
  };

  test('Cho phép mượn sách nếu số sách đang mượn < 3', () => {
    const store = createTestStore();

    store.dispatch(borrowBook('b1'));
    expect(store.getState().books.borrowedBooks.length).toBe(1);
    expect(store.getState().books.warning).toBeNull();

    store.dispatch(borrowBook('b2'));
    expect(store.getState().books.borrowedBooks.length).toBe(2);
    expect(store.getState().books.warning).toBeNull();

    store.dispatch(borrowBook('b3'));
    expect(store.getState().books.borrowedBooks.length).toBe(3);
    expect(store.getState().books.warning).toBeNull();
  });

  test('Chặn mượn sách và dispatch warning nếu đã mượn tối đa 3 cuốn', () => {
    const store = createTestStore();

    // Mượn 3 cuốn đầu
    store.dispatch(borrowBook('b1'));
    store.dispatch(borrowBook('b2'));
    store.dispatch(borrowBook('b3'));
    expect(store.getState().books.borrowedBooks.length).toBe(3);

    // Cố gắng mượn cuốn thứ 4
    store.dispatch(borrowBook('b4'));

    // Số sách mượn vẫn giữ nguyên là 3 (bị middleware chặn lại)
    expect(store.getState().books.borrowedBooks.length).toBe(3);

    // Xuất hiện cảnh báo
    expect(store.getState().books.warning).toMatch(/Mỗi sinh viên chỉ được mượn tối đa 3 cuốn/i);

    // Sách b4 không bị trừ bản
    const book4 = store.getState().books.books.find((b: Book) => b.id === 'b4');
    expect(book4?.availableCopies).toBe(2);
  });
});
