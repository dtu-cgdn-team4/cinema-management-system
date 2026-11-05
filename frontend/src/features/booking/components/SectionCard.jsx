/** Khung có tiêu đề chấm đỏ, dùng cho từng bước trong trang chọn suất chiếu. */
export default function SectionCard({ title, aside, children }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {title}
        </h2>
        {aside && <div className="text-[11px] text-muted">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
