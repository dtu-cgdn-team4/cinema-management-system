// Màu theo chú thích trong Figma (trang "Trang chọn ghế")
const SEAT_STYLE = {
  THUONG: 'border-zinc-300/70 bg-card text-white hover:bg-white/10',
  VIP: 'border-warn/70 bg-card text-warn hover:bg-warn/10',
  TAKEN: 'cursor-not-allowed border-transparent bg-white/[0.07] text-zinc-600',
  SELECTED: 'border-brand bg-brand text-white shadow-[0_4px_10px_rgba(234,56,77,0.4)]',
};

const LEGEND = [
  ['Ghế trống', SEAT_STYLE.THUONG],
  ['Đã đặt', SEAT_STYLE.TAKEN],
  ['Đang chọn', SEAT_STYLE.SELECTED],
];

const SEAT_WIDTH = '38px';
// Lối đi rộng 26px = cột trống 10px + hai khoảng cách 8px
const AISLE_WIDTH = '10px';

function Seat({ seat, selected, onToggle }) {
  const taken = seat.status === 'TAKEN';
  const style = taken ? SEAT_STYLE.TAKEN : selected ? SEAT_STYLE.SELECTED : SEAT_STYLE[seat.type];
  return (
    <button
      type="button"
      disabled={taken}
      onClick={() => onToggle(seat)}
      aria-pressed={selected}
      aria-label={`Ghế ${seat.label}${seat.type === 'VIP' ? ' VIP' : ''}${taken ? ', đã đặt' : ''}`}
      style={{ gridColumn: seat.column }}
      className={`relative h-8 rounded-md border text-[11px] font-bold transition ${style}`}
    >
      {String(seat.number).padStart(2, '0')}
      <span className="absolute inset-x-[5px] bottom-[3px] h-0.5 rounded-full bg-current opacity-40" />
    </button>
  );
}

/** `rows` từ API sơ đồ ghế; `column` là vị trí trên lưới, cột không có ghế là lối đi. */
export default function SeatMap({ rows, selectedIds, onToggle }) {
  const seatColumns = new Set(rows.flatMap((r) => r.seats.map((s) => s.column)));
  const lastColumn = Math.max(...seatColumns);
  const template = Array.from({ length: lastColumn }, (_, i) =>
    seatColumns.has(i + 1) ? SEAT_WIDTH : AISLE_WIDTH,
  ).join(' ');

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="mx-auto w-[660px]">
          <div className="relative mx-auto h-[66px] w-[580px]">
            <svg viewBox="0 0 580 55" className="absolute inset-0 h-[55px] w-full" aria-hidden>
              <defs>
                <linearGradient id="anh-sang-man-hinh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M30 14 Q290 -6 550 14 L580 55 L0 55 Z" fill="url(#anh-sang-man-hinh)" />
              <path d="M30 14 Q290 -6 550 14" fill="none" stroke="#e4e4e7" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="absolute inset-x-0 top-7 text-center text-[11px] tracking-wider text-muted">MÀN HÌNH</p>
          </div>

          <div className="mt-4 space-y-2.5">
            {rows.map((row) => (
              <div key={row.name} className="flex items-center gap-5">
                <span className="w-5 text-center text-xs font-bold text-muted">{row.name}</span>
                <div className="grid w-[580px] gap-2" style={{ gridTemplateColumns: template }}>
                  {row.seats.map((seat) => (
                    <Seat key={seat.id} seat={seat} selected={selectedIds.has(seat.id)} onToggle={onToggle} />
                  ))}
                </div>
                <span className="w-5 text-center text-xs font-bold text-muted">{row.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between px-10 text-[10px] tracking-wide text-subtle">
            <span>← LỐI RA</span>
            <span>LỐI RA →</span>
          </div>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap justify-center gap-7 border-t border-line pt-4 text-xs text-muted">
        {LEGEND.map(([label, style]) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`h-4 w-[18px] rounded border ${style}`} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
