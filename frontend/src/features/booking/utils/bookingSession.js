const KEY = 'bookingSession';
let fallback;

/**
 * Mã phiên trình duyệt gửi kèm khi giữ ghế, để server biết ghế nào là "của bạn".
 * ponytail: tạm thay tài khoản; bỏ khi có đăng nhập (server lấy người dùng từ JWT).
 */
export function getBookingSession() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    fallback ??= crypto.randomUUID();
    return fallback;
  }
}
