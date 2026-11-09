import { useEffect, useMemo, useState } from 'react';
import { Timer } from 'lucide-react';

/** Đếm ngược thời gian giữ ghế; `seconds` lấy từ server nên không lệ thuộc giờ máy khách. */
export default function HoldCountdown({ seconds, onExpire }) {
  const deadline = useMemo(() => Date.now() + seconds * 1000, [seconds]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = Math.max(0, Math.ceil((deadline - now) / 1000));
  useEffect(() => {
    if (left === 0) onExpire();
  }, [left, onExpire]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return (
    <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-brand/40 bg-brand/10 px-4 py-3">
      <Timer size={20} className="shrink-0 text-brand" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white">Thời gian giữ ghế còn lại</p>
        <p className="text-[10px] text-muted">Hoàn tất thanh toán trước khi hết giờ.</p>
      </div>
      <span className="text-lg font-extrabold tabular-nums text-brand" aria-live="polite">
        {mm}:{ss}
      </span>
    </div>
  );
}
