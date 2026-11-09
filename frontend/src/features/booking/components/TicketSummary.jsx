import { ArrowRight, Ticket } from 'lucide-react';
import AgeBadge from '../../../components/common/AgeBadge';
import { formatDate, formatTime, toDateKey } from '../../../utils/format';
import MoviePoster from './MoviePoster';

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold text-white">{children}</span>
    </div>
  );
}

/** Khung "Thông tin vé" bên phải các bước đặt vé; `children` hiện dưới thông tin suất chiếu. */
export default function TicketSummary({
  title = 'Thông Tin Vé',
  badge,
  movie,
  cinemaName,
  date,
  showtime,
  error,
  onSubmit,
  submitLabel,
  submitting = false,
  caption,
  children,
}) {
  const isToday = date && date === toDateKey(new Date());
  return (
    <aside className="rounded-2xl border border-line bg-surface p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
        <h2 className="flex items-center gap-2.5 font-display text-base font-bold text-white">
          <Ticket size={18} className="text-brand" />
          {title}
        </h2>
        {badge && (
          <span className="rounded border border-brand/40 bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase text-brand">
            {badge}
          </span>
        )}
      </div>

      {movie ? (
        <div className="flex items-center gap-3 py-5">
          <MoviePoster movie={movie} className="h-[61px] w-[61px] shrink-0 rounded-lg text-lg" />
          <div className="min-w-0">
            <AgeBadge rating={movie.ageRating} />
            <p className="mt-1 truncate text-sm font-bold text-white">{movie.title}</p>
            <p className="truncate text-[11px] text-muted">
              {movie.duration} phút • {movie.genres.join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <p className="py-5 text-xs text-muted">Chọn phim để bắt đầu đặt vé.</p>
      )}

      <div className="space-y-3 rounded-xl border border-line bg-card/40 p-4">
        <Row label="Rạp chiếu:">{cinemaName ?? '—'}</Row>
        <Row label="Ngày chiếu:">
          {date ? `${isToday ? 'Hôm nay ' : ''}(${formatDate(`${date}T00:00:00`)})` : '—'}
        </Row>
        <Row label="Định dạng:">
          <span className="text-info">2D</span>
        </Row>
        <Row label="Phòng chiếu:">{showtime?.room.name ?? '—'}</Row>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="text-xs text-muted">Suất chiếu:</span>
          <span className="text-lg font-extrabold text-brand">
            {showtime ? `${formatTime(showtime.startTime)} ~ ${formatTime(showtime.endTime)}` : '—'}
          </span>
        </div>
      </div>

      {children}

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark py-3.5 text-sm font-extrabold uppercase text-white shadow-[0_10px_15px_-3px_rgba(234,56,77,0.25)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? 'Đang giữ ghế…' : submitLabel}
        {!submitting && <ArrowRight size={16} />}
      </button>
      {caption && <p className="mt-3 text-center text-[11px] text-muted">{caption}</p>}
    </aside>
  );
}
