const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const movieApi = {

  async getMovies({ 
    keyword = '', 
    status = 'ALL', 
    genreName = '', 
    sortBy = 'recommended', 
    page = 0, 
    size = 12 } = {}) {
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    if (status && status !== 'ALL') params.append('status', status);
    if (genreName && genreName !== 'Tất cả thể loại') params.append('genreName', genreName);
    if (sortBy) params.append('sortBy', sortBy);
    params.append('page', page);
    params.append('size', size);

    const response = await fetch(`${API_BASE_URL}/movies?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Lỗi tải danh sách phim: ${response.statusText}`);
    }
    return response.json();
  },

  async getNowShowingMovies() {
    const response = await fetch(`${API_BASE_URL}/movies/now-showing`);
    if (!response.ok) {
      throw new Error(`Lỗi tải phim đang chiếu: ${response.statusText}`);
    }
    return response.json();
  },


  async getComingSoonMovies() {
    const response = await fetch(`${API_BASE_URL}/movies/coming-soon`);
    if (!response.ok) {
      throw new Error(`Lỗi tải phim sắp chiếu: ${response.statusText}`);
    }
    return response.json();
  },

  async getMovieById(id) {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    if (!response.ok) {
      throw new Error(`Lỗi tải chi tiết phim: ${response.statusText}`);
    }
    return response.json();
  },

  async getGenres() {
    const response = await fetch(`${API_BASE_URL}/movies/genres`);
    if (!response.ok) {
      throw new Error(`Lỗi tải danh sách thể loại: ${response.statusText}`);
    }
    return response.json();
  }
};
