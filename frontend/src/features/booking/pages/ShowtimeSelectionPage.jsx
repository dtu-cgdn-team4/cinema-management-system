import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AgeBadge from '../../../components/common/AgeBadge';
import { toDateKey } from '../../../utils/format';
import { getShowingMovies, getShowtimesByMovie } from '../api/showtimeApi';
import BookingHeader from '../components/BookingHeader';
import DateTabs from '../components/DateTabs';
import SectionCard from '../components/SectionCard';
import ShowtimeGrid from '../components/ShowtimeGrid';
import TicketSummary from '../components/TicketSummary';
import { validateShowtimeSelection } from '../utils/validateShowtimeSelection';

/** SRS 6.2.1 Đặt vé – Chọn phim và suất chiếu. `?phim=<id>` chọn sẵn phim. */
export default function ShowtimeSelectionPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const movieId = Number(params.get('phim')) || null;

  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [date, setDate] = useState(null);
  const [showtimeId, setShowtimeId] = useState(null);
  const [error, setError] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    getShowingMovies().then(setMovies, () => setLoadError('Không tải được danh sách phim.'));
  }, []);

  useEffect(() => {
    setShowtimes([]);
    setDate(null);
    setShowtimeId(null);
    if (!movieId) return undefined;
    let stale = false;
    getShowtimesByMovie(movieId).then(
      (list) => {
        if (stale) return;
        const sorted = [...list].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        setShowtimes(sorted);
        setDate(sorted[0] ? toDateKey(sorted[0].startTime) : null);
      },
      () => !stale && setLoadError('Không tải được suất chiếu.'),
    );
    return () => {
      stale = true;
    };
  }, [movieId]);

  const movie = movies.find((m) => m.id === movieId);
  const dates = useMemo(() => [...new Set(showtimes.map((s) => toDateKey(s.startTime)))], [showtimes]);
  const dayShowtimes = showtimes.filter((s) => toDateKey(s.startTime) === date);
  const showtime = showtimes.find((s) => s.id === showtimeId);

  const selectMovie = (id) => {
    setError(null);
    setParams(id ? { phim: id } : {}, { replace: true });
  };
  const selectDate = (key) => {
    setError(null);
    setDate(key);
    setShowtimeId(null);
  };
  const selectShowtime = (id) => {
    setError(null);
    setShowtimeId(id);
  };

  const submit = () => {
    const message = validateShowtimeSelection({ movieId, date, showtimeId });
    if (message) {
      setError(message);
      return;
    }
    navigate(`/dat-ve/suat-chieu/${showtimeId}/chon-ghe`, { state: { movie, showtime } });
  };

  return (
    <div className="min-h-screen">
      <BookingHeader step={1} />

      <main className="mx-auto max-w-[1216px] px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-white">Đặt vé</h1>
        <p className="mt-1 text-sm text-muted">Chọn phim, ngày chiếu và suất chiếu để tiếp tục chọn ghế.</p>

        {loadError && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {loadError}
          </p>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_384px]">
          <div className="space-y-5">
            <SectionCard title="1. Chọn phim" aside={`${movies.length} phim đang chiếu`}>
              <select
                aria-label="Chọn phim"
                value={movieId ?? ''}
                onChange={(e) => selectMovie(Number(e.target.value) || null)}
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-white outline-none focus:border-brand"
              >
                <option value="">-- Chọn phim đang chiếu --</option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.ageRating})
                  </option>
                ))}
              </select>
              {movie && (
                <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <AgeBadge rating={movie.ageRating} />
                  <span>{movie.duration} phút</span>
                  <span>•</span>
                  <span>{movie.genres.join(' / ')}</span>
                </p>
              )}
            </SectionCard>

            <SectionCard title="2. Chọn ngày xem phim">
              {movieId ? (
                <DateTabs dates={dates} value={date} onChange={selectDate} />
              ) : (
                <p className="text-sm text-muted">Chọn phim để xem ngày chiếu.</p>
              )}
            </SectionCard>

            <SectionCard title="3. Suất chiếu có sẵn" aside="Bấm vào khung giờ để chọn">
              {date ? (
                <ShowtimeGrid showtimes={dayShowtimes} value={showtimeId} onChange={selectShowtime} />
              ) : (
                <p className="text-sm text-muted">Chọn ngày chiếu để xem suất chiếu.</p>
              )}
            </SectionCard>
          </div>

          <TicketSummary movie={movie} date={date} showtime={showtime} error={error} onSubmit={submit} />
        </div>
      </main>
    </div>
  );
}
