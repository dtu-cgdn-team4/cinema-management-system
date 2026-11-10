/**
 * Tên tệp: Kiểm thử đơn vị API quản lý phim (adminMovieApi.test.js)
 * Tên tệp tiếng Việt: Kiểm thử tự động API quản lý phim và xóa mềm
 * Chức năng: Kiểm thử tự động toàn bộ 4 kịch bản cốt lõi của Task 3:
 * 1. Phân trang 6 phim/trang và đếm số lượng theo 4 tab trạng thái.
 * 2. Tìm kiếm theo tên phim tiếng Việt không dấu và mã định danh PHxxx.
 * 3. Lọc kết hợp thể loại và trạng thái phát hành.
 * 4. Cơ chế xóa mềm chuyển trạng thái STOPPED, bảo toàn số lượng bản ghi.
 */
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

describe('adminMovieApi - Quản lý danh sách phim & Xóa mềm (Task 3 - Galaxy Cinema)', () => {
  beforeEach(async () => {
    memoryStorage.clear();
    await resetAdminMoviesMock();
  });

  it('trả về danh sách phim phân trang mặc định 6 phim/trang và thống kê đúng số lượng từng tab', async () => {
    const res = await fetchAdminMovies({ page: 1, size: 6 });
    assert.equal(res.items.length, 6);
    assert.equal(res.totalElements, 8);
    assert.equal(res.totalPages, 2);
    assert.equal(res.summaryCounts.ALL, 8);
    assert.equal(res.summaryCounts[MOVIE_STATUS.NOW_SHOWING], 4);
    assert.equal(res.summaryCounts[MOVIE_STATUS.COMING_SOON], 2);
    assert.equal(res.summaryCounts[MOVIE_STATUS.STOPPED], 2);
  });

  it('tìm kiếm chính xác theo tên phim tiếng Việt không dấu hoặc mã phim', async () => {
    const byName = await fetchAdminMovies({ keyword: 'hanh tinh cat', page: 1, size: 6 });
    assert.equal(byName.totalElements, 1);
    assert.equal(byName.items[0].code, 'PH002');

    const byCode = await fetchAdminMovies({ keyword: 'PH004', page: 1, size: 6 });
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
    assert.equal(res.totalElements, 1);
    assert.equal(res.items[0].code, 'PH003');
    assert.ok(res.items.every((m) => m.genres.includes('Hoạt hình')));
    assert.ok(res.items.every((m) => m.status === MOVIE_STATUS.NOW_SHOWING));
  });

  it('xóa mềm (softDeleteAdminMovie) chuyển trạng thái sang STOPPED và giữ nguyên tổng số bản ghi', async () => {
    const updated = await softDeleteAdminMovie(1);
    assert.equal(updated.id, 1);
    assert.equal(updated.status, MOVIE_STATUS.STOPPED);

    const afterDelete = await fetchAdminMovies({ page: 1, size: 6 });
    assert.equal(afterDelete.totalElements, 8);
    assert.equal(afterDelete.summaryCounts[MOVIE_STATUS.STOPPED], 3);
    assert.equal(afterDelete.summaryCounts[MOVIE_STATUS.NOW_SHOWING], 3);
  });
});
