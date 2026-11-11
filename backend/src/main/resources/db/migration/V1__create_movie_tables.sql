-- ========================================================
-- Script khởi tạo bảng Phim và Thể loại theo đặc tả
-- ========================================================

-- 1. Bảng phim
CREATE TABLE IF NOT EXISTS phim (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_phim VARCHAR(255) NOT NULL,
    thoi_luong INT NOT NULL,
    nhan_tuoi VARCHAR(20),
    ngay_khoi_chieu DATE NOT NULL,
    ngay_ket_thuc DATE,
    dao_dien VARCHAR(255),
    dien_vien VARCHAR(1000),
    hang_san_xuat VARCHAR(255),
    trailer_url VARCHAR(500),
    poster_url VARCHAR(500),
    noi_dung TEXT,
    trang_thai TINYINT NOT NULL DEFAULT 1 COMMENT '1: Đang phát hành / Active, 2: Đã ngừng phát hành / Deleted'
);

-- 2. Bảng thể loại
CREATE TABLE IF NOT EXISTS the_loai (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(255) NOT NULL,
    CONSTRAINT uk_the_loai_ten UNIQUE (ten)
);

-- 3. Bảng trung gian phim_the_loai (Nhiều - Nhiều)
CREATE TABLE IF NOT EXISTS phim_the_loai (
    phim_id BIGINT NOT NULL,
    the_loai_id BIGINT NOT NULL,

    PRIMARY KEY (phim_id, the_loai_id),

    CONSTRAINT fk_phim_the_loai_phim
        FOREIGN KEY (phim_id) REFERENCES phim(id) ON DELETE CASCADE,

    CONSTRAINT fk_phim_the_loai_the_loai
        FOREIGN KEY (the_loai_id) REFERENCES the_loai(id) ON DELETE CASCADE
);

-- ========================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ========================================================

-- Chèn thể loại
INSERT IGNORE INTO the_loai (id, ten) VALUES
(1, 'Hành động'),
(2, 'Tâm lý'),
(3, 'Tình cảm'),
(4, 'Kinh dị'),
(5, 'Bí ẩn'),
(6, 'Hoạt hình'),
(7, 'Phiêu lưu'),
(8, 'Khoa học viễn tưởng'),
(9, 'Hài hước'),
(10, 'Gia đình'),
(11, 'Tiểu sử'),
(12, 'Lịch sử');

-- Chèn phim mẫu
INSERT IGNORE INTO phim (id, ten_phim, thoi_luong, nhan_tuoi, ngay_khoi_chieu, ngay_ket_thuc, dao_dien, dien_vien, hang_san_xuat, trailer_url, poster_url, noi_dung, trang_thai) VALUES
(1, 'Mai (2024)', 131, 'T18', '2024-02-10', '2024-12-30', 'Trấn Thành', 'Phương Anh Đào, Tuấn Trần, Trấn Thành, Hồng Đào', 'Trấn Thành Town, CJ HK Entertainment', 'https://www.youtube.com/watch?v=sample1', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop', 'Mai, một phụ nữ ngoài ba mươi tuổi làm nghề massage trị liệu, bất ngờ rơi vào mối quan hệ tình cảm phức tạp với Dương - chàng trai trẻ lãng tử đào hoa.', 1),
(2, 'Quật Mộ Trùng Ma', 134, 'T16', '2024-03-15', '2024-12-30', 'Jang Jae-hyun', 'Choi Min-sik, Kim Go-eun, Yoo Hae-jin, Lee Do-hyun', 'Showbox', 'https://www.youtube.com/watch?v=sample2', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop', 'Một gia đình tài phiệt bị nguyền rủa thuê hai pháp sư trẻ, một thầy phong thủy và một nhân viên tang lễ để khai quật ngôi mộ tổ tiên ở vùng hẻo lánh.', 1),
(3, 'Dune: Hành Tinh Cát - Phần 2', 166, 'T16', '2024-03-01', '2024-12-30', 'Denis Villeneuve', 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Austin Butler', 'Warner Bros. Pictures, Legendary Pictures', 'https://www.youtube.com/watch?v=sample3', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop', 'Paul Atreides kết hợp với Chani và người Fremen trên con đường báo thù chống lại những kẻ đã hủy hoại gia đình mình.', 1),
(4, 'Deadpool & Wolverine', 127, 'T18', '2024-07-26', '2024-12-30', 'Shawn Levy', 'Ryan Reynolds, Hugh Jackman, Emma Corrin', 'Marvel Studios', 'https://www.youtube.com/watch?v=sample4', 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop', 'Wade Wilson và Wolverine hợp sức trong nhiệm vụ đặc biệt của TVA, mở ra đa vũ trụ Marvel đầy tiếng cười và hành động gay cấn.', 1),
(5, 'Kung Fu Panda 4', 94, 'P', '2024-03-08', '2024-12-30', 'Mike Mitchell', 'Jack Black, Awkwafina, Viola Davis, Dustin Hoffman', 'DreamWorks Animation', 'https://www.youtube.com/watch?v=sample5', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop', 'Po phải tìm và đào tạo một Thần Long Đại Hiệp mới trước khi nhận vai trò Lãnh đạo Tâm linh của Thung lũng Hòa Bình.', 1),
(6, 'Oppenheimer: Kẻ Huỷ Diệt', 180, 'T18', '2023-08-11', '2024-12-30', 'Christopher Nolan', 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.', 'Universal Pictures, Syncopy Inc.', 'https://www.youtube.com/watch?v=sample6', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop', 'Câu chuyện về nhà vật lý học lý thuyết J. Robert Oppenheimer, người dẫn đầu Dự án Manhattan tạo ra quả bom nguyên tử đầu tiên.', 1),
(7, 'Godzilla x Kong: Đế Chế Mới', 115, 'T13', '2024-03-29', '2024-12-30', 'Adam Wingard', 'Rebecca Hall, Brian Tyree Henry, Dan Stevens', 'Legendary Pictures, Warner Bros.', 'https://www.youtube.com/watch?v=sample7', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop', 'Hai quái thú huyền thoại Godzilla và Kong buộc phải liên minh để đối đầu với mối hiểm họa khổng lồ chưa từng thấy ẩn sâu trong Trái Đất.', 1),
(8, 'Võ Sĩ Giác Đấu II', 148, 'T18', '2026-11-20', '2027-01-20', 'Ridley Scott', 'Paul Mescal, Pedro Pascal, Denzel Washington', 'Paramount Pictures', 'https://www.youtube.com/watch?v=sample8', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop', 'Nhiều năm sau cái chết của Maximus, Lucius - con trai của Lucilla - buộc phải bước vào Đấu trường La Mã để tìm lại danh dự.', 1),
(9, 'Hành Trình Của Moana 2', 100, 'P', '2026-11-29', '2027-01-29', 'David G. Derrick Jr.', 'Auliʻi Cravalho, Dwayne Johnson', 'Walt Disney Animation Studios', 'https://www.youtube.com/watch?v=sample9', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop', 'Sau khi nhận được lời kêu gọi bất ngờ từ tổ tiên, Moana cùng Maui lên đường thực hiện chuyến hải trình nguy hiểm qua các vùng biển xa xôi.', 1);

-- Gắn thể loại cho từng phim
INSERT IGNORE INTO phim_the_loai (phim_id, the_loai_id) VALUES
(1, 2), (1, 3),        -- Mai: Tâm lý, Tình cảm
(2, 4), (2, 5), (2, 2), -- Quật Mộ Trùng Ma: Kinh dị, Bí ẩn, Tâm lý
(3, 8), (3, 1), (3, 7), -- Dune 2: Khoa học viễn tưởng, Hành động, Phiêu lưu
(4, 1), (4, 9), (4, 8), -- Deadpool: Hành động, Hài hước, Khoa học viễn tưởng
(5, 6), (5, 7), (5, 9), -- Panda 4: Hoạt hình, Phiêu lưu, Hài hước
(6, 11), (6, 12), (6, 2), -- Oppenheimer: Tiểu sử, Lịch sử, Tâm lý
(7, 1), (7, 8), (7, 7), -- Godzilla x Kong: Hành động, Khoa học viễn tưởng, Phiêu lưu
(8, 1), (8, 7), (8, 12), -- Gladiator II: Hành động, Phiêu lưu, Lịch sử
(9, 6), (9, 7), (9, 10); -- Moana 2: Hoạt hình, Phiêu lưu, Gia đình
