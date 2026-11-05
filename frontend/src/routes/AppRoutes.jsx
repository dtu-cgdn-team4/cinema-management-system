import { Navigate, Route, Routes } from 'react-router-dom';
import ShowtimeSelectionPage from '../features/booking/pages/ShowtimeSelectionPage';

// ponytail: chưa chặn đăng nhập (business-rules: phải đăng nhập mới đặt vé); thêm PrivateRoute khi có AuthContext
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dat-ve" replace />} />
      <Route path="/dat-ve" element={<ShowtimeSelectionPage />} />
      <Route
        path="/dat-ve/suat-chieu/:showtimeId/chon-ghe"
        element={<p className="p-10 text-muted">Màn hình chọn ghế: làm ở task 6.2.2.</p>}
      />
    </Routes>
  );
}
