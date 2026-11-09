import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Aperture, ArrowLeft, Check, Headphones } from 'lucide-react';

const STEPS = ['Chọn Suất Chiếu', 'Chọn Ghế', 'Thanh Toán'];

/** Thanh trên cùng của luồng đặt vé, `step` bắt đầu từ 1. */
export default function BookingHeader({ step }) {
  return (
    <header className="border-b border-line bg-page">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-[0_4px_12px_rgba(234,56,77,0.4)]">
              <Aperture size={20} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-bold tracking-[0.2em] text-white">GALAXY</span>
              <span className="block text-[9px] font-semibold tracking-[0.25em] text-brand">LUMIÈRE</span>
            </span>
          </Link>
          <span className="hidden h-5 w-px bg-line md:block" />
          <Link
            to="/"
            className="hidden items-center gap-1.5 whitespace-nowrap text-xs text-muted hover:text-white md:flex"
          >
            <ArrowLeft size={14} />
            Quay lại trang chủ
          </Link>
        </div>

        <ol className="hidden items-center gap-3 lg:flex">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <Fragment key={label}>
                {i > 0 && <li aria-hidden className={`h-px w-10 ${n <= step ? 'bg-brand' : 'bg-line'}`} />}
                <li className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
                      active
                        ? 'bg-brand text-white shadow-[0_0_10px_rgba(234,56,77,0.5)]'
                        : done
                          ? 'border border-brand bg-brand/15 text-brand'
                          : 'bg-white/5 text-subtle'
                    }`}
                  >
                    {done ? <Check size={12} strokeWidth={3} /> : n}
                  </span>
                  <span
                    className={`whitespace-nowrap text-xs font-semibold ${
                      active ? 'text-white' : done ? 'text-zinc-300' : 'text-subtle'
                    }`}
                  >
                    {label}
                  </span>
                </li>
              </Fragment>
            );
          })}
        </ol>

        <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-zinc-300">
          <Headphones size={14} className="text-brand" />
          CSKH: 1900 2224
        </span>
      </div>
    </header>
  );
}
