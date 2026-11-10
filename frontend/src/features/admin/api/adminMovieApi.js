/**
 * Tên tệp: API quản lý phim dành cho quản trị viên (adminMovieApi.js)
 * Tên tệp tiếng Việt: API quản lý phim và xóa mềm
 * Chức năng: Cung cấp các hàm tương tác dữ liệu phim (lấy danh sách phân trang,
 * tìm kiếm, lọc thể loại/trạng thái, chi tiết, thêm mới, cập nhật và xóa mềm).
 * Hỗ trợ chuyển đổi mượt mà giữa API Mock (LocalStorage) và REST API Backend Spring Boot.
 */
import { INITIAL_MOCK_MOVIES, MOVIE_STATUS } from './mockMoviesData.js';

// Khóa lưu trữ cục bộ cho dữ liệu giả lập trên trình duyệt
const STORAGE_KEY = 'galaxy_admin_movies_mock_v2';

// Cờ cấu hình: bật API Mock khi chưa có Backend hoặc chạy kiểm thử đơn vị
const USE_MOCK_API = import.meta.env?.VITE_USE_MOCK_API !== 'false';

// Hàm nạp động apiClient để tránh lỗi vòng lặp phụ thuộc khi chạy kiểm thử
async function getApiClient() {
  const mod = await import('../../../services/apiClient.js');
  return mod.default;
}

// Đọc danh sách phim từ LocalStorage; nếu chưa có thì khởi tạo từ bộ dữ liệu mẫu
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

// Lưu danh sách phim mới nhất vào LocalStorage
function saveMoviesToStorage(movies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  } catch {
    // Bỏ qua lỗi bộ nhớ trình duyệt nếu ở chế độ ẩn danh hạn chế
  }
}

// Tạo độ trễ nhân tạo mô phỏng thời gian phản hồi mạng thực tế
function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Chuẩn hóa chuỗi văn bản tiếng Việt: chuyển chữ thường, bỏ dấu thanh để tìm kiếm không dấu
function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

/**
 * 1. Lấy danh sách phim có phân trang, tìm kiếm và lọc điều kiện
 * @param {string} keyword - Từ khóa tìm kiếm theo tên phim, tên gốc, hãng sản xuất hoặc mã phim
 * @param {string} genre - Thể loại phim cần lọc (hoặc 'ALL' nếu lấy tất cả)
 * @param {string} status - Trạng thái phim: NOW_SHOWING, COMING_SOON, STOPPED (hoặc 'ALL')
 * @param {number} page - Số trang hiện tại (bắt đầu từ 1)
 * @param {number} size - Số lượng phim trên mỗi trang (mặc định 6 dòng/trang theo Figma)
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

  // Thống kê số lượng theo từng tab trạng thái
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
      normalizeText(movie.code).includes(normalizedQuery) ||
      normalizeText(movie.studio).includes(normalizedQuery);

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
 * Lấy chi tiết một bộ phim theo ID
 */
/**
 * 2. Lấy thông tin chi tiết một bộ phim theo ID
 * @param {number|string} movieId - Mã định danh của phim
 */
export async function getAdminMovieById(movieId) {
  if (!USE_MOCK_API) {
    const apiClient = await getApiClient();
    return apiClient.get(`/admin/movies/${movieId}`);
  }

  await delay(150);
  const allMovies = loadMoviesFromStorage();
  const movie = allMovies.find((m) => m.id === Number(movieId));
  if (!movie) {
    throw new Error('Không tìm thấy thông tin bộ phim.');
  }
  return movie;
}

/**
 * 3. Xóa mềm phim (Ngừng phát hành) - Tiêu chuẩn nghiệp vụ Task 3:
 * Tuyệt đối không xóa vật lý bản ghi bằng lệnh DELETE.
 * Thao tác này chỉ chuyển trạng thái sang STOPPED (Ngừng chiếu, giá trị 0 hoặc 2)
 * để bảo toàn toàn vẹn dữ liệu lịch sử đặt vé theo đúng ERD và yêu cầu dự án.
 * @param {number|string} movieId - Mã phim cần ngừng chiếu
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
 * 4. Thêm mới phim (Task 4 - Sprint 1)
 * Tự động sinh mã định dạng PHxxx và gán giá trị mặc định cho phim mới.
 * @param {object} movieData - Dữ liệu biểu mẫu tạo mới phim
 */
export async function createAdminMovie(movieData) {
  if (!USE_MOCK_API) {
    const apiClient = await getApiClient();
    return apiClient.post('/admin/movies', movieData);
  }

  await delay(250);
  const allMovies = loadMoviesFromStorage();
  const newId = Math.max(0, ...allMovies.map((m) => m.id)) + 1;
  const newCode = `PH${String(newId).padStart(3, '0')}`;

  const newMovie = {
    id: newId,
    code: newCode,
    totalShowtimes: 0,
    hasBookings: false,
    formats: ['2D'],
    ...movieData,
  };

  const updated = [newMovie, ...allMovies];
  saveMoviesToStorage(updated);
  return newMovie;
}

/**
 * 5. Cập nhật thông tin phim (Task 4 - Sprint 1)
 * Khi phim đã có vé đặt (hasBookings: true), chỉ cho phép cập nhật trạng thái phát hành.
 * @param {number|string} movieId - Mã định danh phim cần cập nhật
 * @param {object} updateData - Dữ liệu các trường cần cập nhật
 */
export async function updateAdminMovie(movieId, updateData) {
  if (!USE_MOCK_API) {
    const apiClient = await getApiClient();
    return apiClient.put(`/admin/movies/${movieId}`, updateData);
  }

  await delay(250);
  const allMovies = loadMoviesFromStorage();
  const index = allMovies.findIndex((m) => m.id === Number(movieId));
  if (index === -1) {
    throw new Error('Không tìm thấy bộ phim cần chỉnh sửa.');
  }

  const updatedMovie = {
    ...allMovies[index],
    ...updateData,
  };

  allMovies[index] = updatedMovie;
  saveMoviesToStorage(allMovies);
  return updatedMovie;
}

/**
 * 6. Khôi phục dữ liệu mẫu ban đầu về trạng thái 8 phim gốc của Figma
 */
export async function resetAdminMoviesMock() {
  await delay(150);
  saveMoviesToStorage(INITIAL_MOCK_MOVIES);
  return [...INITIAL_MOCK_MOVIES];
}
