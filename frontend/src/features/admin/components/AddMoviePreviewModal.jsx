/**
 * Tên tệp: Hộp thoại xem trước thêm/sửa phim (AddMoviePreviewModal.jsx)
 * Tên tệp tiếng Việt: Hộp thoại xem trước biểu mẫu phim
 * Chức năng: Thành phần phụ trợ cung cấp bản xem nhanh biểu mẫu thêm mới
 * hoặc chỉnh sửa phim khi quản trị viên không muốn rời khỏi trang danh sách.
 */
import { useEffect } from 'react';

export default function AddMoviePreviewModal({
  isOpen,
  onClose,
  mode = 'create', // Chế độ: 'create' (Thêm mới) hoặc 'edit' (Chỉnh sửa)
  movie = null,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEdit = mode === 'edit' && movie;
  const title = isEdit ? `Chỉnh sửa phim: ${movie.title}` : 'Thêm mới phim vào rạp';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600">
                Sprint 1 • Task 4
              </span>
              <span className="text-xs text-slate-400">SRS Mục 6.14.1.2 & 6.14.1.3</span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500">
              Giao diện biểu mẫu prototype được thiết kế chuẩn theo hệ thống CineOps trên Figma
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Prototype Form Content */}
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Left Column: Poster Upload Box */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700">
              Poster phim <span className="text-rose-500">*</span>
            </label>
            <div className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center aspect-[2/3] hover:bg-slate-100/80 transition cursor-pointer">
              {isEdit && movie?.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-700">Tải ảnh poster</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Hỗ trợ PNG, JPG (Tối đa 5MB)</p>
                  <p className="mt-1 text-[10px] text-sky-600 font-medium">Tích hợp Cloudinary</p>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Fields */}
          <div className="space-y-4 sm:col-span-2 text-xs">
            {/* Tên phim */}
            <div>
              <label className="block font-semibold text-slate-700">
                Tên phim <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                defaultValue={isEdit ? movie.title : ''}
                placeholder="Ví dụ: Mai, Dune: Part Two..."
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            {/* Thể loại & Thời lượng */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700">
                  Thể loại chính <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  defaultValue={isEdit ? movie.genres.join(', ') : 'Tâm lý, Tình cảm'}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">
                  Thời lượng (phút) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  readOnly
                  defaultValue={isEdit ? movie.duration : 120}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Độ tuổi & Định dạng */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700">
                  Mác độ tuổi <span className="text-rose-500">*</span>
                </label>
                <select
                  disabled
                  defaultValue={isEdit ? movie.ageRating : 'C18'}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="P">P - Phổ biến mọi lứa tuổi</option>
                  <option value="C13">C13 - Cấm dưới 13 tuổi</option>
                  <option value="C16">C16 - Cấm dưới 16 tuổi</option>
                  <option value="C18">C18 - Cấm dưới 18 tuổi</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">
                  Định dạng chiếu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  readOnly
                  defaultValue={isEdit ? movie.formats.join(', ') : '2D, IMAX'}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Khoảng ngày chiếu */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700">
                  Ngày khởi chiếu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  readOnly
                  defaultValue={isEdit ? movie.releaseDate : '2026-11-20'}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">
                  Ngày kết thúc dự kiến <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  readOnly
                  defaultValue={isEdit ? movie.endDate : '2026-12-31'}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Đạo diễn & Diễn viên */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700">Đạo diễn</label>
                <input
                  type="text"
                  readOnly
                  defaultValue={isEdit ? movie.director : ''}
                  placeholder="Tên đạo diễn"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Hãng sản xuất</label>
                <input
                  type="text"
                  readOnly
                  defaultValue={isEdit ? movie.studio : ''}
                  placeholder="Hãng phim"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Trailer URL */}
            <div>
              <label className="block font-semibold text-slate-700">Trailer URL (YouTube)</label>
              <input
                type="text"
                readOnly
                defaultValue="https://www.youtube.com/watch?v=sample"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notice Info Box */}
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900">
          <p className="font-bold">Ghi chú phối hợp nhóm:</p>
          <p className="mt-0.5">
            Biểu mẫu Thêm/Sửa phim thuộc phạm vi phụ trách của thành viên khác trong Sprint 1 (Task 4). Giao diện này đang ở chế độ xem trước (Preview) để đồng bộ trải nghiệm người dùng với bản vẽ Figma.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Đóng xem trước
          </button>
        </div>
      </div>
    </div>
  );
}
