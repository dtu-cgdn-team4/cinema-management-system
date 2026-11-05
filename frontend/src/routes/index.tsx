import { createBrowserRouter, Navigate } from 'react-router-dom';
import RegisterPage from '@/features/auth/pages/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/register" replace />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: (
      <div className="min-h-screen bg-[#0d0e10] text-[#f5f2ed] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
        <p className="text-[#9d9ea5] mb-6">Màn hình Đăng nhập đang được hoàn thiện.</p>
        <a
          href="/register"
          className="px-4 py-2 bg-[#ca3538] hover:bg-[#b22e30] rounded-lg text-sm font-medium transition-colors"
        >
          Trở lại trang Đăng ký
        </a>
      </div>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/register" replace />,
  },
]);

export default router;
