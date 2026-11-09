import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingDates } from './bookingDates.js';

const today = new Date(2026, 10, 9);

test('6 ngày liên tiếp khi phim còn chiếu dài ngày', () => {
  const dates = bookingDates({ releaseDate: '2026-11-01', endDate: '2026-12-01' }, today);
  assert.deepEqual(dates, ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14']);
});

test('không vượt ngày kết thúc, không trước ngày khởi chiếu', () => {
  assert.deepEqual(bookingDates({ releaseDate: '2026-11-01', endDate: '2026-11-10' }, today), ['2026-11-09', '2026-11-10']);
  assert.deepEqual(bookingDates({ releaseDate: '2026-11-14', endDate: '2026-12-01' }, today), ['2026-11-14']);
});

test('chưa chọn phim thì không có ngày', () => {
  assert.deepEqual(bookingDates(undefined, today), []);
});
