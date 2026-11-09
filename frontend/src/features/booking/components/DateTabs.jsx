import { Calendar } from 'lucide-react';
import { toDateKey, weekdayName } from '../../../utils/format';
import SectionCard from './SectionCard';

/** Bước 1: chọn ngày. `dates` là các khóa "YYYY-MM-DD". */
export default function DateTabs({ dates, value, onChange }) {
  const today = toDateKey(new Date());
  const shown = new Date(`${value ?? today}T00:00:00`);
  const month = `Tháng ${shown.getMonth() + 1}/${shown.getFullYear()}`;
  return (
    <SectionCard
      title="1. Chọn ngày xem phim"
      aside={
        <span className="flex items-center gap-1.5">
          <Calendar size={14} className="text-brand" />
          {month}
        </span>
      }
    >
      {dates.length === 0 ? (
        <p className="text-sm text-muted">Chọn phim để xem ngày chiếu.</p>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {dates.map((key) => {
            const d = new Date(`${key}T00:00:00`);
            const active = key === value;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                aria-pressed={active}
                className={`h-[90px] w-[84px] shrink-0 rounded-xl border text-center transition ${
                  active
                    ? 'border-brand bg-brand text-white shadow-[0_10px_15px_-3px_rgba(234,56,77,0.25)]'
                    : 'border-line bg-card text-muted hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase">
                  {key === today ? 'Hôm nay' : weekdayName(d)}
                </span>
                <span className={`my-0.5 block text-xl font-extrabold ${active ? 'text-white' : 'text-zinc-100'}`}>
                  {String(d.getDate()).padStart(2, '0')}
                </span>
                <span className="block text-[10px]">Tháng {d.getMonth() + 1}</span>
              </button>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
