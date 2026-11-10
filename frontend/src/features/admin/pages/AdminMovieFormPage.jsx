/**
 * Tên tệp: Trang biểu mẫu phim (AdminMovieFormPage.jsx)
 * Tên tệp tiếng Việt: Trang thêm mới và chỉnh sửa phim
 * Chức năng: Xử lý cả 2 chế độ:
 * 1. Thêm mới phim (mode = 'create', route: /admin/movies/create) - Khớp Figma Frame 1581:1520 & 1581:2022.
 * 2. Chỉnh sửa phim (mode = 'edit', route: /admin/movies/:id/edit) - Khớp Figma Frame 1581:2554.
 * - Cơ chế khóa bảo vệ: Nếu phim đã phát sinh vé đặt (hasBookings: true), tự động khóa toàn bộ
 *   các trường dữ liệu và lịch chiếu, chỉ cho phép quản trị viên đổi trạng thái phát hành (Figma Frame 1581:3065).
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createAdminMovie,
  getAdminMovieById,
  updateAdminMovie,
} from '../api/adminMovieApi';
import {
  GENRE_OPTIONS,
  MOVIE_STATUS,
} from '../api/mockMoviesData';

// Danh mục điều hướng thanh bên trái
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Tổng quan', active: false },
  { key: 'movies', label: 'Phim', active: true },
  { key: 'bookings', label: 'Đặt vé', active: false },
  { key: 'rooms', label: 'Phòng chiếu', active: false },
  { key: 'members', label: 'Thành viên', active: false },
  { key: 'staff', label: 'Nhân viên', active: false },
  { key: 'stats', label: 'Thống kê', active: false },
];

export default function AdminMovieFormPage({ mode = 'create' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit';

  const [loading, setLoading] = useState(isEdit);
  const [movie, setMovie] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [ageRating, setAgeRating] = useState('T16');
  const [version, setVersion] = useState('2D');
  const [releaseDate, setReleaseDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [director, setDirector] = useState('');
  const [studio, setStudio] = useState('');
  const [actors, setActors] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [status, setStatus] = useState(MOVIE_STATUS.COMING_SOON);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [posterUrl, setPosterUrl] = useState('');
  const [showtimes, setShowtimes] = useState(['09:30', '13:00', '16:30']);
  const [selectedCinema, setSelectedCinema] = useState('Lumière Nguyễn Du');
  const [selectedRoom, setSelectedRoom] = useState('Hall 03');

  // Validation Errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getAdminMovieById(id)
        .then((data) => {
          setMovie(data);
          setTitle(data.title || '');
          setDuration(data.duration || '');
          setAgeRating(data.ageRating || 'T16');
          setReleaseDate(data.releaseDate || '');
          setEndDate(data.endDate || '');
          setDirector(data.director || '');
          setStudio(data.studio || '');
          setActors(data.actors || '');
          setTrailerUrl(data.trailerUrl || '');
          setSynopsis(data.noi_dung || '');
          setStatus(data.status || MOVIE_STATUS.NOW_SHOWING);
          setSelectedGenres(data.genres || []);
          setPosterUrl(data.posterUrl || '');
          if (data.showtimeSlots) setShowtimes(data.showtimeSlots);
          if (data.cinemaName) setSelectedCinema(data.cinemaName);
          if (data.roomName) setSelectedRoom(data.roomName);
        })
        .catch(() => {
          navigate('/admin/movies');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEdit, id, navigate]);

  const toggleGenre = (genre) => {
    if (movie?.hasBookings) return;
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleValidate = () => {
    const newErrors = {};

    if (!posterUrl) {
      newErrors.poster = 'Vui lòng chọn ảnh bìa.';
    }

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tên phim.';
    }

    const durationNum = Number(duration);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      newErrors.duration = 'Thời lượng phải là số phút lớn hơn 0.';
    }

    if (!releaseDate) {
      newErrors.releaseDate = 'Vui lòng chọn ngày khởi chiếu.';
    }

    if (!endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc.';
    } else if (releaseDate && new Date(endDate) <= new Date(releaseDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày khởi chiếu.';
    }

    if (trailerUrl && !trailerUrl.startsWith('http')) {
      newErrors.trailerUrl = 'Đường dẫn trailer không hợp lệ.';
    }

    if (selectedGenres.length === 0) {
      newErrors.genres = 'Chọn ít nhất một thể loại.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu phim đã có vé, chỉ cho phép sửa trạng thái phát hành
    if (movie?.hasBookings) {
      setIsSubmitting(true);
      try {
        await updateAdminMovie(movie.id, { status });
        navigate('/admin/movies', {
          state: {
            toast: {
              type: 'success',
              title: 'Cập nhật trạng thái thành công',
              description: `Đã cập nhật trạng thái phát hành của bộ phim "${movie.title}".`,
            },
          },
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const isValid = handleValidate();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateAdminMovie(movie.id, {
          title,
          duration: Number(duration),
          ageRating,
          releaseDate,
          endDate,
          director,
          studio,
          actors,
          trailerUrl,
          noi_dung: synopsis,
          status,
          genres: selectedGenres,
          posterUrl,
          showtimeSlots: showtimes,
          cinemaName: selectedCinema,
          roomName: selectedRoom,
        });
        navigate('/admin/movies', {
          state: {
            toast: {
              type: 'success',
              title: 'Cập nhật phim thành công',
              description: `Bộ phim "${title}" đã được lưu thông tin thành công.`,
            },
          },
        });
      } else {
        await createAdminMovie({
          title,
          originalTitle: title,
          country: 'Việt Nam',
          duration: Number(duration),
          ageRating,
          releaseDate,
          endDate,
          director,
          studio,
          actors,
          trailerUrl,
          noi_dung: synopsis,
          status,
          genres: selectedGenres,
          posterUrl,
          showtimeSlots: showtimes,
          cinemaName: selectedCinema,
          roomName: selectedRoom,
        });
        navigate('/admin/movies', {
          state: {
            toast: {
              type: 'success',
              title: 'Thêm phim thành công',
              description: `Bộ phim "${title}" đã được thêm vào hệ thống rạp Galaxy Cinema.`,
            },
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasBookings = Boolean(movie?.hasBookings);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
        Đang tải dữ liệu phim...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Left Sidebar (Matching Figma Galaxy Cinema) */}
      <aside className="flex w-60 shrink-0 flex-col justify-between bg-[#14151A] text-slate-300">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 font-display text-sm font-bold text-white shadow-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4v-2a2 2 0 000-4V6z" />
              </svg>
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-wider text-white">GALAXY</p>
              <p className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
                Cinema Management
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-5">
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Không gian quản trị
            </p>
            <nav className="mt-2.5 space-y-1" aria-label="Menu quản trị">
              {NAV_ITEMS.map((item) => {
                const isActive = item.active;
                return (
                  <Link
                    key={item.key}
                    to={item.key === 'movies' ? '/admin/movies' : '#'}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-xs font-semibold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.key === 'movies' && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
                        48
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-4 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>Trung tâm hỗ trợ</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Hệ thống hoạt động ổn định</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">Galaxy Admin</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/admin/movies" className="hover:text-slate-800">
              Quản lý phim
            </Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-900">
              {isEdit ? 'Chỉnh sửa phim' : 'Thêm mới phim'}
            </span>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Tìm kiếm toàn hệ thống..."
                className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-10 pl-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
              />
              <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                ⌘ K
              </span>
            </div>

            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                A
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-900">Minh Anh</p>
                <p className="text-[11px] text-slate-500">Quản trị viên</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 px-8 py-6 max-w-6xl">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isEdit ? 'Chỉnh sửa phim' : 'Thêm mới phim'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isEdit
                ? hasBookings
                  ? 'Xem thông tin phim đã có vé.'
                  : 'Phim chưa có vé nên được sửa đầy đủ thông tin.'
                : 'Nhập thông tin phim và lịch chiếu ban đầu.'}
            </p>
          </div>

          {/* Warning Banner when movie has bookings (Frame 4 in Figma) */}
          {hasBookings && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
              <svg className="h-4 w-4 shrink-0 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Phim đã có vé nên không sửa được thông tin và lịch chiếu. Bạn chỉ đổi được trạng thái phát hành.
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column: Poster & Status */}
              <div className="space-y-6 lg:col-span-1">
                {/* Ảnh bìa Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900">Ảnh bìa</h3>
                  <p className="mt-0.5 text-[11px] text-slate-400">JPG hoặc PNG, tối đa 5 MB</p>

                  <div
                    className={`mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center aspect-[2/3] transition ${
                      errors.poster
                        ? 'border-rose-400 bg-rose-50/50'
                        : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt="Poster"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <>
                        <svg className="h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p className="mt-2 text-xs text-slate-500 font-medium">Chưa có ảnh</p>
                      </>
                    )}
                  </div>

                  {errors.poster && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.poster}</p>
                  )}

                  {!hasBookings && (
                    <button
                      type="button"
                      onClick={() => {
                        // Chọn ảnh mẫu nhanh phục vụ demo prototype
                        setPosterUrl(
                          'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=360&q=80',
                        );
                        setErrors((e) => ({ ...e, poster: null }));
                      }}
                      className="mt-3 w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                    >
                      {posterUrl ? 'Đổi ảnh' : 'Chọn tệp'}
                    </button>
                  )}
                </div>

                {/* Trạng thái phát hành Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900">Trạng thái phát hành</h3>
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Trạng thái
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-rose-500 focus:outline-none"
                    >
                      <option value={MOVIE_STATUS.NOW_SHOWING}>Đang chiếu</option>
                      <option value={MOVIE_STATUS.COMING_SOON}>Sắp chiếu</option>
                      <option value={MOVIE_STATUS.STOPPED}>Ngừng chiếu</option>
                    </select>
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    Ngừng chiếu sẽ ẩn phim khỏi lịch chiếu mới, dữ liệu vẫn được giữ.
                  </p>
                </div>
              </div>

              {/* Right Column: Information, Genre, Showtime */}
              <div className="space-y-6 lg:col-span-2">
                {/* Thông tin phim Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900">Thông tin phim</h3>
                  <p className="mt-0.5 text-[11px] text-slate-400">Các trường có dấu * là bắt buộc.</p>

                  <div className="mt-4 space-y-4 text-xs">
                    {/* Tên phim */}
                    <div>
                      <label className="block font-semibold text-slate-700">
                        Tên phim <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={hasBookings}
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (errors.title) setErrors((err) => ({ ...err, title: null }));
                        }}
                        placeholder="Nhập tên phim"
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none ${
                          errors.title
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : 'border-slate-200 bg-white focus:border-rose-500 disabled:bg-slate-50 disabled:text-slate-500'
                        }`}
                      />
                      {errors.title && (
                        <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
                      )}
                    </div>

                    {/* Thời lượng, Độ tuổi, Phiên bản */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block font-semibold text-slate-700">
                          Thời lượng (phút) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          disabled={hasBookings}
                          value={duration}
                          onChange={(e) => {
                            setDuration(e.target.value);
                            if (errors.duration) setErrors((err) => ({ ...err, duration: null }));
                          }}
                          placeholder="VD: 120"
                          className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none ${
                            errors.duration
                              ? 'border-rose-400 bg-rose-50/30'
                              : 'border-slate-200 bg-white disabled:bg-slate-50 disabled:text-slate-500'
                          }`}
                        />
                        {errors.duration && (
                          <p className="mt-1 text-xs text-rose-600">{errors.duration}</p>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700">
                          Độ tuổi <span className="text-rose-500">*</span>
                        </label>
                        <select
                          disabled={hasBookings}
                          value={ageRating}
                          onChange={(e) => setAgeRating(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-rose-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                        >
                          <option value="P">P</option>
                          <option value="K">K</option>
                          <option value="T13">T13</option>
                          <option value="T16">T16</option>
                          <option value="T18">T18</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700">Phiên bản</label>
                        <input
                          type="text"
                          readOnly
                          value={version}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Từ ngày - Đến ngày */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-slate-700">
                          Từ ngày <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          disabled={hasBookings}
                          value={releaseDate}
                          onChange={(e) => {
                            setReleaseDate(e.target.value);
                            if (errors.releaseDate) setErrors((err) => ({ ...err, releaseDate: null }));
                          }}
                          className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs text-slate-800 focus:outline-none ${
                            errors.releaseDate
                              ? 'border-rose-400 bg-rose-50/30'
                              : 'border-slate-200 bg-white disabled:bg-slate-50 disabled:text-slate-500'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700">
                          Đến ngày <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          disabled={hasBookings}
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            if (errors.endDate) setErrors((err) => ({ ...err, endDate: null }));
                          }}
                          className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs text-slate-800 focus:outline-none ${
                            errors.endDate
                              ? 'border-rose-400 bg-rose-50/30'
                              : 'border-slate-200 bg-white disabled:bg-slate-50 disabled:text-slate-500'
                          }`}
                        />
                        {errors.endDate && (
                          <p className="mt-1 text-xs text-rose-600">{errors.endDate}</p>
                        )}
                      </div>
                    </div>

                    {/* Đạo diễn & Hãng phim */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-slate-700">Đạo diễn</label>
                        <input
                          type="text"
                          disabled={hasBookings}
                          value={director}
                          onChange={(e) => setDirector(e.target.value)}
                          placeholder="Nhập tên đạo diễn"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700">Hãng phim</label>
                        <input
                          type="text"
                          disabled={hasBookings}
                          value={studio}
                          onChange={(e) => setStudio(e.target.value)}
                          placeholder="Nhập hãng phim"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Diễn viên */}
                    <div>
                      <label className="block font-semibold text-slate-700">Diễn viên</label>
                      <input
                        type="text"
                        disabled={hasBookings}
                        value={actors}
                        onChange={(e) => setActors(e.target.value)}
                        placeholder="Các diễn viên, cách nhau bằng dấu phẩy"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </div>

                    {/* Trailer */}
                    <div>
                      <label className="block font-semibold text-slate-700">Trailer</label>
                      <input
                        type="text"
                        disabled={hasBookings}
                        value={trailerUrl}
                        onChange={(e) => {
                          setTrailerUrl(e.target.value);
                          if (errors.trailerUrl) setErrors((err) => ({ ...err, trailerUrl: null }));
                        }}
                        placeholder="https://..."
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none ${
                          errors.trailerUrl
                            ? 'border-rose-400 bg-rose-50/30'
                            : 'border-slate-200 bg-white disabled:bg-slate-50 disabled:text-slate-500'
                        }`}
                      />
                      {errors.trailerUrl && (
                        <p className="mt-1 text-xs text-rose-600">{errors.trailerUrl}</p>
                      )}
                    </div>

                    {/* Nội dung */}
                    <div>
                      <label className="block font-semibold text-slate-700">Nội dung</label>
                      <textarea
                        rows={3}
                        disabled={hasBookings}
                        value={synopsis}
                        onChange={(e) => setSynopsis(e.target.value)}
                        placeholder="Tóm tắt nội dung phim"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Thể loại Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900">
                    Thể loại <span className="text-rose-500">*</span>
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-400">Chọn ít nhất một thể loại.</p>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                    {GENRE_OPTIONS.map((genre) => {
                      const isChecked = selectedGenres.includes(genre);
                      return (
                        <label
                          key={genre}
                          className={`flex items-center gap-2 cursor-pointer select-none ${
                            hasBookings ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={hasBookings}
                            checked={isChecked}
                            onChange={() => toggleGenre(genre)}
                            className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                          />
                          <span className="text-slate-700 font-medium">{genre}</span>
                        </label>
                      );
                    })}
                  </div>

                  {errors.genres && (
                    <p className="mt-2.5 text-xs text-rose-600 font-medium">{errors.genres}</p>
                  )}
                </div>

                {/* Lịch chiếu Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900">Lịch chiếu</h3>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {hasBookings
                      ? 'Suất chiếu đã có vé không sửa được.'
                      : 'Chọn rạp, phòng và các giờ chiếu; có thể chỉnh từng suất sau.'}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700">Rạp chiếu</label>
                      <select
                        disabled={hasBookings}
                        value={selectedCinema}
                        onChange={(e) => setSelectedCinema(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-rose-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                      >
                        <option value="Lumière Nguyễn Du">Lumière Nguyễn Du</option>
                        <option value="Galaxy Đà Nẵng">Galaxy Đà Nẵng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700">Phòng chiếu</label>
                      <select
                        disabled={hasBookings}
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-rose-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                      >
                        <option value="Hall 01">Hall 01</option>
                        <option value="Hall 02">Hall 02</option>
                        <option value="Hall 03">Hall 03</option>
                      </select>
                    </div>
                  </div>

                  {/* Showtime slots */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {showtimes.map((slot) => (
                      <span
                        key={slot}
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        {slot}
                      </span>
                    ))}
                    {!hasBookings && (
                      <button
                        type="button"
                        onClick={() => {
                          const newSlot = '18:30';
                          if (!showtimes.includes(newSlot)) {
                            setShowtimes([...showtimes, newSlot]);
                          }
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Thêm giờ chiếu
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/movies')}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    {hasBookings ? 'Quay lại' : 'Hủy'}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition disabled:opacity-50"
                  >
                    {isSubmitting
                      ? 'Đang lưu...'
                      : hasBookings
                        ? 'Lưu trạng thái'
                        : isEdit
                          ? 'Lưu thay đổi'
                          : 'Thêm phim'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
