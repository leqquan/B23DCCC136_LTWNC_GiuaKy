# Mini Library — Ứng dụng Quản lý & Mượn/Trả Sách Thư viện Khoa

Dự án bài thi / bài tập lớn giữa kỳ học phần **Lập trình Web Nâng Cao (LTWNC)**.

---

## 🌟 Tổng Quan & Mục Tiêu Kỹ Thuật Đã Đạt Được

| Buổi học | Nội dung vận dụng | Vị trí triển khai trong Code |
| :--- | :--- | :--- |
| **Buổi 1** | **TypeScript nâng cao** (Generic, Utility Types, Type Guards, Strict Typing, Không dùng `any`) | [`src/types/book.types.ts`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/types/book.types.ts) |
| **Buổi 2** | **Design Pattern React & Custom Hook nâng cao** (Generic `useDebounce<T>`) | [`src/hooks/useDebounce.ts`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/hooks/useDebounce.ts) |
| **Buổi 3** | **Redux Toolkit + TypeScript** (Feature-based structure, `createSlice`, `createAsyncThunk` đủ 3 trạng thái, typed hooks `useAppSelector`/`useAppDispatch`) | [`src/features/books/booksSlice.ts`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/features/books/booksSlice.ts), [`src/app/store.ts`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/app/store.ts) |
| **Buổi 4** | **Zustand, Context nâng cao, Middleware Redux** (Zustand cho bộ lọc, Theme Context có `useMemo` & `useTheme`, Middleware chặn mượn quá 3 cuốn) | [`src/stores/filterStore.ts`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/stores/filterStore.ts), [`src/contexts/ThemeContext.tsx`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/contexts/ThemeContext.tsx), [`src/features/books/borrowLimitMiddleware.ts`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/features/books/borrowLimitMiddleware.ts) |
| **Buổi 5** | **Tối ưu hiệu năng** (`React.memo`, `useMemo`, `useCallback`, key không dùng index, Lazy load với `React.lazy + Suspense`) | [`src/features/books/BooksPage.tsx`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/features/books/BooksPage.tsx), [`src/components/BookCard.tsx`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/components/BookCard.tsx), [`src/App.tsx`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/App.tsx) |
| **Buổi 6** | **Kiểm thử Jest + React Testing Library** (15 tests PASS: Reducer, Component with userEvent, Fake Timers cho useDebounce, Middleware) | [`src/features/books/__tests__/`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/features/books/__tests__), [`src/components/__tests__/`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/components/__tests__), [`src/hooks/__tests__/`](file:///d:/B23DCCC136__LTWNC_GiuaKy/src/hooks/__tests__) |

---

## 📁 Cấu Trúc Thư Mục Dự Án (Feature-based)

```text
d:\B23DCCC136__LTWNC_GiuaKy/
├── src/
│   ├── api/
│   │   └── booksApi.ts               # API giả lập Promise, delay 500ms, hỗ trợ tham số shouldFail
│   ├── app/
│   │   ├── hooks.ts                  # Typed hooks: useAppDispatch, useAppSelector
│   │   └── store.ts                  # Cấu hình Redux store tích hợp middleware
│   ├── components/
│   │   ├── BookCard.tsx              # Component hiển thị 1 cuốn sách bọc React.memo
│   │   ├── BorrowedBooksSection.tsx  # Danh sách trực quan các sách sinh viên đang mượn
│   │   ├── BorrowWarningAlert.tsx    # Banner cảnh báo khi chạm giới hạn 3 cuốn
│   │   ├── Navbar.tsx                # Header điều hướng, badge đếm sách, nút đổi Theme
│   │   ├── SearchBar.tsx             # Ô tìm kiếm với debounce 300ms + lọc thể loại (Zustand)
│   │   └── __tests__/
│   │       └── BookCard.test.tsx     # 4 test cases React Testing Library + userEvent
│   ├── contexts/
│   │   └── ThemeContext.tsx          # Theme Context Sáng/Tối, useMemo cho value & useTheme
│   ├── features/
│   │   ├── books/
│   │   │   ├── booksSlice.ts         # createSlice, createAsyncThunk đủ 3 trạng thái
│   │   │   ├── borrowLimitMiddleware.ts # Redux Middleware chặn mượn vượt quá 3 cuốn
│   │   │   ├── BooksPage.tsx         # Trang chính (useMemo lọc sách, useCallback handler)
│   │   │   └── __tests__/
│   │   │       ├── booksSlice.test.ts # 7 test cases cho reducer
│   │   │       └── borrowLimitMiddleware.test.ts # 2 test cases cho middleware
│   │   └── stats/
│   │       └── StatsPage.tsx         # Trang Thống kê (route /stats), lazy-loaded
│   ├── hooks/
│   │   ├── useDebounce.ts            # Custom hook generic useDebounce<T>
│   │   └── __tests__/
│   │       └── useDebounce.test.ts   # 2 test cases dùng Jest fake timers
│   ├── stores/
│   │   └── filterStore.ts            # Zustand store quản lý từ khóa & thể loại
│   ├── types/
│   │   └── book.types.ts             # Generic ApiResponse, Type Guards, 5 Utility Types
│   ├── App.tsx                       # React Router & React.lazy + Suspense cho StatsPage
│   ├── index.css                     # Design system Vanilla CSS (Dark/Light mode, Glassmorphism)
│   ├── main.tsx                      # Entry point bọc Redux Provider & ThemeProvider
│   └── setupTests.ts                 # Cấu hình Jest DOM matchers
├── babel.config.cjs                  # Cấu hình Babel transform cho Jest (TSX/TS)
├── jest.config.cjs                   # Cấu hình Jest (jsdom, babel-jest, cacheDirectory)
├── package.json                      # Cấu hình dependencies và npm scripts
└── tsconfig.app.json                 # TypeScript strict configuration
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Chạy Môi Trường Phát Triển (Dev Server)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173/`

### 3. Chạy Toàn Bộ Unit Test (Jest + React Testing Library)
```bash
npm test
```
*Kết quả: 4 Test Suites, 15 Tests đều chạy xanh (`PASS 100%`).*

### 4. Build Bản Production
```bash
npm run build
```
*Output: Mã nguồn được tối ưu và trang `StatsPage` tự động được tách thành chunk riêng (`StatsPage-*.js`) phục vụ lazy loading.*
