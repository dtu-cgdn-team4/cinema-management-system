import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { AccountPage, roleHome } from '../features/auth/pages/AccountPage';
import type { User } from '../features/auth/types';

function Protected({ roles, children }: { roles: User['role'][]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <main className="p-12"><h1 className="text-2xl">Bạn không có quyền truy cập trang này.</h1><a className="text-red-400" href={roleHome(user.role)}>Về tài khoản của bạn</a></main>;
  return <>{children}</>;
}
export function AppRoutes() {
  const { user, ready } = useAuth();
  if (!ready) return <p role="status" className="p-8">Đang kiểm tra phiên đăng nhập…</p>;
  const home = user ? roleHome(user.role) : '/login';
  return <Routes>
    <Route path="/login" element={user ? <Navigate to={home} replace /> : <LoginPage />} />
    <Route path="/account" element={<Protected roles={['ROLE_USER']}><AccountPage area="user" /></Protected>} />
    <Route path="/staff" element={<Protected roles={['ROLE_ADMIN', 'ROLE_STAFF']}><AccountPage area="staff" /></Protected>} />
    <Route path="/admin" element={<Protected roles={['ROLE_ADMIN']}><AccountPage area="admin" /></Protected>} />
    <Route path="*" element={<Navigate to={home} replace />} />
  </Routes>;
}
