import apiClient from '../../../services/apiClient';
import { getBookingSession } from '../utils/bookingSession';

const sessionHeader = () => ({ 'X-Booking-Session': getBookingSession() });

/** Sơ đồ ghế của suất chiếu, kèm phim, giá theo loại ghế và thời gian giữ ghế còn lại. */
export const getSeatMap = (showtimeId) =>
  apiClient.get(`/showtimes/${showtimeId}/seats`, { headers: sessionHeader() });

/** Giữ ghế 10 phút; thay cho các ghế phiên này đã giữ trước đó trong cùng suất. */
export const holdSeats = (showtimeId, seatIds) =>
  apiClient.post(`/showtimes/${showtimeId}/seats/hold`, { seatIds }, { headers: sessionHeader() });
