import { INITIAL_MOCK_MOVIES, MOVIE_STATUS } from './mockMoviesData.js';

const STORAGE_KEY = 'cineops_admin_movies_mock_v1';
const USE_MOCK_API = import.meta.env?.VITE_USE_MOCK_API !== 'false';

async function getApiClient() {
  const mod = await import('../../../services/apiClient.js');
  return mod.default;
}

function loadMoviesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_MOVIES));
      return [...INITIAL_MOCK_MOVIES];
    }
    return JSON.parse(raw);
  } catch {
    return [...INITIAL_MOCK_MOVIES];
  }
}

function saveMoviesToStorage(movies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  } catch {
    // Bỏ qua lỗi bộ nhớ trình duyệt nếu ở chế độ ẩn danh hạn chế
  }
}

function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

/**
 * Lấy danh sách phim có phân trang, tìm kiếm theo tên/mã phim, lọc thể loại và trạng thái.
 * Hợp đồng dữ liệu (API Contract) đồng nhất giữa Mock và Backend Spring Boot.
 */
export async function fetchAdminMovies({
  keyword = '',
  genre = 'ALL',
  status = 'ALL',
  page = 1,
  size = 6,
} = {}) {
  if (!USE_MOCK_API) {
    const apiClient = await getApiClient();
    return apiClient.get('/admin/movies', {
      params: { keyword, genre, status, page: page - 1, size },
    });
  }

  await delay(180);
  const allMovies = loadMoviesFromStorage();

  // Thống kê số lượng theo từng tab trạng thái (phục vụ thanh Tab trên giao diện Figma)
  const summaryCounts = {
    ALL: allMovies.length,
    [MOVIE_STATUS.NOW_SHOWING]: allMovies.filter((m) => m.status === MOVIE_STATUS.NOW_SHOWING).length,
    [MOVIE_STATUS.COMING_SOON]: allMovies.filter((m) => m.status === MOVIE_STATUS.COMING_SOON).length,
    [MOVIE_STATUS.STOPPED]: allMovies.filter((m) => m.status === MOVIE_STATUS.STOPPED).length,
  };

  const normalizedQuery = normalizeText(keyword);

  const filtered = allMovies.filter((movie) => {
    const matchesKeyword =
      !normalizedQuery ||
      normalizeText(movie.title).includes(normalizedQuery) ||
      normalizeText(movie.originalTitle).includes(normalizedQuery) ||
      normalizeText(movie.code).includes(normalizedQuery);

    const matchesGenre = genre === 'ALL' || !genre || movie.genres.includes(genre);
    const matchesStatus = status === 'ALL' || !status || movie.status === status;

    return matchesKeyword && matchesGenre && matchesStatus;
  });

  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * size;
  const items = filtered.slice(startIndex, startIndex + size);

  return {
    items,
    page: safePage,
    size,
    totalElements,
    totalPages,
    summaryCounts,
  };
}

/**
 * Xóa mềm phim (Ngừng phát hành):
 * Tuyệt đối không xóa vật lý bản ghi. Chỉ chuyển trạng thái sang STOPPED (Ngừng chiếu).
 */
export async function softDeleteAdminMovie(movieId) {
  if (!USE_MOCK_API) {
    const apiClient = await getApiClient();
    return apiClient.delete(`/admin/movies/${movieId}`);
  }

  await delay(250);
  const allMovies = loadMoviesFromStorage();
  const targetIndex = allMovies.findIndex((m) => m.id === Number(movieId));

  if (targetIndex === -1) {
    throw new Error('Không tìm thấy bộ phim cần ngừng phát hành.');
  }

  const updatedMovie = {
    ...allMovies[targetIndex],
    status: MOVIE_STATUS.STOPPED,
  };

  allMovies[targetIndex] = updatedMovie;
  saveMoviesToStorage(allMovies);

  return updatedMovie;
}

/**
 * Khôi phục bộ dữ liệu mẫu ban đầu (hữu ích khi kiểm thử xóa mềm nhiều lần trên giao diện).
 */
export async function resetAdminMoviesMock() {
  await delay(150);
  saveMoviesToStorage(INITIAL_MOCK_MOVIES);
  return [...INITIAL_MOCK_MOVIES];
}
