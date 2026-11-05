import { formatTime } from '../../../utils/format';

const LOW_SEATS = 10;

function seatsLabel(n) {
  if (n === 0) return { text: 'Hết ghế', cls: 'text-subtle' };
  if (n <= LOW_SEATS) return { text: `Sắp hết (còn ${n})`, cls: 'text-warn' };
  return { text: `Còn ${n} ghế`, cls: 'text-ok' };
}

export default function ShowtimeGrid({ showtimes, value, onChange }) {
  if (showtimes.length === 0) {
    return <p className="text-sm text-muted">Không có suất chiếu nào trong ngày này.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {showtimes.map((s) => {
        const active = s.id === value;
        const soldOut = s.availableSeats === 0;
        const seats = seatsLabel(s.availableSeats);
        return (
          <button
            key={s.id}
            type="button"
            disabled={soldOut}
            onClick={() => onChange(s.id)}
            aria-pressed={active}
            className={`relative rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
              active
                ? 'border-2 border-brand bg-brand/15 shadow-[0_10px_15px_-3px_rgba(234,56,77,0.25)]'
                : 'border-line bg-surface hover:border-white/20'
            }`}
          >
            {active && <span className="absolute right-3 top-2 text-sm text-brand">✓</span>}
            <span className={`block text-base font-extrabold ${active ? 'text-brand' : 'text-white'}`}>
              {formatTime(s.startTime)}
            </span>
            <span className="block text-[10px] text-subtle">kết thúc ~ {formatTime(s.endTime)}</span>
            <span className="mt-1 block text-[10px] text-zinc-300">{s.room.name}</span>
            <span className={`block text-[10px] font-medium ${seats.cls}`}>{seats.text}</span>
          </button>
        );
      })}
    </div>
  );
}
