import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateShowtimeSelection as v } from './validateShowtimeSelection.js';

test('báo lỗi theo thứ tự phim, ngày, suất', () => {
  assert.equal(v({}), 'Vui lòng chọn phim');
  assert.equal(v({ movieId: 1 }), 'Vui lòng chọn ngày chiếu');
  assert.equal(v({ movieId: 1, date: '2026-11-05' }), 'Vui lòng chọn suất chiếu');
  assert.equal(v({ movieId: 1, date: '2026-11-05', showtimeId: 7 }), null);
});
