const COLORS = {
  P: 'bg-emerald-600',
  K: 'bg-sky-600',
  T13: 'bg-amber-500',
  T16: 'bg-orange-600',
  T18: 'bg-brand-dark',
};

export default function AgeBadge({ rating, className = '' }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white ${COLORS[rating] ?? 'bg-zinc-600'} ${className}`}
    >
      {rating}
    </span>
  );
}
