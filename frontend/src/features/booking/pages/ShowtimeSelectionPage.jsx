import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { errorMessage } from '../../../services/apiClient';
import { getCinemas, getShowingMovies, getShowtimes } from '../api/showtimeApi';
import BookingHeader from '../components/BookingHeader';
import CinemaPicker from '../components/CinemaPicker';
import DateTabs from '../components/DateTabs';
import MovieBanner from '../components/MovieBanner';
import ShowtimeGroups from '../components/ShowtimeGroups';
import TicketSummary from '../components/TicketSummary';
import { bookingDates } from '../utils/bookingDates';
import { validateShowtimeSelection } from '../utils/validateShowtimeSelection';

/** SRS 6.2.1 Đặt vé – Chọn phim và suất chiếu, giao diện theo khối đặt vé của Figma. `?phim=<id>` chọn sẵn phim. */
export default function ShowtimeSelectionPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const movieId = Number(params.get('phim')) || null;

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [city, setCity] = useState(null);
  const [cinemaId, setCinemaId] = useState(null);
  const [date, setDate] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showtimeId, setShowtimeId] = useState(null);
  const [error, setError] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    Promise.all([getShowingMovies(), getCinemas()]).then(
      ([movieList, cinemaList]) => {
        setMovies(movieList);
        setCinemas(cinemaList);
        setCity(cinemaList[0]?.city ?? null);
        setCinemaId(cinemaList[0]?.id ?? null);
      },
      (err) => setLoadError(errorMessage(err)),
    );
  }, []);

  const movie = movies.find((m) => m.id === movieId);
  const dates = useMemo(() => bookingDates(movie), [movie]);

  useEffect(() => {
    setDate(dates[0] ?? null);
    setShowtimeId(null);
  }, [dates]);

  useEffect(() => {
    setShowtimes([]);
    setShowtimeId(null);
    if (!movieId || !cinemaId || !date) return undefined;
    let stale = false;
    setLoading(true);
    getShowtimes(movieId, { cinemaId, date })
      .then(
        (list) => !stale && setShowtimes(list),
        (err) => !stale && setLoadError(errorMessage(err)),
      )
      .finally(() => !stale && setLoading(false));
    return () => {
      stale = true;
    };
  }, [movieId, cinemaId, date]);

  const cinema = cinemas.find((c) => c.id === cinemaId);
  const showtime = showtimes.find((s) => s.id === showtimeId);

  const selectCity = (name) => {
    setError(null);
    setCity(name);
    setCinemaId(cinemas.find((c) => c.city === name)?.id ?? null);
  };
  const clearErrorAnd = (setter) => (value) => {
    setError(null);
    setter(value);
  };

  const submit = () => {
    const message = validateShowtimeSelection({ movieId, date, showtimeId });
    if (message) {
      setError(message);
      return;
    }
    navigate(`/dat-ve/suat-chieu/${showtimeId}/chon-ghe`);
  };

  return (
    <div className="min-h-screen">
      <BookingHeader step={1} />

      <MovieBanner movie={movie}>
        <label className="w-full text-[11px] text-muted">
          <span className="mb-1 block">{movie ? 'Chọn phim khác' : 'Chọn phim'}</span>
          <select
            aria-label="Chọn phim"
            value={movieId ?? ''}
            onChange={(e) => {
              setError(null);
              const id = Number(e.target.value);
              setParams(id ? { phim: id } : {}, { replace: true });
            }}
            className="w-full rounded-xl border border-line bg-card px-3 py-2 text-xs font-semibold text-white outline-none focus:border-brand"
          >
            <option value="">-- Phim đang chiếu --</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.ageRating})
              </option>
            ))}
          </select>
        </label>
      </MovieBanner>

      <main className="mx-auto max-w-[1216px] px-4 py-8 lg:px-0">
        {loadError && (
          <p role="alert" className="mb-4 text-sm text-red-300">
            {loadError}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_384px]">
          <div className="min-w-0 space-y-5">
            <DateTabs dates={dates} value={date} onChange={clearErrorAnd(setDate)} />
            <CinemaPicker
              cinemas={cinemas}
              city={city}
              cinemaId={cinemaId}
              onCityChange={selectCity}
              onCinemaChange={clearErrorAnd(setCinemaId)}
            />
            <ShowtimeGroups
              cinemaName={cinema?.name}
              showtimes={showtimes}
              loading={loading}
              value={showtimeId}
              onChange={clearErrorAnd(setShowtimeId)}
            />
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <TicketSummary
              movie={movie}
              cinemaName={cinema?.name}
              date={date}
              showtime={showtime}
              error={error}
              onSubmit={submit}
              submitLabel="Tiếp tục chọn ghế"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
