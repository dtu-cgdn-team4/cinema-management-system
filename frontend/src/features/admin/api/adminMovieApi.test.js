import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import {
  fetchAdminMovies,
  resetAdminMoviesMock,
  softDeleteAdminMovie,
} from './adminMovieApi.js';
import { MOVIE_STATUS } from './mockMoviesData.js';

// Giả lập localStorage trên môi trường Node.js phục vụ kiểm thử tự động
const memoryStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => (memoryStorage.has(key) ? memoryStorage.get(key) : null),
  setItem: (key, value) => memoryStorage.set(key, String(value)),
  removeItem: (key) => memoryStorage.delete(key),
  clear: () => memoryStorage.clear(),
};

describe('adminMovieApi - Quản lý danh sách phim & Xóa mềm (Task 3)', () => {
  beforeEach(async () => {
    memoryStorage.clear();
    await resetAdminMoviesMock();
  });

  it('trả về danh sách phim phân trang mặc định 6 phim/trang và thống kê đúng số lượng từng tab', async () => {
    const res = await fetchAdminMovies({ page: 1, size: 6 });
    assert.equal(res.items.length, 6);
    assert.equal(res.totalElements, 12);
    assert.equal(res.totalPages, 2);
    assert.equal(res.summaryCounts.ALL, 12);
    assert.equal(res.summaryCounts[MOVIE_STATUS.NOW_SHOWING], 6);
    assert.equal(res.summaryCounts[MOVIE_STATUS.COMING_SOON], 3);
    assert.equal(res.summaryCounts[MOVIE_STATUS.STOPPED], 3);
  });

  it('tìm kiếm chính xác theo tên phim tiếng Việt không dấu hoặc mã phim', async () => {
    const byName = await fetchAdminMovies({ keyword: 'hanh tinh cat', page: 1, size: 6 });
    assert.equal(byName.totalElements, 1);
    assert.equal(byName.items[0].code, 'PH-102');

    const byCode = await fetchAdminMovies({ keyword: 'PH-104', page: 1, size: 6 });
    assert.equal(byCode.totalElements, 1);
    assert.equal(byCode.items[0].title, 'Kẻ trộm mặt trăng 4');
  });

  it('lọc chính xác theo thể loại và trạng thái phim', async () => {
    const res = await fetchAdminMovies({
      genre: 'Hoạt hình',
      status: MOVIE_STATUS.NOW_SHOWING,
      page: 1,
      size: 10,
    });
    assert.equal(res.totalElements, 2);
    assert.ok(res.items.every((m) => m.genres.includes('Hoạt hình')));
    assert.ok(res.items.every((m) => m.status === MOVIE_STATUS.NOW_SHOWING));
  });

  it('xóa mềm (softDeleteAdminMovie) chuyển trạng thái sang STOPPED và giữ nguyên tổng số bản ghi', async () => {
    const updated = await softDeleteAdminMovie(101);
    assert.equal(updated.id, 101);
    assert.equal(updated.status, MOVIE_STATUS.STOPPED);

    const afterDelete = await fetchAdminMovies({ page: 1, size: 6 });
    assert.equal(afterDelete.totalElements, 12);
    assert.equal(afterDelete.summaryCounts[MOVIE_STATUS.STOPPED], 4);
    assert.equal(afterDelete.summaryCounts[MOVIE_STATUS.NOW_SHOWING], 5);
  });
});
