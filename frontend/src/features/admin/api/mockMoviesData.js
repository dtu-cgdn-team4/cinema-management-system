/**
 * Tên tệp: Dữ liệu mẫu phim Galaxy Cinema (mockMoviesData.js)
 * Tên tệp tiếng Việt: Dữ liệu mẫu quản lý phim
 * Chức năng: Lưu trữ danh sách phim giả lập, hằng số trạng thái, nhãn độ tuổi và thể loại.
 * Khớp 100% với sơ đồ cơ sở dữ liệu ERD 16 bảng và bản vẽ thiết kế Figma chính thức.
 */

// Quy ước mã trạng thái phim theo nghiệp vụ rạp:
// NOW_SHOWING (1): Phim đang chiếu tại các cụm rạp
// COMING_SOON (2): Phim sắp khởi chiếu, chuẩn bị mở bán vé
// STOPPED (0): Phim ngừng chiếu (Xóa mềm - không xóa vật lý khỏi cơ sở dữ liệu)
export const MOVIE_STATUS = {
  NOW_SHOWING: 'NOW_SHOWING',
  COMING_SOON: 'COMING_SOON',
  STOPPED: 'STOPPED',
};

// Cấu hình nhãn hiển thị và màu sắc huy hiệu trạng thái (Badge)
export const MOVIE_STATUS_META = {
  [MOVIE_STATUS.NOW_SHOWING]: {
    label: 'Đang chiếu',
    code: 1,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  [MOVIE_STATUS.COMING_SOON]: {
    label: 'Sắp chiếu',
    code: 2,
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  [MOVIE_STATUS.STOPPED]: {
    label: 'Ngừng chiếu',
    code: 0,
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
  },
};

// Chuẩn phân loại độ tuổi điện ảnh Việt Nam theo Thông tư Bộ VHTTDL & Figma Prototype:
// P: Phổ biến mọi lứa tuổi
// K: Khán giả dưới 13 tuổi với điều kiện có cha mẹ/người giám hộ
// T13: Khán giả từ đủ 13 tuổi trở lên
// T16: Khán giả từ đủ 16 tuổi trở lên
// T18: Khán giả từ đủ 18 tuổi trở lên
export const AGE_RATING_META = {
  P: { label: 'P', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  K: { label: 'K', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  T13: { label: 'T13', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  T16: { label: 'T16', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200' },
  T18: { label: 'T18', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
};

// Danh sách các thể loại phim phục vụ lọc và chọn khi thêm mới
export const GENRE_OPTIONS = [
  'Hành động',
  'Hoạt hình',
  'Hài',
  'Tâm lý',
  'Tình cảm',
  'Kinh dị',
  'Khoa học viễn tưởng',
  'Gia đình',
];

// Danh sách 8 phim mẫu ban đầu đồng bộ chính xác với Frame 1 của Prototype Figma
export const INITIAL_MOCK_MOVIES = [
  {
    id: 1,
    code: 'PH001',
    title: 'Mai',
    originalTitle: 'Mai',
    country: 'Việt Nam',
    genres: ['Tâm lý', 'Tình cảm'],
    duration: 131,
    ageRating: 'T18',
    releaseDate: '2024-02-10',
    endDate: '2024-04-30',
    formats: ['2D'],
    totalShowtimes: 128,
    status: MOVIE_STATUS.NOW_SHOWING,
    director: 'Trấn Thành',
    actors: 'Phương Anh Đào, Tuấn Trần',
    studio: 'Trấn Thành Town',
    trailerUrl: 'https://youtu.be/HXWRTGbhb4U',
    hasBookings: true, // Phim đã có vé -> không sửa được thông tin, chỉ sửa trạng thái
    noi_dung:
      'Câu chuyện về Mai, người phụ nữ làm nghề mát-xa và mối tình với chàng trai kém tuổi.',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=360&q=80',
    showtimeSlots: ['10:00', '12:45', '17:30', '20:45'],
    cinemaName: 'Lumière Nguyễn Du',
    roomName: 'Hall 03',
  },
  {
    id: 2,
    code: 'PH002',
    title: 'Dune: Hành tinh cát – Phần hai',
    originalTitle: 'Dune: Part Two',
    country: 'Mỹ',
    genres: ['Khoa học viễn tưởng'],
    duration: 166,
    ageRating: 'T16',
    releaseDate: '2024-03-01',
    endDate: '2024-05-30',
    formats: ['2D'],
    totalShowtimes: 96,
    status: MOVIE_STATUS.NOW_SHOWING,
    director: 'Denis Villeneuve',
    actors: 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
    studio: 'Legendary',
    trailerUrl: 'https://youtu.be/Way9Dexny3w',
    hasBookings: true,
    noi_dung:
      'Paul Atreides hợp lực cùng Chani và tộc người Fremen để trả thù những kẻ đã hủy hoại gia đình mình.',
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=360&q=80',
    showtimeSlots: ['14:00', '18:15', '21:30'],
    cinemaName: 'Lumière Nguyễn Du',
    roomName: 'Hall 01',
  },
  {
    id: 3,
    code: 'PH003',
    title: 'Những mảnh ghép cảm xúc 2',
    originalTitle: 'Inside Out 2',
    country: 'Mỹ',
    genres: ['Hoạt hình'],
    duration: 96,
    ageRating: 'P',
    releaseDate: '2024-06-14',
    endDate: '2024-08-30',
    formats: ['2D'],
    totalShowtimes: 84,
    status: MOVIE_STATUS.NOW_SHOWING,
    director: 'Kelsey Mann',
    actors: 'Amy Poehler, Maya Hawke',
    studio: 'Pixar',
    trailerUrl: 'https://youtu.be/L4DrolmDxmw',
    hasBookings: true,
    noi_dung:
      'Các cảm xúc mới bất ngờ xuất hiện trong tâm trí của Riley khi cô bé bước vào tuổi dậy thì.',
    posterUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=360&q=80',
    showtimeSlots: ['09:15', '11:30', '15:45'],
    cinemaName: 'Lumière Nguyễn Du',
    roomName: 'Hall 02',
  },
  {
    id: 4,
    code: 'PH004',
    title: 'Kẻ trộm mặt trăng 4',
    originalTitle: 'Despicable Me 4',
    country: 'Mỹ',
    genres: ['Hoạt hình', 'Hài', 'Gia đình'],
    duration: 94,
    ageRating: 'P',
    releaseDate: '2024-07-05',
    endDate: '2024-09-30',
    formats: ['2D'],
    totalShowtimes: 32,
    status: MOVIE_STATUS.COMING_SOON,
    director: 'Chris Renaud',
    actors: 'Steve Carell, Kristen Wiig, Will Ferrell',
    studio: 'Illumination',
    trailerUrl: 'https://youtu.be/qqk9-rF32A',
    hasBookings: false, // Phim chưa có vé -> được sửa toàn bộ thông tin
    noi_dung:
      'Gru cùng gia đình đối mặt với kẻ thù mới, đồng thời chào đón thành viên nhỏ nhất của nhà.',
    posterUrl:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=360&q=80',
    showtimeSlots: ['09:30', '13:00', '16:30'],
    cinemaName: 'Lumière Nguyễn Du',
    roomName: 'Hall 03',
  },
  {
    id: 5,
    code: 'PH005',
    title: 'Vùng đất câm lặng: Ngày một',
    originalTitle: 'A Quiet Place: Day One',
    country: 'Mỹ',
    genres: ['Kinh dị', 'Giật gân'],
    duration: 100,
    ageRating: 'T18',
    releaseDate: '2024-06-28',
    endDate: '2024-08-30',
    formats: ['2D'],
    totalShowtimes: 24,
    status: MOVIE_STATUS.COMING_SOON,
    director: 'Michael Sarnoski',
    actors: 'Lupita Nyong’o, Joseph Quinn',
    studio: 'Paramount',
    trailerUrl: 'https://youtu.be/YPY7J-flzE8',
    hasBookings: false,
    noi_dung:
      'Trải nghiệm ngày đầu tiên thế giới chìm vào yên lặng khi những sinh vật kỳ lạ xâm chiếm trái đất.',
    posterUrl:
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=360&q=80',
    showtimeSlots: ['19:00', '21:15'],
    cinemaName: 'Lumière Nguyễn Du',
    roomName: 'Hall 02',
  },
  {
    id: 6,
    code: 'PH006',
    title: 'Lật mặt 7: Một điều ước',
    originalTitle: 'Face Off 7',
    country: 'Việt Nam',
    genres: ['Tâm lý', 'Gia đình'],
    duration: 138,
    ageRating: 'T13',
    releaseDate: '2024-04-26',
    endDate: '2024-07-15',
    formats: ['2D'],
    totalShowtimes: 156,
    status: MOVIE_STATUS.STOPPED,
    director: 'Lý Hải',
    actors: 'Thanh Hiền, Trương Minh Cường, Đinh Y Nhung',
    studio: 'Lý Hải Production',
    trailerUrl: 'https://youtu.be/d4Jb6j21h8Y',
    hasBookings: true,
    noi_dung:
      'Câu chuyện cảm động về tình mẫu tử của người mẹ già 73 tuổi cùng 5 người con trưởng thành.',
    posterUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=360&q=80',
    showtimeSlots: ['10:15', '14:30'],
    cinemaName: 'Lumière Nguyễn Du',
    roomName: 'Hall 01',
  },
  {
    id: 7,
    code: 'PH007',
    title: 'Deadpool & Wolverine',
    originalTitle: 'Deadpool & Wolverine',
    country: 'Mỹ',
    genres: ['Hành động', 'Hài'],
    duration: 127,
    ageRating: 'T18',
    releaseDate: '2024-07-26',
    endDate: '2024-10-15',
    formats: ['2D'],
    totalShowtimes: 112,
    status: MOVIE_STATUS.NOW_SHOWING,
    director: 'Shawn Levy',
    actors: 'Ryan Reynolds, Hugh Jackman',
    studio: 'Marvel Studios',
    trailerUrl: 'https://youtu.be/73_1biulkYk',
    hasBookings: true,
    noi_dung: 'Bộ đôi siêu anh hùng lầy lội tái xuất cùng nhiệm vụ giải cứu đa vũ trụ.',
    posterUrl:
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=360&q=80',
    showtimeSlots: ['13:30', '17:00', '20:15'],
    cinemaName: 'Lumière Nguyễn Du',
    roomName: 'Hall 01',
  },
  {
    id: 8,
    code: 'PH008',
    title: 'Quật mộ trùng ma',
    originalTitle: 'Exhuma',
    country: 'Hàn Quốc',
    genres: ['Kinh dị', 'Tâm lý'],
    duration: 134,
    ageRating: 'T16',
    releaseDate: '2024-03-15',
    endDate: '2024-06-15',
    formats: ['2D'],
    totalShowtimes: 140,
    status: MOVIE_STATUS.STOPPED,
    director: 'Jang Jae-hyun',
    actors: 'Choi Min-sik, Kim Go-eun',
    studio: 'Showbox',
    trailerUrl: 'https://youtu.be/sample',
    hasBookings: true,
    noi_dung: 'Hai pháp sư, một chuyên gia phong thủy và một nhân viên tang lễ khai quật ngôi mộ bí ẩn.',
    posterUrl:
      'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=360&q=80',
    showtimeSlots: ['18:00', '21:00'],
    cinemaName: 'Lumière Nguyễn Du',
    roomName: 'Hall 02',
  },
];
