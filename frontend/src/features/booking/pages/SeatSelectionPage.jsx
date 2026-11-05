import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { errorMessage } from '../../../services/apiClient';
import { subscribe } from '../../../services/socketClient';
import { formatVnd, toDateKey } from '../../../utils/format';
import { getSeatMap, holdSeats } from '../api/seatApi';
import BookingHeader from '../components/BookingHeader';
import HoldCountdown from '../components/HoldCountdown';
import SeatMap from '../components/SeatMap';
import SectionCard from '../components/SectionCard';
import TicketSummary from '../components/TicketSummary';
import { seatCountError } from '../utils/seatCountError';

const TYPE_NAME = { THUONG: 'Ghế thường', VIP: 'Ghế VIP' };

/**
 * SRS 6.2.2 Đặt vé – Chọn ghế. Sơ đồ lấy qua REST rồi cập nhật theo WebSocket (architecture.md, bước 1 và 4).
 * Bấm Tiếp tục thì giữ ghế 10 phút ở server.
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

  /** keepSelection: giữ ghế đang chọn (bỏ ghế vừa có người); không thì chọn lại ghế phiên này đang giữ. */
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
      navigate(`/dat-ve/suat-chieu/${showtimeId}/xac-nhan`, {
        state: { hold, movie: seatMap.movie, showtime: seatMap.showtime },
      });
    } catch (err) {
      submittingRef.current = false;
      setError(errorMessage(err));
      if (err?.response?.status === 409) load(true);
      setSubmitting(false);
    }
  };

  if (!seatMap) {
    return (
      <div className="min-h-screen">
        <BookingHeader step={2} />
        <main className="mx-auto max-w-[1216px] px-4 py-10 text-sm text-muted">
          {loadError ? (
            <>
              <p role="alert" className="text-red-300">{loadError}</p>
              <Link to="/dat-ve" className="mt-3 inline-block text-white underline">
                Chọn suất chiếu khác
              </Link>
            </>
          ) : (
            'Đang tải sơ đồ ghế…'
          )}
        </main>
      </div>
    );
  }

  const { movie, showtime, prices, maxSeats, rows } = seatMap;
  const byType = Object.entries(
    selected.reduce((acc, s) => ({ ...acc, [s.type]: (acc[s.type] ?? 0) + 1 }), {}),
  );
  const total = selected.reduce((sum, s) => sum + prices[s.type], 0);

  return (
    <div className="min-h-screen">
      <BookingHeader step={2} />

      <main className="mx-auto max-w-[1216px] px-4 py-8">
        <Link to={`/dat-ve?phim=${movie.id}`} className="text-xs text-muted hover:text-white">
          ← Quay lại chọn suất chiếu
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">Chọn ghế</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_384px]">
          <div className="min-w-0 space-y-5">
            <SectionCard title="Chọn ghế của bạn" aside={showtime.room.name}>
              <label className="mb-6 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                Số lượng ghế
                <select
                  value={quantity}
                  onChange={(e) => {
                    setError(null);
                    setQuantity(Number(e.target.value));
                  }}
                  className="rounded-xl border border-line bg-surface px-4 py-2 text-sm text-white outline-none focus:border-brand"
                >
                  <option value={0}>-- Chọn số lượng --</option>
                  {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} ghế
                    </option>
                  ))}
                </select>
                {quantity > 0 && (
                  <span className="text-xs text-muted">
                    Đã chọn {selected.length}/{quantity}
                  </span>
                )}
              </label>

              <SeatMap rows={rows} selectedIds={new Set(selected.map((s) => s.id))} onToggle={toggle} />
            </SectionCard>

            <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-2xl border border-line bg-card px-5 py-4 text-xs text-muted">
              {Object.entries(TYPE_NAME).map(([type, name]) => (
                <span key={type}>
                  <span className="font-semibold text-white">{name}</span> {formatVnd(prices[type])} / ghế
                </span>
              ))}
            </div>
            <p className="text-xs text-subtle">
              ⓘ Không để trống 1 ghế lẻ sát ghế bạn chọn (đầu hàng và lối đi tính là biên). Mỗi lần đặt tối đa {maxSeats}{' '}
              ghế.
            </p>
          </div>

          <div>
            <TicketSummary
              movie={movie}
              date={toDateKey(showtime.startTime)}
              showtime={showtime}
              error={error}
              onSubmit={submit}
              submitLabel="Tiếp tục →"
              submitting={submitting}
            >
              <div className="mt-4 space-y-3 text-xs">
                <p className="font-semibold text-white">Ghế đã chọn</p>
                {selected.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {selected.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => toggle(s)}
                          aria-label={`Bỏ chọn ghế ${s.label}`}
                          className="rounded-md border border-brand/60 px-2 py-1 font-bold text-brand hover:bg-brand/10"
                        >
                          {s.label} ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Chưa chọn ghế nào.</p>
                )}
                {byType.map(([type, count]) => (
                  <div key={type} className="flex justify-between text-muted">
                    <span>
                      {TYPE_NAME[type]}: {count} × {formatVnd(prices[type])}
                    </span>
                    <span className="text-white">{formatVnd(count * prices[type])}</span>
                  </div>
                ))}
                <div className="flex items-end justify-between border-t border-line pt-3">
                  <span className="text-muted">Tổng cộng</span>
                  <span className="text-2xl font-extrabold text-white">{formatVnd(total)}</span>
                </div>
              </div>
            </TicketSummary>

            {seatMap.holdSecondsLeft != null && (
              <HoldCountdown seconds={seatMap.holdSecondsLeft} onExpire={onHoldExpired} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
