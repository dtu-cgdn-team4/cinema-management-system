/** Poster phim; chưa có ảnh thì hiện ô thay thế cùng kích thước. */
export default function MoviePoster({ movie, className = '' }) {
  if (movie.posterUrl) {
    return <img src={movie.posterUrl} alt={`Poster ${movie.title}`} className={`object-cover ${className}`} />;
  }
  return (
    <div
      role="img"
      aria-label={`Poster ${movie.title}`}
      className={`grid place-items-center bg-gradient-to-b from-brand/50 to-card font-display font-bold text-white/80 ${className}`}
    >
      {movie.title.slice(0, 1)}
    </div>
  );
}
