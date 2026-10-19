import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from '../BookCard';
import { Book } from '../../types/book.types';

describe('BookCard Component Tests (Yêu cầu kỹ thuật 7)', () => {
  const sampleBook: Book = {
    id: 'book-101',
    title: 'Lập Trình Web Nâng Cao với React & TypeScript',
    author: 'Giảng viên PTIT',
    genre: 'CNTT',
    publicationYear: 2024,
    availableCopies: 3,
  };

  const outOfStockBook: Book = {
    id: 'book-102',
    title: 'Học máy chuyên sâu',
    author: 'TS. Nguyễn Văn A',
    genre: 'CNTT',
    publicationYear: 2023,
    availableCopies: 0,
  };

  // Test 1: Hiển thị đúng thông tin sách
  test('1. Hiển thị đúng thông tin sách (tên sách, tác giả, thể loại, năm XB, số bản còn lại)', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        borrowedCount={0}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    // Kiểm tra tên sách
    expect(
      screen.getByRole('heading', { name: sampleBook.title })
    ).toBeInTheDocument();

    // Kiểm tra tên tác giả
    expect(screen.getByText(/Tác giả: Giảng viên PTIT/i)).toBeInTheDocument();

    // Kiểm tra thể loại
    expect(screen.getByText('CNTT')).toBeInTheDocument();

    // Kiểm tra năm xuất bản
    expect(screen.getByText('2024')).toBeInTheDocument();

    // Kiểm tra số bản còn lại
    const copiesEl = screen.getByTestId('available-copies-book-101');
    expect(copiesEl).toHaveTextContent('3');

    // Nút mượn sách không bị disabled khi còn bản
    const borrowBtn = screen.getByTestId('btn-borrow-book-101');
    expect(borrowBtn).toBeEnabled();
    expect(borrowBtn).toHaveTextContent('Mượn sách');
  });

  // Test 2: Click "Mượn" gọi đúng hàm với đúng id
  test('2. Click vào nút "Mượn" gọi đúng hàm onBorrow với đúng bookId', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        borrowedCount={0}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowBtn = screen.getByTestId('btn-borrow-book-101');
    await user.click(borrowBtn);

    // Kiểm tra callback được gọi đúng 1 lần và truyền đúng id cuốn sách
    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('book-101');
  });

  // Test 3: Nút bị vô hiệu hoá khi sách đã hết bản (availableCopies = 0)
  test('3. Nút "Mượn" bị vô hiệu hoá (disabled) khi sách đã hết bản', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={outOfStockBook}
        borrowedCount={0}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowBtn = screen.getByTestId('btn-borrow-book-102');

    // Nút bị disabled và hiển thị "Hết sách"
    expect(borrowBtn).toBeDisabled();
    expect(borrowBtn).toHaveTextContent('Hết sách');

    // Kiểm tra số bản còn lại hiển thị 0
    expect(screen.getByTestId('available-copies-book-102')).toHaveTextContent('0');
  });

  // Test 4: Khi sinh viên đang mượn, hiển thị nút "Trả sách" và click gọi đúng onReturn
  test('4. Hiển thị nút "Trả sách" khi borrowedCount > 0 và click gọi onReturn với đúng id', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleBook}
        borrowedCount={1}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    // Có huy hiệu đang mượn
    expect(screen.getByTestId('borrowed-badge-book-101')).toHaveTextContent('Bạn đang mượn: 1');

    // Có nút trả sách
    const returnBtn = screen.getByTestId('btn-return-book-101');
    expect(returnBtn).toBeInTheDocument();

    await user.click(returnBtn);
    expect(handleReturn).toHaveBeenCalledTimes(1);
    expect(handleReturn).toHaveBeenCalledWith('book-101');
  });
});
