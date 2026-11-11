import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import CustomerLayout from '@/layouts/CustomerLayout';
import MovieListPage from '@/features/movies/pages/MovieListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: (
          <div className="py-20 text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-white">Trang chủ</h2>
            <p className="text-sm text-slate-400">
              Tính năng đang được phát triển theo kế hoạch dự án.
            </p>
          </div>
        ),
      },
      {
        path: 'movies',
        element: <MovieListPage />,
      },
      {
        path: 'cinemas',
        element: (
          <div className="py-20 text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-white">Rạp & Giá Vé</h2>
            <p className="text-sm text-slate-400">
              Thông tin cụm rạp Galaxy Cinema và bảng giá vé các ngày trong tuần.
            </p>
          </div>
        ),
      },
      {
        path: 'promotions',
        element: (
          <div className="py-20 text-center max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-white">Chương Trình Ưu Đãi</h2>
            <p className="text-sm text-slate-400">
              Các khuyến mãi đặc biệt dành cho thành viên Galaxy Cinema.
            </p>
          </div>
        ),
      },
      {
        path: '*',
        element: (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <h2 className="text-4xl font-extrabold text-galaxy-red">404</h2>
            <p className="text-base font-semibold text-white">Trang không tồn tại</p>
            <p className="text-xs text-slate-400">
              Đường dẫn bạn yêu cầu không tìm thấy hoặc đã được di chuyển.
            </p>
            <div>
              <a
                href="/home"
                className="inline-block px-5 py-2 rounded-lg text-xs font-semibold text-white bg-galaxy-red hover:bg-galaxy-red/80 transition-colors"
              >
                Về trang danh sách phim
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
]);
