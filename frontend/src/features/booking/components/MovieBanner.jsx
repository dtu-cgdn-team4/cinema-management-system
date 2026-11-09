import AgeBadge from '../../../components/common/AgeBadge';
import { formatDate } from '../../../utils/format';
import MoviePoster from './MoviePoster';

/** Dải thông tin phim đang đặt vé; `children` là các nút bên phải. */
export default function MovieBanner({ movie, children }) {
  return (
    <section className="border-b border-line bg-gradient-to-r from-surface via-page to-surface">
      <div className="mx-auto flex max-w-[1216px] flex-col gap-6 px-4 py-6 md:flex-row lg:px-0">
        {movie && (
          <div className="relative hidden h-48 w-32 shrink-0 overflow-hidden rounded-xl sm:block">
            <MoviePoster movie={movie} className="h-full w-full text-3xl" />
            <AgeBadge rating={movie.ageRating} className="absolute left-2 top-2" />
          </div>
        )}

        <div className="min-w-0 flex-1 md:self-center">
          {movie ? (
            <>
              <p className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                <span className="rounded-full border border-brand/40 bg-brand/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">
                  Đang đặt vé cho phim
                </span>
                • Khởi chiếu từ {formatDate(`${movie.releaseDate}T00:00:00`)}
              </p>
              <h1 className="mt-3 font-display text-[28px] font-bold uppercase leading-tight text-white">
                {movie.title}
              </h1>
              <p className="mt-2 text-xs text-zinc-300">
                {movie.genres.join(', ')} <span className="mx-2 text-subtle">•</span> {movie.duration} phút
              </p>
              <p className="mt-3 line-clamp-2 max-w-3xl text-xs leading-relaxed text-muted">{movie.description}</p>
            </>
          ) : (
            <>
              <h1 className="font-display text-[28px] font-bold uppercase leading-tight text-white">Đặt vé xem phim</h1>
              <p className="mt-2 text-sm text-muted">Chọn phim đang chiếu để xem lịch chiếu tại rạp.</p>
            </>
          )}
        </div>

        <div className="flex shrink-0 flex-row items-center justify-end gap-3 md:w-[171px] md:flex-col md:items-end md:justify-center md:border-l md:border-line md:pl-6">
          {children}
        </div>
      </div>
    </section>
  );
}
