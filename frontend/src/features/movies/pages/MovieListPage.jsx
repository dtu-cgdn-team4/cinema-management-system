import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronRight,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  HelpCircle,
  Calendar,
  Clock,
  Film,
  Ticket,
  Info,
  Loader2
} from 'lucide-react';
import MovieCard from '@/components/common/MovieCard';
import AgeBadge from '@/components/common/AgeBadge';
import { movieApi } from '../api/movieApi';
import { MOCK_MOVIES, GENRE_OPTIONS, SORT_OPTIONS } from '../data/mockMovies';

export default function MovieListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);

  const queryQ = searchParams.get('q') || '';
  const queryStatus = searchParams.get('status') || 'ALL';
  const queryGenre = searchParams.get('genre') || 'Tất cả thể loại';
  const querySort = searchParams.get('sort') || 'recommended';

  const [searchQuery, setSearchQuery] = useState(queryQ);
  const [activeTab, setActiveTab] = useState(queryStatus);
  const [selectedGenre, setSelectedGenre] = useState(queryGenre);
  const [sortBy, setSortBy] = useState(querySort);
  const [viewMode, setViewMode] = useState('grid');

  const [apiMovies, setApiMovies] = useState(null);
  const [availableGenres, setAvailableGenres] = useState(GENRE_OPTIONS); //
  const [loading, setLoading] = useState(false);
  const [isUsingBackend, setIsUsingBackend] = useState(false);

  useEffect(() => {
    if (searchParams.get('focus') === 'search') {
      searchInputRef.current?.focus();
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchQuery(queryQ);
  }, [queryQ]);

  useEffect(() => {
    movieApi.getGenres()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          const names = ['Tất cả thể loại', ...res.data.map((g) => g.ten)];
          setAvailableGenres(names);
        }
      })
      .catch(() => {
        setAvailableGenres(GENRE_OPTIONS); //
      });
  }, []);

  // Gọi API backend khi bộ lọc thay đổi
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    movieApi.getMovies({
      keyword: searchQuery,
      status: activeTab,
      genreName: selectedGenre,
      sortBy: sortBy,
      page: 0,
      size: 50
    })
      .then((res) => {
        if (!isMounted) return;
        if (res?.data?.items) {
          const formatted = res.data.items.map((m) => ({
            id: String(m.id),
            title: m.tenPhim,
            englishTitle: m.tenPhim,
            genre: (m.theLoai && m.theLoai.length > 0) ? m.theLoai.join(', ') : 'Điện ảnh',
            genres: m.theLoai || [],
            ageRating: m.nhanTuoi || 'P',
            duration: m.thoiLuong,
            releaseDate: m.ngayKhoiChieu,
            // rating: 8.5, // Giả lập rating
            status: m.status,
            formats: ['2D', 'Digital'],
            posterUrl: m.posterUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop',
            director: m.daoDien,
            actors: m.dienVien ? m.dienVien.split(',').map((s) => s.trim()) : [],
            description: m.noiDung
          }));
          setApiMovies(formatted);
          setIsUsingBackend(true);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setApiMovies(null);
        setIsUsingBackend(false);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, activeTab, selectedGenre, sortBy]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'ALL' && value !== 'Tất cả thể loại' && value !== 'recommended') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    updateUrlParams({ q: value });
  };

  const handleTabChange = (status) => {
    setActiveTab(status);
    updateUrlParams({ status });
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    updateUrlParams({ genre });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    updateUrlParams({ sort });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('ALL');
    setSelectedGenre('Tất cả thể loại');
    setSortBy('recommended');
    setSearchParams({});
  };

  const dataSource = apiMovies !== null ? apiMovies : MOCK_MOVIES;

  // Tính số lượng cho từng tab
  const matchedBySearch = useMemo(() => {
    let result = dataSource;
    if (!isUsingBackend) {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        result = result.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            (m.englishTitle && m.englishTitle.toLowerCase().includes(q)) ||
            (m.actors && m.actors.some((a) => a.toLowerCase().includes(q))) ||
            (m.director && m.director.toLowerCase().includes(q))
        );
      }
      if (selectedGenre !== 'Tất cả thể loại') {
        result = result.filter((m) =>
          m.genres ? m.genres.includes(selectedGenre) : m.genre.includes(selectedGenre)
        );
      }
    }
    return result;
  }, [dataSource, searchQuery, selectedGenre, isUsingBackend]);

  const countAll = matchedBySearch.length;
  const countNowShowing = matchedBySearch.filter((m) => m.status === 'NOW_SHOWING').length;
  const countComingSoon = matchedBySearch.filter((m) => m.status === 'COMING_SOON').length;

  const displayMovies = useMemo(() => {
    if (isUsingBackend) {
      return dataSource;
    }
    let result = matchedBySearch;

    if (activeTab === 'NOW_SHOWING') {
      result = result.filter((m) => m.status === 'NOW_SHOWING');
    } else if (activeTab === 'COMING_SOON') {
      result = result.filter((m) => m.status === 'COMING_SOON');
    }

    // if (sortBy === 'rating_desc') {
    //   result = [...result].sort((a, b) => b.rating - a.rating);
    // } else 
    if (sortBy === 'release_desc') {
      result = [...result].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortBy === 'duration_asc') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'duration_desc') {
      result = [...result].sort((a, b) => b.duration - a.duration);
    }

    return result;
  }, [dataSource, matchedBySearch, activeTab, sortBy, isUsingBackend]);

  const handleBooking = (title) => {
    alert(`Chuyển đến chọn suất chiếu cho phim: ${title}`);
  };

  const handleDetail = (title) => {
    alert(`Xem chi tiết phim: ${title}`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7">

      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/movies" className="hover:text-white transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium">Danh sách phim</span>
        {searchQuery.trim() && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-galaxy-red font-medium truncate max-w-[200px]">
              "{searchQuery}"
            </span>
          </>
        )}
      </nav>

      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-7 bg-galaxy-red rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Danh sách phim
            </h1>
          </div>
          {/* {isUsingBackend && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              ● Đã kết nối MySQL Backend API
            </span>
          )} */}
        </div>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Khám phá danh sách các phim đang chiếu và sắp chiếu tại Galaxy Cinema. Tìm kiếm phim yêu thích và đặt vé xem ngay hôm nay.
        </p>
      </div>

      <div className="bg-[#0E1524] p-5 sm:p-6 rounded-2xl border border-[#1F2B3E] shadow-xl space-y-5">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm theo tên phim, đạo diễn hoặc diễn viên..."
            className="w-full bg-[#131B2A] text-sm sm:text-base text-white placeholder-slate-400 pl-12 pr-10 py-3.5 rounded-xl border border-[#222E42] focus:outline-none focus:border-galaxy-red focus:ring-2 focus:ring-galaxy-red/30 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-[#1D273A]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleTabChange('ALL')}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-galaxy-red text-white shadow-md shadow-galaxy-red/30'
                  : 'bg-[#151D2E] text-slate-300 hover:text-white border border-[#222E42] hover:bg-slate-800'
              }`}
            >
              <span>Tất cả</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {countAll}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('NOW_SHOWING')}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'NOW_SHOWING'
                  ? 'bg-galaxy-red text-white shadow-md shadow-galaxy-red/30'
                  : 'bg-[#151D2E] text-slate-300 hover:text-white border border-[#222E42] hover:bg-slate-800'
              }`}
            >
              <span>Phim đang chiếu</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'NOW_SHOWING' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {countNowShowing}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('COMING_SOON')}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'COMING_SOON'
                  ? 'bg-galaxy-red text-white shadow-md shadow-galaxy-red/30'
                  : 'bg-[#151D2E] text-slate-300 hover:text-white border border-[#222E42] hover:bg-slate-800'
              }`}
            >
              <span>Phim sắp chiếu</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'COMING_SOON' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {countComingSoon}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="relative min-w-[170px] flex-1 sm:flex-initial">
              <select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="w-full appearance-none bg-[#131B2A] text-xs sm:text-sm text-slate-200 pl-3.5 pr-9 py-2 rounded-xl border border-[#222E42] focus:outline-none focus:border-galaxy-red cursor-pointer"
              >
                {availableGenres.map((genre) => (
                  <option key={genre} value={genre} className="bg-[#131B2A] text-white">
                    {genre}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative min-w-[170px] flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full appearance-none bg-[#131B2A] text-xs sm:text-sm text-slate-200 pl-3.5 pr-9 py-2 rounded-xl border border-[#222E42] focus:outline-none focus:border-galaxy-red cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#131B2A] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 border-b border-slate-800/80 pb-3">
        <div>
          {searchQuery.trim() ? (
            <span>
              Tìm thấy <strong className="text-white font-bold">{displayMovies.length}</strong> kết quả cho "
              <span className="text-galaxy-red font-semibold">{searchQuery}</span>"
            </span>
          ) : (
            <span>
              Hiển thị <strong className="text-white font-bold">{displayMovies.length}</strong> phim{' '}
              {activeTab === 'ALL'
                ? 'trong danh sách'
                : activeTab === 'NOW_SHOWING'
                ? 'đang chiếu'
                : 'sắp chiếu'}
            </span>
          )}
          {(selectedGenre !== 'Tất cả thể loại' || sortBy !== 'recommended') && (
            <span className="text-slate-400 ml-1.5 hidden sm:inline">(có bộ lọc nâng cao)</span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-[#131B2A] p-1 rounded-lg border border-[#222E42]">
          <button
            onClick={() => setViewMode('grid')}
            type="button"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-galaxy-red text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Chế độ xem dạng Lưới (Grid)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            type="button"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-galaxy-red text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Chế độ xem dạng Danh sách (List)"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6 text-sm text-slate-400 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-galaxy-red" />
          <span>Đang tải danh sách phim...</span>
        </div>
      )}

      {displayMovies.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="bg-[#131B2A] rounded-2xl border border-[#222E42] overflow-hidden shadow-xl">
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-[#101724] border-b border-[#222E42] text-xs font-semibold uppercase tracking-wider text-slate-400">
              <div className="col-span-6">Phim</div>
              <div className="col-span-2 text-center">Khởi chiếu</div>
              <div className="col-span-2 text-center">Thời lượng</div>
              <div className="col-span-2 text-right">Thao tác</div>
            </div>

            <div className="divide-y divide-[#1D273A]">
              {displayMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="p-4 sm:p-5 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-[#182235]/60 transition-colors"
                >

                  <div className="col-span-6 flex items-start gap-4">
                    <div className="relative w-16 sm:w-20 aspect-[2/3] shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-slate-700/60 shadow-md">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <AgeBadge rating={movie.ageRating} size="sm" />
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            movie.status === 'NOW_SHOWING'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          }`}
                        >
                          {movie.status === 'NOW_SHOWING' ? 'Đang chiếu' : 'Sắp chiếu'}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white hover:text-galaxy-red transition-colors truncate">
                        {movie.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        {movie.genre}
                      </p>

                      {movie.actors && movie.actors.length > 0 && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 hidden sm:block">
                          Diễn viên: {movie.actors.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 col-span-2 text-left md:text-center text-xs text-slate-300 flex items-center md:justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 md:hidden" />
                    <span className="font-mono">
                      {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className="mt-1 md:mt-0 col-span-2 text-left md:text-center text-xs text-slate-300 flex items-center md:justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 md:hidden" />
                    <span>{movie.duration} phút</span>
                  </div>

                  <div className="mt-4 md:mt-0 col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDetail(movie.title)}
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Chi tiết
                    </button>

                    <button
                      onClick={() => handleBooking(movie.title)}
                      type="button"
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-galaxy-red to-[#FF4D6D] hover:from-[#E61E43] hover:to-galaxy-red shadow-md shadow-galaxy-red/20 transition-all hover:scale-105"
                    >
                      Đặt vé
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="py-16 text-center space-y-4 bg-[#111726]/60 rounded-2xl border border-[#1E293B]">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
            <Film className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">
              Không tìm thấy phim phù hợp
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Không có bộ phim nào khớp với từ khóa "{searchQuery}" hoặc tiêu chí bộ lọc đã chọn.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-[#101726] border border-[#1E293B] flex items-center gap-3 text-xs text-slate-400">
        <HelpCircle className="w-4 h-4 text-galaxy-red shrink-0" />
        <span>
          Không tìm thấy phim bạn muốn? Vui lòng thử lại với từ khóa khác hoặc liên hệ bộ phận hỗ trợ rạp Galaxy Cinema qua hotline{' '}
          <strong className="text-white">1900 2224</strong>.
        </span>
      </div>
    </div>
  );
}
