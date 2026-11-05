import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/format';
import {
  fetchAdminMovies,
  resetAdminMoviesMock,
  softDeleteAdminMovie,
} from '../api/adminMovieApi';
import {
  AGE_RATING_META,
  GENRE_OPTIONS,
  MOVIE_STATUS,
  MOVIE_STATUS_META,
} from '../api/mockMoviesData';
import SoftDeleteMovieModal from '../components/SoftDeleteMovieModal';

const STATUS_TABS = [
  { key: 'ALL', label: 'Tất cả phim' },
  { key: MOVIE_STATUS.NOW_SHOWING, label: 'Đang chiếu' },
  { key: MOVIE_STATUS.COMING_SOON, label: 'Sắp chiếu' },
  { key: MOVIE_STATUS.STOPPED, label: 'Ngừng chiếu' },
];

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Tổng quan', active: false },
  { key: 'movies', label: 'Phim', active: true },
  { key: 'bookings', label: 'Đặt vé', active: false },
  { key: 'rooms', label: 'Phòng chiếu', active: false },
  { key: 'members', label: 'Thành viên', active: false },
  { key: 'staff', label: 'Nhân viên', active: false },
  { key: 'stats', label: 'Thống kê', active: false },
];

export default function AdminMovieListPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [movies, setMovies] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summaryCounts, setSummaryCounts] = useState({
    ALL: 0,
    [MOVIE_STATUS.NOW_SHOWING]: 0,
    [MOVIE_STATUS.COMING_SOON]: 0,
    [MOVIE_STATUS.STOPPED]: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bannerMessage, setBannerMessage] = useState(null);

  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchAdminMovies({
        keyword,
        genre: selectedGenre,
        status: selectedStatus,
        page,
        size: pageSize,
      });
      setMovies(response.items);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
      setSummaryCounts(response.summaryCounts);
      if (response.page !== page) {
        setPage(response.page);
      }
    } catch (err) {
      setBannerMessage({
        type: 'error',
        text: err.message || 'Không thể tải danh sách phim.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [keyword, selectedGenre, selectedStatus, page, pageSize]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const showTemporaryBanner = (type, text) => {
    setBannerMessage({ type, text });
    window.clearTimeout(window.__cineopsBannerTimer);
    window.__cineopsBannerTimer = window.setTimeout(() => {
      setBannerMessage(null);
    }, 4000);
  };

  const handleConfirmSoftDelete = async (movieId) => {
    setIsDeleting(true);
    try {
      const updated = await softDeleteAdminMovie(movieId);
      setMovieToDelete(null);
      await loadMovies();
      showTemporaryBanner(
        'success',
        `Đã chuyển bộ phim "${updated.title}" (${updated.code}) sang trạng thái Ngừng chiếu.`,
      );
    } catch (err) {
      showTemporaryBanner('error', err.message || 'Không thể cập nhật trạng thái phim.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetDemoData = async () => {
    await resetAdminMoviesMock();
    setKeyword('');
    setSelectedGenre('ALL');
    setSelectedStatus('ALL');
    setPage(1);
    await loadMovies();
    showTemporaryBanner('info', 'Đã khôi phục bộ dữ liệu phim mẫu ban đầu.');
  };

  const handleExportCsv = () => {
    if (!movies.length) {
      showTemporaryBanner('info', 'Không có dữ liệu phim trong danh sách hiện tại để xuất.');
      return;
    }

    const headers = [
      'Mã phim',
      'Tên phim',
      'Tên gốc',
      'Quốc gia',
      'Thể loại',
      'Thời lượng (phút)',
      'Độ tuổi',
      'Ngày khởi chiếu',
      'Định dạng',
      'Tổng suất chiếu',
      'Trạng thái',
    ];

    const rows = movies.map((m) => [
      m.code,
      `"${m.title.replace(/"/g, '""')}"`,
      `"${m.originalTitle.replace(/"/g, '""')}"`,
      m.country,
      `"${m.genres.join(', ')}"`,
      m.duration,
      m.ageRating,
      formatDate(m.releaseDate),
      `"${m.formats.join(', ')}"`,
      m.totalShowtimes,
      MOVIE_STATUS_META[m.status]?.label ?? m.status,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'danh-sach-phim-cineops.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showTemporaryBanner('success', 'Đã xuất danh sách phim ra file Excel/CSV thành công.');
  };

  const startItemIndex = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItemIndex = Math.min(page * pageSize, totalElements);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Left Sidebar Navigation */}
      <aside className="flex w-60 shrink-0 flex-col justify-between bg-[#14151A] text-slate-300">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 font-display text-sm font-bold text-white shadow-sm">
              CO
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-wider text-white">CINEOPS</p>
              <p className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
                Cinema Management
              </p>
            </div>
          </div>

          {/* Navigation Group */}
          <div className="px-3 py-5">
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Không gian quản trị
            </p>
            <nav className="mt-2.5 space-y-1" aria-label="Menu quản trị">
              {NAV_ITEMS.map((item) => {
                const isActive = item.active;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      if (!isActive) {
                        showTemporaryBanner(
                          'info',
                          `Phân hệ "${item.label}" thuộc phạm vi các Task khác trong Sprint.`,
                        );
                      }
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.key === 'movies' && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {summaryCounts.ALL}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-4 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>Trung tâm hỗ trợ</span>
            <Link
              to="/dat-ve"
              className="text-rose-400 underline-offset-2 hover:text-rose-300 hover:underline"
            >
              Trang khách
            </Link>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Hệ thống hoạt động ổn định</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">CineOps Admin v2.4.0</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Quản lý phim</span>
            <span>/</span>
            <span className="font-semibold text-slate-900">Danh sách phim</span>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm kiếm toàn hệ thống..."
                className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-10 pl-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none"
              />
              <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                ⌘K
              </span>
            </div>

            <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                NM
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-900">Minh Nguyên</p>
                <p className="text-[11px] text-slate-500">Quản trị viên</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 px-8 py-6">
          {/* Page Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý phim</h1>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {summaryCounts.ALL} phim
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Danh sách và quản lý trạng thái phát hành các bộ phim tại rạp
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                showTemporaryBanner(
                  'info',
                  'Chức năng Thêm mới phim sẽ được triển khai ở Task 4 (Mục 6.14.1.2 SRS).',
                )
              }
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-rose-700"
            >
              <span>+ Thêm mới phim</span>
            </button>
          </div>

          {/* Feedback Banner */}
          {bannerMessage && (
            <div
              className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium ${
                bannerMessage.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : bannerMessage.type === 'error'
                    ? 'border-rose-200 bg-rose-50 text-rose-800'
                    : 'border-sky-200 bg-sky-50 text-sky-800'
              }`}
            >
              <span>{bannerMessage.text}</span>
              <button
                type="button"
                onClick={() => setBannerMessage(null)}
                className="ml-4 text-xs font-bold underline opacity-75 hover:opacity-100"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Table Card */}
          <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            {/* Quick Status Tabs */}
            <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 px-6 pt-3">
              {STATUS_TABS.map((tab) => {
                const isSelected = selectedStatus === tab.key;
                const count = summaryCounts[tab.key] ?? 0;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(tab.key);
                      setPage(1);
                    }}
                    className={`relative flex items-center gap-2 pb-3 text-xs font-semibold transition ${
                      isSelected
                        ? 'border-b-2 border-rose-600 text-rose-600'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                        isSelected
                          ? 'bg-rose-50 font-bold text-rose-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/50 px-6 py-3.5">
              <div className="flex flex-wrap items-center gap-3">
                {/* Quick Search Input */}
                <div className="relative">
                  <svg
                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Tìm kiếm theo tên phim..."
                    className="w-64 rounded-lg border border-slate-200 bg-white py-2 pr-8 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none"
                  />
                  {keyword && (
                    <button
                      type="button"
                      onClick={() => {
                        setKeyword('');
                        setPage(1);
                      }}
                      aria-label="Xóa từ khóa tìm kiếm"
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Genre Filter Dropdown */}
                <select
                  aria-label="Lọc theo thể loại"
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-rose-500 focus:outline-none"
                >
                  <option value="ALL">Tất cả thể loại</option>
                  {GENRE_OPTIONS.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>

                {/* Status Filter Dropdown */}
                <select
                  aria-label="Lọc theo trạng thái"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-rose-500 focus:outline-none"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value={MOVIE_STATUS.NOW_SHOWING}>Đang chiếu</option>
                  <option value={MOVIE_STATUS.COMING_SOON}>Sắp chiếu</option>
                  <option value={MOVIE_STATUS.STOPPED}>Ngừng chiếu</option>
                </select>
              </div>

              {/* Right Utilities */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <span>Xuất Excel</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  title="Khôi phục dữ liệu mẫu ban đầu"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <span>Làm mới mẫu</span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    <th className="py-3 pr-2 pl-6">Poster</th>
                    <th className="px-3 py-3">Tên phim</th>
                    <th className="px-3 py-3">Thể loại</th>
                    <th className="px-3 py-3">Thời lượng</th>
                    <th className="px-3 py-3">Độ tuổi</th>
                    <th className="px-3 py-3">Ngày khởi chiếu</th>
                    <th className="px-3 py-3">Định dạng</th>
                    <th className="px-3 py-3">Tổng suất chiếu</th>
                    <th className="px-3 py-3">Trạng thái</th>
                    <th className="py-3 pr-6 pl-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-sm text-slate-500">
                        Đang tải danh sách phim...
                      </td>
                    </tr>
                  ) : movies.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center">
                        <p className="text-sm font-semibold text-slate-700">
                          Không tìm thấy bộ phim nào phù hợp
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Hãy thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc thể loại, trạng thái.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    movies.map((movie) => {
                      const statusMeta =
                        MOVIE_STATUS_META[movie.status] ?? MOVIE_STATUS_META.NOW_SHOWING;
                      const ageMeta = AGE_RATING_META[movie.ageRating] ?? {
                        label: movie.ageRating,
                        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                      };
                      const isStopped = movie.status === MOVIE_STATUS.STOPPED;

                      return (
                        <tr
                          key={movie.id}
                          className="transition hover:bg-slate-50/80"
                        >
                          {/* Poster */}
                          <td className="py-3.5 pr-2 pl-6">
                            <img
                              src={movie.posterUrl}
                              alt={`Poster ${movie.title}`}
                              className="h-12 w-9 rounded-md border border-slate-200 object-cover shadow-2xs"
                              loading="lazy"
                            />
                          </td>

                          {/* Tên phim */}
                          <td className="px-3 py-3.5">
                            <p className="font-bold text-slate-900">{movie.title}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {movie.code} • {movie.originalTitle} • {movie.country}
                            </p>
                          </td>

                          {/* Thể loại */}
                          <td className="px-3 py-3.5 text-slate-600">
                            {movie.genres.join(', ')}
                          </td>

                          {/* Thời lượng */}
                          <td className="px-3 py-3.5 font-medium text-slate-700">
                            {movie.duration} phút
                          </td>

                          {/* Độ tuổi */}
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center justify-center rounded border px-2 py-0.5 text-[11px] font-bold ${ageMeta.badgeClass}`}
                            >
                              {ageMeta.label}
                            </span>
                          </td>

                          {/* Ngày khởi chiếu */}
                          <td className="px-3 py-3.5 font-medium text-slate-700">
                            {formatDate(movie.releaseDate)}
                          </td>

                          {/* Định dạng */}
                          <td className="px-3 py-3.5 text-slate-600">
                            {movie.formats.join(', ')}
                          </td>

                          {/* Tổng suất chiếu */}
                          <td className="px-3 py-3.5 font-bold text-slate-900">
                            {movie.totalShowtimes}
                          </td>

                          {/* Trạng thái */}
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>

                          {/* Thao tác */}
                          <td className="py-3.5 pr-6 pl-3 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  showTemporaryBanner(
                                    'info',
                                    `Chức năng Sửa phim "${movie.title}" sẽ được triển khai ở Task 4 (Mục 6.14.1.3 SRS).`,
                                  )
                                }
                                title="Chỉnh sửa phim"
                                aria-label={`Chỉnh sửa phim ${movie.title}`}
                                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              >
                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                </svg>
                              </button>

                              <button
                                type="button"
                                disabled={isStopped}
                                onClick={() => setMovieToDelete(movie)}
                                title={
                                  isStopped
                                    ? 'Phim đã ở trạng thái Ngừng chiếu'
                                    : 'Ngừng phát hành phim (Xóa mềm)'
                                }
                                aria-label={`Ngừng phát hành phim ${movie.title}`}
                                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                              >
                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-white px-6 py-3.5 text-xs text-slate-600">
              <p>
                Hiển thị <span className="font-semibold text-slate-900">{startItemIndex}</span> -{' '}
                <span className="font-semibold text-slate-900">{endItemIndex}</span> trên tổng số{' '}
                <span className="font-semibold text-slate-900">{totalElements}</span> phim
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Số dòng / trang</span>
                  <select
                    aria-label="Số dòng trên mỗi trang"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:border-rose-500 focus:outline-none"
                  >
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Trang trước"
                    className="rounded-lg border border-slate-200 px-2.5 py-1 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`min-w-[28px] rounded-lg px-2.5 py-1 font-semibold transition ${
                        pageNum === page
                          ? 'bg-rose-600 text-white'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Trang sau"
                    className="rounded-lg border border-slate-200 px-2.5 py-1 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom helper note */}
          <p className="mt-3 text-xs text-slate-500">
            Ghi chú nghiệp vụ: Ngừng phát hành phim chỉ ẩn phim khỏi lịch chiếu mới. Dữ liệu phim và
            lịch sử đặt vé vẫn được lưu giữ nguyên vẹn trong cơ sở dữ liệu.
          </p>
        </main>
      </div>

      {/* Soft Delete Confirmation Modal */}
      <SoftDeleteMovieModal
        movie={movieToDelete}
        isOpen={Boolean(movieToDelete)}
        isSubmitting={isDeleting}
        onClose={() => setMovieToDelete(null)}
        onConfirm={handleConfirmSoftDelete}
      />
    </div>
  );
}
