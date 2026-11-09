import { MapPin } from 'lucide-react';
import SectionCard from './SectionCard';

/** Bước 2: chọn khu vực rồi chọn rạp trong khu vực đó. */
export default function CinemaPicker({ cinemas, city, cinemaId, onCityChange, onCinemaChange }) {
  const cities = [...new Set(cinemas.map((c) => c.city))];
  const inCity = cinemas.filter((c) => c.city === city);
  const countOf = (name) => cinemas.filter((c) => c.city === name).length;
  return (
    <SectionCard
      title="2. Chọn vị trí & cụm rạp"
      aside={
        <label className="flex items-center gap-2">
          Khu vực:
          <select
            value={city ?? ''}
            onChange={(e) => onCityChange(e.target.value)}
            className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-brand"
          >
            {cities.map((name) => (
              <option key={name} value={name}>
                {name} ({countOf(name)} rạp)
              </option>
            ))}
          </select>
        </label>
      }
    >
      <div className="flex flex-wrap gap-2.5 border-t border-line pt-4">
        {inCity.map((cinema) => {
          const active = cinema.id === cinemaId;
          return (
            <button
              key={cinema.id}
              type="button"
              onClick={() => onCinemaChange(cinema.id)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                active
                  ? 'border-brand bg-brand text-white shadow-[0_4px_6px_-1px_rgba(234,56,77,0.2)]'
                  : 'border-line bg-card text-zinc-300 hover:border-white/20 hover:text-white'
              }`}
            >
              <MapPin size={14} className={active ? 'text-white' : 'text-brand'} />
              {cinema.name}
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
