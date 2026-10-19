/**
 * Buổi 1 — TypeScript nâng cao: Generic, Utility Types, Type Guards
 * Không sử dụng 'any'
 */

// Thể loại sách chuyên ngành
export type Genre = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

// Kiểu dữ liệu một cuốn sách
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  publicationYear: number;
  availableCopies: number;
}

// Kiểu dữ liệu sách đang được sinh viên mượn
export interface BorrowedBook {
  id: string;             // ID phiên mượn
  bookId: string;         // ID cuốn sách
  title: string;
  author: string;
  genre: Genre;
  borrowedAt: string;     // Thời gian mượn ISO string
}

// ==========================================
// 1. GENERIC API RESPONSE TYPES
// ==========================================
export interface ApiResponseSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiResponseError {
  ok: false;
  error: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

// ==========================================
// 2. TYPE GUARDS
// ==========================================
export function isSuccessResponse<T>(res: ApiResponse<T>): res is ApiResponseSuccess<T> {
  return res.ok === true;
}

export function isErrorResponse<T>(res: ApiResponse<T>): res is ApiResponseError {
  return res.ok === false;
}

// ==========================================
// 3. UTILITY TYPES (Dùng ít nhất 2 Utility Type)
// ==========================================

// Utility Type 1: Readonly - bảo vệ object không bị gán đè trực tiếp
export type ReadonlyBook = Readonly<Book>;

// Utility Type 2: Pick - trích xuất các trường tóm tắt của sách
export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'genre'>;

// Utility Type 3: Omit - tạo dữ liệu sách mới khi chưa có ID
export type NewBookInput = Omit<Book, 'id'>;

// Utility Type 4: Record - ánh xạ thể loại sang số lượng sách phục vụ thống kê
export type GenreStatistics = Record<Genre, number>;

// Utility Type 5: Partial - hỗ trợ cập nhật một phần dữ liệu
export type BookUpdatePatch = Partial<Omit<Book, 'id'>>;
