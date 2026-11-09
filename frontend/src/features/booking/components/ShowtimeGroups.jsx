import { Check, Clapperboard, Loader2 } from 'lucide-react';
import { formatTime, formatVnd } from '../../../utils/format';

const LOW_SEATS = 10;

function seatsLabel(n) {
  if (n === 0) return { text: 'Hết ghế', cls: 'text-subtle' };
  if (n <= LOW_SEATS) return { text: `Sắp hết (còn ${n})`, cls: 'text-warn' };
  return { text: `Còn ${n} ghế`, cls: 'text-ok' };
}

function ShowtimeButton({ showtime, active, onSelect }) {
  const soldOut = showtime.availableSeats === 0;
  const seats = seatsLabel(showtime.availableSeats);
  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => onSelect(showtime.id)}
      aria-pressed={active}
      className={`relative rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-2 border-brand bg-brand/15 shadow-[0_10px_15px_-3px_rgba(234,56,77,0.1)]'
          : 'border-line bg-card hover:border-white/20'
      }`}
    >
      {active && <Check size={16} className="absolute right-3 top-3 text-brand" />}
      <span className={`block text-base font-extrabold ${active ? 'text-brand' : 'text-white'}`}>
        {formatTime(showtime.startTime)}
      </span>
      <span className={`mt-0.5 block text-[11px] ${active ? 'text-muted' : 'text-subtle'}`}>
        kết thúc ~ {formatTime(showtime.endTime)}
      </span>
      <span className={`mt-1.5 block text-[10px] font-medium ${seats.cls}`}>{seats.text}</span>
    </button>
  );
}

/** Bước 3: suất chiếu của rạp đã chọn trong ngày, nhóm theo phòng. */
export default function ShowtimeGroups({ cinemaName, showtimes, loading, value, onChange }) {
  const rooms = [...new Map(showtimes.map((s) => [s.room.id, s.room])).values()];
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.7px] text-white">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span>
            3. Suất chiếu có sẵn{cinemaName && ' tại '}
            {cinemaName && <span className="text-brand">{cinemaName}</span>}
          </span>
        </h2>
        <span className="hidden text-xs text-muted sm:block">Bấm vào khung giờ để chọn</span>
      </div>

      {loading && (
        <p className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-12 text-sm text-muted">
          <Loader2 size={18} className="animate-spin text-brand" />
          Đang tải suất chiếu…
        </p>
      )}

      {!loading && rooms.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface py-12 text-center">
          <Clapperboard size={28} className="text-subtle" />
          <p className="text-sm font-semibold text-white">Không có suất chiếu</p>
          <p className="text-xs text-muted">Hãy thử chọn ngày hoặc rạp khác.</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {rooms.map((room) => {
            const inRoom = showtimes.filter((s) => s.room.id === room.id);
            return (
              <div key={room.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3 text-xs text-muted">
                  <span className="rounded border border-blue-500/30 bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-extrabold text-info">
                    2D
                  </span>
                  <span>
                    Phòng chiếu: <b className="font-semibold text-zinc-200">{room.name}</b>
                    <span className="mx-2 text-subtle">•</span>
                    <b className="font-bold text-brand">{formatVnd(inRoom[0].price)}</b>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {inRoom.map((s) => (
                    <ShowtimeButton key={s.id} showtime={s} active={s.id === value} onSelect={onChange} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
