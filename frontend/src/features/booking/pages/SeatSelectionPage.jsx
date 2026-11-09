import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Info, Loader2, Play, RefreshCw, X } from 'lucide-react';
import { errorMessage } from '../../../services/apiClient';
import { subscribe } from '../../../services/socketClient';
import { formatVnd, toDateKey } from '../../../utils/format';
import { getSeatMap, holdSeats } from '../api/seatApi';
import BookingHeader from '../components/BookingHeader';
import HoldCountdown from '../components/HoldCountdown';
import MovieBanner from '../components/MovieBanner';
import SeatMap from '../components/SeatMap';
import TicketSummary from '../components/TicketSummary';
import { seatCountError } from '../utils/seatCountError';

const TYPE_NAME = { THUONG: 'Tiêu chuẩn', VIP: 'Ghế VIP' };
const TYPE_SAMPLE = {
  THUONG: ['01', 'border-zinc-300/70 text-white'],
  VIP: ['VIP', 'border-warn/70 text-warn'],
};
const AGE_NOTE = {
  P: 'Phim dành cho mọi lứa tuổi.',
  K: 'Phim dành cho khán giả dưới 13 tuổi, có người bảo hộ đi kèm.',
  T13: 'Phim dành cho khán giả từ đủ 13 tuổi trở lên.',
  T16: 'Phim dành cho khán giả từ đủ 16 tuổi trở lên.',
  T18: 'Phim dành cho khán giả từ đủ 18 tuổi trở lên.',
};
const BANNER_BUTTON =
  'flex items-center gap-2 whitespace-nowrap rounded-xl border border-line bg-card px-4 py-2 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:text-white';

/**
 * SRS 6.2.2 Đặt vé – Chọn ghế. Sơ đồ lấy qua REST rồi cập nhật theo WebSocket (architecture.md, bước 1 và 4).
 * Bấm Tiếp tục thì giữ ghế 10 phút ở server; chỉ thành viên đã đăng nhập mới giữ được.
 */
export default function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [seatMap, setSeatMap] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Bản sao cho callback WebSocket, không phải đăng ký lại kênh mỗi lần chọn ghế
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const submittingRef = useRef(false);

  /** keepSelection: giữ ghế đang chọn (bỏ ghế vừa có người); không thì chọn lại ghế người này đang giữ. */
  const load = useCallback(
    (keepSelection = false) =>
      getSeatMap(showtimeId).then(
        (map) => {
          setSeatMap(map);
          const seats = map.rows.flatMap((r) => r.seats);
          if (keepSelection) {
            const free = new Set(seats.filter((s) => s.status !== 'TAKEN').map((s) => s.id));
            setSelected((prev) => prev.filter((s) => free.has(s.id)));
          } else {
            const mine = seats.filter((s) => s.status === 'MINE');
            setSelected(mine);
            if (mine.length) setQuantity(mine.length);
          }
        },
        (err) => setLoadError(errorMessage(err)),
      ),
    [showtimeId],
  );

  useEffect(() => {
    load();
  }, [load]);

  /** Tin { seats: [{ seatId, status: AVAILABLE | TAKEN }] } khi có người giữ ghế hoặc ghế giữ hết hạn. */
  const applySeatEvent = useCallback((event) => {
    const changes = new Map(event.seats.map((c) => [c.seatId, c.status]));
    // Ghế mình vừa bấm giữ cũng được báo TAKEN: bỏ qua trong lúc chờ kết quả giữ ghế
    const pending = submittingRef.current ? new Set(selectedRef.current.map((s) => s.id)) : new Set();
    const update = (seat) => {
      const status = changes.get(seat.id);
      if (!status || pending.has(seat.id) || (seat.status === 'MINE' && status === 'TAKEN')) return seat;
      return { ...seat, status };
    };
    setSeatMap((map) => map && { ...map, rows: map.rows.map((r) => ({ ...r, seats: r.seats.map(update) })) });

    const lost = selectedRef.current.filter(
      (s) => !pending.has(s.id) && s.status !== 'MINE' && changes.get(s.id) === 'TAKEN',
    );
    if (lost.length) {
      const lostIds = new Set(lost.map((s) => s.id));
      setSelected((prev) => prev.filter((s) => !lostIds.has(s.id)));
      setError(`Ghế ${lost.map((s) => s.label).join(', ')} vừa có người chọn, vui lòng chọn ghế khác`);
    }
  }, []);

  useEffect(
    () =>
      subscribe(`/topic/showtimes/${showtimeId}/seats`, applySeatEvent, {
        onReconnect: () => load(true),
      }),
    [showtimeId, applySeatEvent, load],
  );

  const onHoldExpired = useCallback(() => {
    setError('Hết thời gian giữ ghế');
    load();
  }, [load]);

  const toggle = (seat) => {
    setError(null);
    if (selected.some((s) => s.id === seat.id)) {
      setSelected(selected.filter((s) => s.id !== seat.id));
      return;
    }
    if (!quantity || selected.length >= quantity) {
      setError(seatCountError(quantity, selected.length + 1));
      return;
    }
    setSelected([...selected, seat]);
  };

  const submit = async () => {
    const message = seatCountError(quantity, selected.length);
    if (message) {
      setError(message);
      return;
    }
    setSubmitting(true);
    submittingRef.current = true;
    try {
      const hold = await holdSeats(showtimeId, selected.map((s) => s.id));
      navigate(`/dat-ve/suat-chieu/${showtimeId}/thanh-toan`, {
        state: { hold, movie: seatMap.movie, showtime: seatMap.showtime },
      });
    } catch (err) {
      submittingRef.current = false;
      setError(errorMessage(err));
      if (err?.response?.status === 409) load(true);
      setSubmitting(false);
    }
  };

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected]);

  if (!seatMap) {
    return (
      <div className="min-h-screen">
        <BookingHeader step={2} />
        <main className="mx-auto flex max-w-[1216px] flex-col items-center gap-3 px-4 py-24 text-sm text-muted">
          {loadError ? (
            <>
              <p role="alert" className="text-red-300">
                {loadError}
              </p>
              <Link to="/dat-ve" className="text-white underline">
                Chọn suất chiếu khác
              </Link>
            </>
          ) : (
            <>
              <Loader2 size={32} className="animate-spin text-brand" />
              Đang tải sơ đồ ghế…
            </>
          )}
        </main>
      </div>
    );
  }

  const { movie, showtime, prices, maxSeats, rows } = seatMap;
  const typeCounts = Object.entries(
    selected.reduce((acc, s) => ({ ...acc, [s.type]: (acc[s.type] ?? 0) + 1 }), {}),
  );
  const total = selected.reduce((sum, s) => sum + prices[s.type], 0);

  return (
    <div className="min-h-screen">
      <BookingHeader step={2} />

      <MovieBanner movie={movie}>
        <Link to="/dat-ve" className={BANNER_BUTTON}>
          <RefreshCw size={14} />
          Chọn phim khác
        </Link>
        {movie.trailerUrl && (
          <a href={movie.trailerUrl} target="_blank" rel="noreferrer" className={BANNER_BUTTON}>
            <Play size={14} className="fill-brand text-brand" />
            Xem Trailer
          </a>
        )}
      </MovieBanner>

      <main className="mx-auto max-w-[1216px] px-4 py-8 lg:px-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_384px]">
          <div className="min-w-0">
            <Link to={`/dat-ve?phim=${movie.id}`} className="flex items-center gap-1.5 text-xs text-muted hover:text-white">
              <ArrowLeft size={14} />
              Quay lại chọn suất chiếu
            </Link>

            <section className="mt-4 rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-base font-bold uppercase text-white">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    Chọn ghế của bạn
                  </h2>
                  <p className="mt-1.5 text-xs text-muted">Chạm vào ghế trống để chọn hoặc bỏ chọn.</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-info">2D</p>
                  <p className="mt-1.5 text-muted">{showtime.room.name}</p>
                </div>
              </div>

              <label className="mb-5 mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                Số lượng ghế
                <select
                  value={quantity}
                  onChange={(e) => {
                    setError(null);
                    setQuantity(Number(e.target.value));
                  }}
                  className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-brand"
                >
                  <option value={0}>-- Chọn số lượng --</option>
                  {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} ghế
                    </option>
                  ))}
                </select>
                {quantity > 0 && (
                  <span className="text-muted">
                    Đã chọn {selected.length}/{quantity}
                  </span>
                )}
              </label>

              <SeatMap rows={rows} selectedIds={selectedIds} onToggle={toggle} />
            </section>

            <div className="mt-4 grid gap-4 rounded-2xl border border-line bg-surface p-[18px] sm:grid-cols-2">
              {Object.entries(TYPE_NAME).map(([type, name]) => (
                <div key={type} className="flex items-center gap-3">
                  <span
                    className={`grid h-[30px] w-9 place-items-center rounded-md border bg-card text-[11px] font-bold ${TYPE_SAMPLE[type][1]}`}
                  >
                    {TYPE_SAMPLE[type][0]}
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-white">{name}</span>
                    <span className="block text-[11px] text-muted">{formatVnd(prices[type])} / ghế</span>
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 flex items-center gap-2 pl-1 text-xs text-muted">
              <Info size={14} className="shrink-0" />
              Vui lòng không để trống 1 ghế giữa các ghế đã chọn. Mỗi lần đặt tối đa {maxSeats} ghế.
            </p>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <TicketSummary
              title="Thông Tin Vé Đặt"
              badge="Bước 2 / 3"
              movie={movie}
              cinemaName={showtime.cinemaName}
              date={toDateKey(showtime.startTime)}
              showtime={showtime}
              error={error}
              onSubmit={submit}
              submitLabel="Tiếp tục"
              submitting={submitting}
              caption="Kiểm tra thông tin và thanh toán ở bước tiếp theo."
            >
              <div className="mt-5 text-xs">
                <div className="flex justify-between gap-3">
                  <p className="font-bold text-white">Ghế đã chọn</p>
                  {selected.length > 0 && (
                    <p className="text-muted">
                      {selected.length} vé • {typeCounts.map(([type]) => TYPE_NAME[type]).join(', ')}
                    </p>
                  )}
                </div>

                {selected.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {selected.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => toggle(s)}
                          aria-label={`Bỏ chọn ghế ${s.label}`}
                          className="flex items-center gap-1.5 rounded-md border border-brand/50 bg-brand/10 px-2.5 py-1.5 font-bold text-brand hover:bg-brand/20"
                        >
                          {s.label}
                          <X size={12} strokeWidth={3} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-muted">Chưa chọn ghế nào.</p>
                )}

                {typeCounts.map(([type, count]) => (
                  <div key={type} className="mt-3 flex justify-between text-muted">
                    <span>
                      {count} × {formatVnd(prices[type])}
                    </span>
                    <span className="font-semibold text-white">{formatVnd(count * prices[type])}</span>
                  </div>
                ))}

                <div className="mt-4 border-t border-line pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Tổng cộng</span>
                    <span className="font-display text-[26px] font-bold leading-none text-white">{formatVnd(total)}</span>
                  </div>
                  <p className="mt-1.5 text-right text-[10px] text-muted">Đã bao gồm VAT</p>
                </div>
              </div>
            </TicketSummary>

            {seatMap.holdSecondsLeft != null && (
              <HoldCountdown seconds={seatMap.holdSecondsLeft} onExpire={onHoldExpired} />
            )}

            <p className="mt-4 text-center text-[11px] text-subtle">
              {movie.ageRating} • {AGE_NOTE[movie.ageRating]}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
