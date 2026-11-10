/**
 * Tên tệp: Định tuyến ứng dụng (AppRoutes.jsx)
 * Tên tệp tiếng Việt: Cấu hình định tuyến và điều hướng phân hệ
 * Chức năng: Quản lý các tuyến đường dẫn (routes) của hệ thống:
 * - /admin/movies: Trang danh sách quản lý phim (Task 3)
 * - /admin/movies/create: Trang thêm mới phim (Task 4)
 * - /admin/movies/:id/edit: Trang chỉnh sửa phim (Task 4)
 */
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminMovieFormPage from '../features/admin/pages/AdminMovieFormPage';
import AdminMovieListPage from '../features/admin/pages/AdminMovieListPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Mặc định chuyển hướng người dùng vào trang Quản lý phim */}
      <Route path="/" element={<Navigate to="/admin/movies" replace />} />

      {/* Tuyến đường phân hệ Quản lý phim dành cho Quản trị viên */}
      <Route path="/admin/movies" element={<AdminMovieListPage />} />
      <Route path="/admin/movies/create" element={<AdminMovieFormPage mode="create" />} />
      <Route path="/admin/movies/:id/edit" element={<AdminMovieFormPage mode="edit" />} />

      {/* Bắt tất cả các đường dẫn không hợp lệ khác và chuyển về trang quản lý phim */}
      <Route path="*" element={<Navigate to="/admin/movies" replace />} />
    </Routes>
  );
}
