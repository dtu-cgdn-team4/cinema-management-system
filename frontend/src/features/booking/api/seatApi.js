import apiClient from '../../../services/apiClient';

/** Sơ đồ ghế của suất chiếu, kèm phim, giá theo loại ghế và thời gian giữ ghế còn lại. */
export const getSeatMap = (showtimeId) => apiClient.get(`/showtimes/${showtimeId}/seats`);

/** Giữ ghế 10 phút (phải đăng nhập); thay cho các ghế người này đã giữ trước đó trong cùng suất. */
export const holdSeats = (showtimeId, seatIds) => apiClient.post(`/showtimes/${showtimeId}/seats/hold`, { seatIds });
