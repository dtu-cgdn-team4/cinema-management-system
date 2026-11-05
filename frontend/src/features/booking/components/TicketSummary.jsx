import AgeBadge from '../../../components/common/AgeBadge';
import { formatDate, formatTime, formatVnd, toDateKey } from '../../../utils/format';

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold text-white">{children}</span>
    </div>
  );
}

export default function TicketSummary({ movie, date, showtime, error, onSubmit }) {
  const isToday = date && date === toDateKey(new Date());
  return (
    <aside className="rounded-2xl border border-line bg-card p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] lg:sticky lg:top-6">
      <h2 className="border-b border-line pb-4 text-base font-bold text-white">Thông Tin Vé</h2>

      {movie ? (
        <div className="flex items-center gap-3 py-4">
          <div className="grid h-14 w-11 shrink-0 place-items-center rounded-md bg-gradient-to-b from-brand/60 to-surface text-[10px] font-bold">
            {movie.title.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <AgeBadge rating={movie.ageRating} />
            <p className="mt-1 truncate text-sm font-bold text-white">{movie.title}</p>
            <p className="text-[11px] text-muted">
              {movie.duration} phút • {movie.genres.join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <p className="py-4 text-xs text-muted">Chọn phim để bắt đầu đặt vé.</p>
      )}

      <div className="space-y-3 rounded-xl border border-line bg-surface p-4">
        <Row label="Ngày chiếu:">{date ? `${isToday ? 'Hôm nay ' : ''}(${formatDate(`${date}T00:00:00`)})` : '—'}</Row>
        <Row label="Phòng chiếu:">{showtime?.room.name ?? '—'}</Row>
        <Row label="Giá vé thường:">{showtime ? formatVnd(showtime.price) : '—'}</Row>
        <div className="border-t border-line pt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Suất chiếu:</span>
            <span className="text-lg font-extrabold text-brand">
              {showtime ? `${formatTime(showtime.startTime)} ~ ${formatTime(showtime.endTime)}` : '—'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand to-brand-dark py-3.5 text-sm font-extrabold uppercase text-white shadow-[0_10px_15px_-3px_rgba(234,56,77,0.25)] transition hover:brightness-110"
      >
        Tiếp tục chọn ghế →
      </button>
    </aside>
  );
}
