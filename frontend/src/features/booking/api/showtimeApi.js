import apiClient from '../../../services/apiClient';

/** Phim đang chiếu: hôm nay nằm trong khoảng khởi chiếu – kết thúc. */
export const getShowingMovies = () => apiClient.get('/movies', { params: { status: 'SHOWING' } });

/** Suất chiếu chưa bắt đầu của một phim, đã sắp theo giờ. */
export const getShowtimesByMovie = (movieId) => apiClient.get(`/movies/${movieId}/showtimes`);
