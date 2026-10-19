/**
 * API giả lập trả về Promise với delay 500ms
 * Yêu cầu kỹ thuật 8 & Yêu cầu chức năng 1
 */

import { Book, ApiResponse } from '../types/book.types';

// Dữ liệu sách mẫu ban đầu
export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    genre: 'CNTT',
    publicationYear: 2008,
    availableCopies: 3,
  },
  {
    id: 'b2',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    genre: 'CNTT',
    publicationYear: 1994,
    availableCopies: 1, // Để test trường hợp sắp hết hoặc mượn hết
  },
  {
    id: 'b3',
    title: 'Kinh Tế Học Vi Mô',
    author: 'N. Gregory Mankiw',
    genre: 'Kinh tế',
    publicationYear: 2018,
    availableCopies: 4,
  },
  {
    id: 'b4',
    title: 'Nguyên Lý Tiếp Thị (Principles of Marketing)',
    author: 'Philip Kotler, Gary Armstrong',
    genre: 'Kinh tế',
    publicationYear: 2020,
    availableCopies: 2,
  },
  {
    id: 'b5',
    title: 'English Grammar in Use',
    author: 'Raymond Murphy',
    genre: 'Ngoại ngữ',
    publicationYear: 2019,
    availableCopies: 5,
  },
  {
    id: 'b6',
    title: 'Oxford Collocations Dictionary',
    author: 'Colin McIntosh',
    genre: 'Ngoại ngữ',
    publicationYear: 2017,
    availableCopies: 0, // Đã hết bản để test nút mượn bị vô hiệu hóa
  },
  {
    id: 'b7',
    title: 'Cấu Trúc Dữ Liệu và Giải Thuật',
    author: 'Nguyễn Đức Nghĩa',
    genre: 'CNTT',
    publicationYear: 2015,
    availableCopies: 2,
  },
  {
    id: 'b8',
    title: 'Tài Chính Doanh Nghiệp Hiện Đại',
    author: 'Stephen A. Ross',
    genre: 'Kinh tế',
    publicationYear: 2021,
    availableCopies: 3,
  },
  {
    id: 'b9',
    title: 'Luyện Siêu Trí Nhớ Từ Vựng Tiếng Anh',
    author: 'Nguyễn Anh Đức',
    genre: 'Ngoại ngữ',
    publicationYear: 2016,
    availableCopies: 2,
  },
];

/**
 * Hàm gọi API giả lập lấy danh sách sách
 * @param shouldFail Nếu truyền true sẽ giả lập lỗi API để kiểm thử trạng thái lỗi
 * @returns Promise<ApiResponse<Book[]>>
 */
export const fetchBooksApi = (shouldFail: boolean = false): Promise<ApiResponse<Book[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện. Vui lòng kiểm tra lại kết nối mạng!',
        });
      } else {
        // Deep clone để tránh đột biến trực tiếp mảng gốc
        resolve({
          ok: true,
          data: JSON.parse(JSON.stringify(INITIAL_BOOKS)),
        });
      }
    }, 500);
  });
};
