-- Ghế đã bán mẫu ở mọi suất chiếu: A01, A02, D05, D07 (D06 thành ghế lẻ có sẵn), F08, F09.
-- Chạy sau R__du_lieu_mau (Flyway xếp repeatable theo tên).
INSERT INTO ghe_suat_chieu (suat_chieu_id, ghe_id, ma_phien, trang_thai_ghe)
SELECT s.id, g.id, 'du-lieu-mau', 'DA_THANH_TOAN'
FROM suat_chieu s
JOIN ghe g ON g.phong_chieu_id = s.phong_chieu_id
WHERE (g.ten_hang = 'A' AND g.so_ghe IN (1, 2))
   OR (g.ten_hang = 'D' AND g.so_ghe IN (5, 7))
   OR (g.ten_hang = 'F' AND g.so_ghe IN (8, 9));
