import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce custom hook tests (Yêu cầu kỹ thuật 7)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Chỉ cập nhật giá trị sau khi đủ thời gian delay đã định (300ms) bằng fake timers', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<string>(value, delay),
      {
        initialProps: { value: 'Clean Code', delay: 300 },
      }
    );

    // Giá trị khởi tạo ban đầu phải bằng giá trị truyền vào
    expect(result.current).toBe('Clean Code');

    // Cập nhật props với giá trị mới
    rerender({ value: 'Design Patterns', delay: 300 });

    // Trước khi hết 300ms (ví dụ mới trôi qua 150ms), giá trị debounced vẫn giữ nguyên giá trị cũ
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('Clean Code');

    // Sau khi advance thêm 150ms (tổng 300ms), giá trị mới được cập nhật
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('Design Patterns');
  });

  test('Hủy timeout cũ khi giá trị thay đổi liên tục trước khi hết thời gian debounce', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<number>(value, delay),
      {
        initialProps: { value: 1, delay: 300 },
      }
    );

    expect(result.current).toBe(1);

    // Thay đổi liên tục giá trị: 2 -> 3 -> 4
    rerender({ value: 2, delay: 300 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 3, delay: 300 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 4, delay: 300 });

    // Vẫn chưa trôi đủ 300ms kể từ lần đổi sang 4
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe(1);

    // Bây giờ cho trôi tiếp 100ms nữa (đủ 300ms kể từ lần đổi giá trị 4)
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe(4);
  });
});
