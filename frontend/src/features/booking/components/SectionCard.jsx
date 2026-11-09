/** Khung có tiêu đề chấm đỏ, dùng cho từng bước trong trang đặt vé. */
export default function SectionCard({ title, aside, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.7px] text-white">
          <span className="h-2 w-2 rounded-full bg-brand" />
          {title}
        </h2>
        {aside && <div className="text-xs text-muted">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
