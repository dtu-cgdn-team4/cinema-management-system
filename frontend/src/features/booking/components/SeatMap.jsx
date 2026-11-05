// Màu theo business-rules "Sơ đồ ghế trên giao diện": xám trống, viền vàng VIP, viền xanh đã có người, nền đỏ đang chọn
const SEAT_STYLE = {
  THUONG: 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/40 hover:text-white',
  VIP: 'border-warn/70 bg-white/5 text-warn hover:bg-warn/10',
  TAKEN: 'cursor-not-allowed border-info/60 bg-info/10 text-info/50',
  SELECTED: 'border-brand bg-brand text-white shadow-[0_4px_10px_rgba(234,56,77,0.4)]',
};

const LEGEND = [
  ['Ghế trống', SEAT_STYLE.THUONG],
  ['Ghế VIP', SEAT_STYLE.VIP],
  ['Đã có người', SEAT_STYLE.TAKEN],
  ['Đang chọn', SEAT_STYLE.SELECTED],
];

/** `rows` từ API sơ đồ ghế; `column` là vị trí trên lưới, cột trống là lối đi. */
export default function SeatMap({ rows, selectedIds, onToggle }) {
  const columns = Math.max(...rows.flatMap((r) => r.seats.map((s) => s.column)));
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="mx-auto w-max px-2">
          <div className="mx-auto mb-8 w-4/5">
            <div className="h-3 rounded-t-[100%] border-t-2 border-white/70 shadow-[0_-10px_24px_rgba(255,255,255,0.12)]" />
            <p className="text-center text-[10px] tracking-[0.3em] text-subtle">MÀN HÌNH</p>
          </div>

          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.name} className="flex items-center gap-3">
                <span className="w-4 text-center text-xs font-bold text-muted">{row.name}</span>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columns}, 2.25rem)` }}>
                  {row.seats.map((seat) => {
                    const taken = seat.status === 'TAKEN';
                    const selected = selectedIds.has(seat.id);
                    const style = taken ? SEAT_STYLE.TAKEN : selected ? SEAT_STYLE.SELECTED : SEAT_STYLE[seat.type];
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={taken}
                        onClick={() => onToggle(seat)}
                        aria-pressed={selected}
                        aria-label={`Ghế ${seat.label}${seat.type === 'VIP' ? ' VIP' : ''}${taken ? ', đã có người' : ''}`}
                        style={{ gridColumn: seat.column }}
                        className={`h-8 rounded-md border text-[11px] font-semibold transition ${style}`}
                      >
                        {String(seat.number).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>
                <span className="w-4 text-center text-xs font-bold text-muted">{row.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-line pt-4 text-xs text-muted">
        {LEGEND.map(([label, style]) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`h-4 w-4 rounded border ${style}`} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
