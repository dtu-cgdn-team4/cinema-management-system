import { useEffect, useMemo, useState } from 'react';

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
    <div className="mt-4 flex items-center justify-between rounded-2xl border border-brand/40 bg-brand/10 px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-white">Thời gian giữ ghế còn lại</p>
        <p className="text-[11px] text-muted">Hoàn tất đặt vé trước khi hết giờ.</p>
      </div>
      <span className="text-xl font-extrabold tabular-nums text-brand" aria-live="polite">
        {mm}:{ss}
      </span>
    </div>
  );
}
