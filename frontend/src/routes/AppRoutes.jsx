import { Navigate, Route, Routes } from 'react-router-dom';
import AdminMovieListPage from '../features/admin/pages/AdminMovieListPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/movies" replace />} />
      <Route path="/admin/movies" element={<AdminMovieListPage />} />
      <Route path="*" element={<Navigate to="/admin/movies" replace />} />
    </Routes>
  );
}
