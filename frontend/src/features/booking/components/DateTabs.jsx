import { toDateKey, weekdayName } from '../../../utils/format';

/** `dates`: các khóa ngày "YYYY-MM-DD" có suất chiếu. */
export default function DateTabs({ dates, value, onChange }) {
  if (dates.length === 0) {
    return <p className="text-sm text-muted">Phim chưa có ngày chiếu nào.</p>;
  }
  const today = toDateKey(new Date());
  return (
    <div className="flex flex-wrap gap-2.5">
      {dates.map((key) => {
        const d = new Date(`${key}T00:00:00`);
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={`w-[60px] rounded-xl border py-2.5 text-center transition ${
              active
                ? 'border-brand bg-brand text-white shadow-[0_4px_6px_-1px_rgba(234,56,77,0.2)]'
                : 'border-line bg-white/[0.02] text-muted hover:border-white/20 hover:text-white'
            }`}
          >
            <span className="block text-[9px] font-bold uppercase">
              {key === today ? 'Hôm nay' : weekdayName(d)}
            </span>
            <span className={`block text-lg font-extrabold ${active ? 'text-white' : 'text-zinc-100'}`}>
              {String(d.getDate()).padStart(2, '0')}
            </span>
            <span className="block text-[9px]">Tháng {d.getMonth() + 1}</span>
          </button>
        );
      })}
    </div>
  );
}
