    package com.cgdn.cinema.modules.movie.config;

    import com.cgdn.cinema.modules.movie.entity.Genre;
    import com.cgdn.cinema.modules.movie.entity.Movie;
    import com.cgdn.cinema.modules.movie.repository.GenreRepository;
    import com.cgdn.cinema.modules.movie.repository.MovieRepository;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.boot.CommandLineRunner;
    import org.springframework.stereotype.Component;
    import org.springframework.transaction.annotation.Transactional;

    import java.time.LocalDate;
    import java.util.*;

    @Component
    @RequiredArgsConstructor
    @Slf4j
    public class MovieDataInitializer implements CommandLineRunner {

        private final MovieRepository movieRepository;
        private final GenreRepository genreRepository;

        @Override
        @Transactional
        public void run(String... args) {
            if (genreRepository.count() == 0) {
                log.info("==> Đang khởi tạo danh mục thể loại phim ban đầu...");
                seedGenres();
            }

            if (movieRepository.count() == 0) {
                log.info("==> Đang nạp dữ liệu phim mẫu ban đầu vào cơ sở dữ liệu...");
                seedMovies();
                log.info("==> Nạp dữ liệu phim mẫu hoàn tất! Tổng số phim: {}", movieRepository.count());
            }
        }

        private void seedGenres() {
            List<String> genreNames = Arrays.asList(
                    "Hành động", "Tâm lý", "Tình cảm", "Kinh dị", "Bí ẩn",
                    "Hoạt hình", "Phiêu lưu", "Khoa học viễn tưởng", "Hài hước",
                    "Gia đình", "Tiểu sử", "Lịch sử"
            );
            for (String name : genreNames) {
                genreRepository.save(Genre.builder().ten(name).build());
            }
        }

        private void seedMovies() {
            Map<String, Genre> genreMap = new HashMap<>();
            for (Genre g : genreRepository.findAll()) {
                genreMap.put(g.getTen(), g);
            }

            List<Movie> movies = Arrays.asList(
                    Movie.builder()
                            .tenPhim("Mai (2024)")
                            .thoiLuong(131)
                            .nhanTuoi("T18")
                            .ngayKhoiChieu(LocalDate.of(2024, 2, 10))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("Trấn Thành")
                            .dienVien("Phương Anh Đào, Tuấn Trần, Trấn Thành, Hồng Đào")
                            .hangSanXuat("Trấn Thành Town, CJ HK Entertainment")
                            .trailerUrl("https://www.youtube.com/watch?v=sample1")
                            .posterUrl("https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Mai, một phụ nữ ngoài ba mươi tuổi làm nghề massage trị liệu, bất ngờ rơi vào mối quan hệ tình cảm phức tạp với Dương - chàng trai trẻ lãng tử đào hoa.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Tâm lý", "Tình cảm"))
                            .build(),

                    Movie.builder()
                            .tenPhim("Quật Mộ Trùng Ma")
                            .thoiLuong(134)
                            .nhanTuoi("T16")
                            .ngayKhoiChieu(LocalDate.of(2024, 3, 15))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("Jang Jae-hyun")
                            .dienVien("Choi Min-sik, Kim Go-eun, Yoo Hae-jin, Lee Do-hyun")
                            .hangSanXuat("Showbox")
                            .trailerUrl("https://www.youtube.com/watch?v=sample2")
                            .posterUrl("https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Một gia đình tài phiệt bị nguyền rủa thuê hai pháp sư trẻ, một thầy phong thủy và một nhân viên tang lễ để khai quật ngôi mộ tổ tiên ở vùng hẻo lánh.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Kinh dị", "Bí ẩn", "Tâm lý"))
                            .build(),

                    Movie.builder()
                            .tenPhim("Dune: Hành Tinh Cát - Phần 2")
                            .thoiLuong(166)
                            .nhanTuoi("T16")
                            .ngayKhoiChieu(LocalDate.of(2024, 3, 1))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("Denis Villeneuve")
                            .dienVien("Timothée Chalamet, Zendaya, Rebecca Ferguson, Austin Butler")
                            .hangSanXuat("Warner Bros. Pictures, Legendary Pictures")
                            .trailerUrl("https://www.youtube.com/watch?v=sample3")
                            .posterUrl("https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Paul Atreides kết hợp với Chani và người Fremen trên con đường báo thù chống lại những kẻ đã hủy hoại gia đình mình.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Khoa học viễn tưởng", "Hành động", "Phiêu lưu"))
                            .build(),

                    Movie.builder()
                            .tenPhim("Deadpool & Wolverine")
                            .thoiLuong(127)
                            .nhanTuoi("T18")
                            .ngayKhoiChieu(LocalDate.of(2024, 7, 26))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("Shawn Levy")
                            .dienVien("Ryan Reynolds, Hugh Jackman, Emma Corrin")
                            .hangSanXuat("Marvel Studios")
                            .trailerUrl("https://www.youtube.com/watch?v=sample4")
                            .posterUrl("https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Wade Wilson và Wolverine hợp sức trong nhiệm vụ đặc biệt của TVA, mở ra đa vũ trụ Marvel đầy tiếng cười và hành động gay cấn.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Hành động", "Hài hước", "Khoa học viễn tưởng"))
                            .build(),

                    Movie.builder()
                            .tenPhim("Kung Fu Panda 4")
                            .thoiLuong(94)
                            .nhanTuoi("P")
                            .ngayKhoiChieu(LocalDate.of(2024, 3, 8))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("Mike Mitchell")
                            .dienVien("Jack Black, Awkwafina, Viola Davis, Dustin Hoffman")
                            .hangSanXuat("DreamWorks Animation")
                            .trailerUrl("https://www.youtube.com/watch?v=sample5")
                            .posterUrl("https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Po phải tìm và đào tạo một Thần Long Đại Hiệp mới trước khi nhận vai trò Lãnh đạo Tâm linh của Thung lũng Hòa Bình.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Hoạt hình", "Phiêu lưu", "Hài hước"))
                            .build(),

                    Movie.builder()
                            .tenPhim("Oppenheimer: Kẻ Huỷ Diệt")
                            .thoiLuong(180)
                            .nhanTuoi("T18")
                            .ngayKhoiChieu(LocalDate.of(2023, 8, 11))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("Christopher Nolan")
                            .dienVien("Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.")
                            .hangSanXuat("Universal Pictures, Syncopy Inc.")
                            .trailerUrl("https://www.youtube.com/watch?v=sample6")
                            .posterUrl("https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Câu chuyện về nhà vật lý học lý thuyết J. Robert Oppenheimer, người dẫn đầu Dự án Manhattan tạo ra quả bom nguyên tử đầu tiên.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Tiểu sử", "Lịch sử", "Tâm lý"))
                            .build(),

                    Movie.builder()
                            .tenPhim("Godzilla x Kong: Đế Chế Mới")
                            .thoiLuong(115)
                            .nhanTuoi("T13")
                            .ngayKhoiChieu(LocalDate.of(2024, 3, 29))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("Adam Wingard")
                            .dienVien("Rebecca Hall, Brian Tyree Henry, Dan Stevens")
                            .hangSanXuat("Legendary Pictures, Warner Bros.")
                            .trailerUrl("https://www.youtube.com/watch?v=sample7")
                            .posterUrl("https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Hai quái thú huyền thoại Godzilla và Kong buộc phải liên minh để đối đầu với mối hiểm họa khổng lồ chưa từng thấy ẩn sâu trong Trái Đất.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Hành động", "Khoa học viễn tưởng", "Phiêu lưu"))
                            .build(),

                    Movie.builder()
                            .tenPhim("Võ Sĩ Giác Đấu II")
                            .thoiLuong(148)
                            .nhanTuoi("T18")
                            .ngayKhoiChieu(LocalDate.now().plusDays(10))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("Ridley Scott")
                            .dienVien("Paul Mescal, Pedro Pascal, Denzel Washington")
                            .hangSanXuat("Paramount Pictures")
                            .trailerUrl("https://www.youtube.com/watch?v=sample8")
                            .posterUrl("https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Nhiều năm sau cái chết của Maximus, Lucius - con trai của Lucilla - buộc phải bước vào Đấu trường La Mã để tìm lại danh dự.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Hành động", "Phiêu lưu", "Lịch sử"))
                            .build(),

                    Movie.builder()
                            .tenPhim("Hành Trình Của Moana 2")
                            .thoiLuong(100)
                            .nhanTuoi("P")
                            .ngayKhoiChieu(LocalDate.now().plusDays(20))
                            .ngayKetThuc(LocalDate.now().plusMonths(3))
                            .daoDien("David G. Derrick Jr.")
                            .dienVien("Auliʻi Cravalho, Dwayne Johnson")
                            .hangSanXuat("Walt Disney Animation Studios")
                            .trailerUrl("https://www.youtube.com/watch?v=sample9")
                            .posterUrl("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop")
                            .noiDung("Sau khi nhận được lời kêu gọi bất ngờ từ tổ tiên, Moana cùng Maui lên đường thực hiện chuyến hải trình nguy hiểm qua các vùng biển xa xôi.")
                            .trangThai(1)
                            .theLoai(getGenres(genreMap, "Hoạt hình", "Phiêu lưu", "Gia đình"))
                            .build()
            );

            movieRepository.saveAll(movies);
        }

        private Set<Genre> getGenres(Map<String, Genre> map, String... names) {
            Set<Genre> set = new HashSet<>();
            for (String name : names) {
                if (map.containsKey(name)) {
                    set.add(map.get(name));
                }
            }
            return set;
        }
    }
