import { useState, useEffect } from "react";

/**
 * Custom hook để trì hoãn việc cập nhật một giá trị.
 * @param value Giá trị cần trì hoãn (ví dụ: chuỗi tìm kiếm).
 * @param delay Thời gian trì hoãn (tính bằng mili giây).
 * @returns Giá trị đã được trì hoãn.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State để lưu trữ giá trị đã được trì hoãn
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Thiết lập một bộ đếm thời gian (timer)
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Dọn dẹp timer mỗi khi value hoặc delay thay đổi
    // Đây là bước quan trọng nhất để "reset" bộ đếm
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ chạy lại effect này nếu value hoặc delay thay đổi

  return debouncedValue;
}
