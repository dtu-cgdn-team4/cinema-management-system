import { Link } from 'react-router-dom';

const STEPS = ['Chọn Suất Chiếu', 'Chọn Ghế', 'Bắp Nước', 'Thanh Toán'];

/** Thanh trên cùng của luồng đặt vé, `step` bắt đầu từ 1. */
export default function BookingHeader({ step }) {
  return (
    <header className="border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1216px] items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lg font-extrabold text-white shadow-[0_4px_12px_rgba(234,56,77,0.4)]">
            G
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold tracking-[0.2em]">GALAXY</span>
            <span className="block text-[9px] font-semibold tracking-[0.25em] text-brand">LUMIÈRE</span>
          </span>
        </Link>
        <Link to="/" className="hidden whitespace-nowrap text-xs text-muted hover:text-white md:block">
          ← Quay lại trang chủ
        </Link>

        <ol className="mx-auto hidden items-center gap-3 lg:flex">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <li key={label} className="flex items-center gap-3">
                {i > 0 && <span className={`h-px w-10 ${n <= step ? 'bg-brand' : 'bg-line'}`} />}
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
                    active ? 'bg-brand text-white' : done ? 'border border-brand text-brand' : 'bg-white/5 text-subtle'
                  }`}
                >
                  {done ? '✓' : n}
                </span>
                <span className={`whitespace-nowrap text-xs font-semibold ${active ? 'text-white' : done ? 'text-zinc-300' : 'text-subtle'}`}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        <span className="ml-auto whitespace-nowrap text-xs text-zinc-300 lg:ml-0">CSKH: 1900 2224</span>
      </div>
    </header>
  );
}
