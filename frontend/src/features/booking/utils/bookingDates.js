import { toDateKey } from '../../../utils/format.js';

const DAYS_SHOWN = 6;

/** Các ngày đặt được: tối đa 6 ngày kể từ hôm nay, nằm trong khoảng chiếu của phim. */
export function bookingDates(movie, today = new Date()) {
  if (!movie) return [];
  const dates = [];
  for (let i = 0; i < DAYS_SHOWN; i += 1) {
    const key = toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
    if (key >= movie.releaseDate && key <= movie.endDate) dates.push(key);
  }
  return dates;
}
