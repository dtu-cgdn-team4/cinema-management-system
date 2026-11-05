/** Thông báo theo SRS 6.2.1 khi bấm Đặt vé (SRS viết "xuất chiếu", sửa chính tả). Trả null nếu hợp lệ. */
export function validateShowtimeSelection({ movieId, date, showtimeId }) {
  if (!movieId) return 'Vui lòng chọn phim';
  if (!date) return 'Vui lòng chọn ngày chiếu';
  if (!showtimeId) return 'Vui lòng chọn suất chiếu';
  return null;
}
