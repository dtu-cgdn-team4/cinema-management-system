import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api, { errorMessage } from '../../../services/api';
import type { User } from '../types';

export const roleHome = (role: User['role']) => role === 'ROLE_ADMIN' ? '/admin' : role === 'ROLE_STAFF' ? '/staff' : '/account';
const labels = { ROLE_ADMIN: 'Quản trị viên', ROLE_STAFF: 'Nhân viên', ROLE_USER: 'Khách hàng' };
export function AccountPage({ area }: { area: 'admin' | 'staff' | 'user' }) {
  const { user, logout } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setConfirmed(false); setError('');
    api.get<User>(`/${area}/session`).then(() => { if (active) setConfirmed(true); })
      .catch(e => { if (active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, [area]);
  return <main className="min-h-screen flex items-center justify-center p-6">
    <section className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-8 space-y-5">
      <p className="text-xs tracking-widest text-red-400">GALAXY CINEMA</p>
      <h1 className="text-3xl font-bold">Xin chào, {user?.fullName}</h1>
      <p className="text-slate-300">{user?.email}</p>
      <p>Vai trò: {user && labels[user.role]}</p>
      <p role="status" className="text-sm text-slate-400">{confirmed ? 'Bạn đã đăng nhập và được xác nhận quyền truy cập.' : error ? 'Chưa xác nhận được quyền truy cập.' : 'Đang xác nhận quyền truy cập…'}</p>
      {error && <p role="alert" className="text-red-400">{error}</p>}
      <button className="rounded-xl bg-red-600 px-6 py-3 disabled:opacity-50" disabled={busy} onClick={async () => {
        setBusy(true); try { await logout(); } catch { /* Local session is cleared even if the network is unavailable. */ } finally { setBusy(false); }
      }}>{busy ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>
    </section>
  </main>;
}
