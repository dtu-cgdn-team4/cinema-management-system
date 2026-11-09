# Quy tắc nghiệp vụ

Tổng hợp từ SRS v1.1, file Q&A `[CGDN]_SRS_Q_A.xlsx` (số `#n` là cột No.) và các quyết định mentor chốt sau Q&A.

## Thứ tự ưu tiên nguồn

Khi các nguồn nói khác nhau, nguồn đứng trước thắng:

1. Quyết định chốt sau Q&A (ghi trong tài liệu này, có ngày).
2. File Q&A đã trả lời.
3. SRS v1.1.
4. `README.md` (một số mô tả trong README là định hướng, chưa đúng phạm vi hiện tại, xem mục "Ngoài phạm vi").

Quy tắc chưa có câu trả lời thì ghi vào mục "Câu hỏi còn mở" và hỏi mentor, giữ nguyên phạm vi đã chốt trong lúc chờ.

## Phạm vi

- Nhiều rạp, chỉ phim 2D (#34; nhiều rạp chốt 06/11/2026, thay cho "một rạp" trong #34).
- Vai trò: khách vãng lai, thành viên, nhân viên, admin. Phân quyền theo bảng tác nhân mục 5.1 của SRS (#40). Quản lý phòng chiếu chỉ admin (#6). Thêm, sửa rạp chỉ admin (chốt 06/11/2026).
- Ngoài phạm vi hiện tại: đánh giá phim (#2), hủy vé (#3, #13, #32), hoàn tiền hoặc đổi suất (#16), bán combo (#43), ghế đôi, ghế hỏng, sửa/xóa phòng (#39, làm ở sprint sau), chia hạng thành viên (#36), 3D (README có nhắc nhưng không thuộc phạm vi).

## Đặt vé và chọn ghế

### Chọn phim và suất chiếu

- Chỉ liệt kê phim đang chiếu: hôm nay nằm trong khoảng ngày khởi chiếu đến ngày kết thúc. Phim hết chiếu thì ẩn, không xóa (#38).
- Hiển thị mác tuổi của phim: P, K, T13, T16, T18 (#4).
- Phải đăng nhập (tài khoản hệ thống hoặc Google, #46) mới đặt được vé.

### Trạng thái ghế trong một suất chiếu

| Trạng thái | Bắt đầu | Kết thúc |
|---|---|---|
| Trống | Mặc định | Có khách chọn |
| Đang giữ | Khách chọn ghế, đếm 10 phút (#21, #33) | Thanh toán thành công trong 10 phút thì sang "đã thanh toán"; quá 10 phút thì nhả ghế |
| Đã thanh toán | Thanh toán PayPal thành công, hoặc nhân viên bán tại quầy | Giữ đến hết suất chiếu (#5) |

- Đặt vé online chỉ thanh toán bằng PayPal và chỉ tính là đặt vé khi đã thanh toán thành công (chốt 06/11/2026, thay trạng thái "chờ thanh toán" chốt 05/11/2026 và thanh toán tại quầy cho đơn online ở #31).
- Chưa thanh toán hoặc thanh toán thất bại: chưa có đơn, không có vé, không cộng điểm, không tính doanh thu. Trong hạn giữ ghế khách được thanh toán lại.
- Hết 10 phút mà chưa thanh toán xong: báo lỗi "Hết thời gian giữ ghế", nhả ghế, đưa khách về bước chọn ghế. Hạn giữ tính theo giờ server.

### Quy tắc chọn ghế

1. Chọn số lượng ghế trước, từ 1 đến tối đa 8 ghế mỗi lần đặt (#33).
2. Số ghế chọn phải bằng số lượng đã chọn. Thiếu: "Bạn chọn thiếu x ghế". Dư: "Bạn chỉ chọn x ghế" (SRS 6.2.2).
3. Ghế đang giữ hoặc đã thanh toán thì không chọn được.
4. Quy tắc ghế trống lẻ (#8, chốt 05/11/2026):
   - Lối đi là khoảng trống rộng hơn giữa hai ghế, chỉ tính lối dọc. Sơ đồ hiện tại có lối đi sau ghế 03 và sau ghế 09, mỗi hàng chia 3 dãy: 01–03, 04–09, 10–12.
   - Ghế coi là đã có người: đang giữ, đã thanh toán, và ghế khách đang chọn.
   - Lựa chọn không hợp lệ khi tạo ra một đoạn trống dài đúng 1 ghế nằm sát ghế khách vừa chọn. Đầu hàng và lối đi là biên của dãy.
   - Ghế lẻ có sẵn từ trước không chặn khách, và khách được chọn chính ghế lẻ đó.
   - Áp dụng cho cả đặt online và bán tại quầy, chưa có ngoại lệ. Hệ quả: dãy 3 ghế trống hoàn toàn không nhận nhóm 2 người.
5. Loại ghế (thường, VIP) chỉ ảnh hưởng giá, không ảnh hưởng quy tắc ghế trống lẻ.
6. Chống bán trùng: xử lý đặt vé qua message queue (#14) và trong transaction (#22, #23). Lưu thất bại thì không đổi trạng thái ghế.
7. Hệ thống chịu được 1000 người dùng đồng thời (#44).

Ví dụ kiểm tra quy tắc ghế trống lẻ (dãy 04–09, ghế 04 và 09 đã có người):

| Khách chọn | Kết quả |
|---|---|
| 05, 06 | Hợp lệ, còn 07–08 |
| 06, 07 | Không hợp lệ, 05 và 08 thành ghế lẻ |

### Sơ đồ ghế trên giao diện

| Hiển thị | Ý nghĩa |
|---|---|
| Viền sáng | Ghế trống |
| Viền vàng | Ghế VIP còn trống |
| Ô xám tối | Đang giữ hoặc đã thanh toán (khách không chọn được) |
| Nền đỏ | Ghế khách đang chọn |
| Viền tím | Ghế đôi (hàng J, chưa thuộc phạm vi) |

Tên hàng là dữ liệu, không suy ra từ bảng chữ cái: thiết kế nhảy từ hàng H sang J.

### Sau khi đặt

- Mã đặt vé và vé QR gửi tới email người nhận khách nhập ở màn thanh toán (#31). Người nhận có thể khác chủ tài khoản (theo thiết kế màn thanh toán).
- Request đã gửi lên server thì được xử lý; vé hiện trong lịch sử vé của khách (#15).
- Không hủy, không hoàn tiền, không đổi suất (#13, #16).

## Giá vé, khuyến mãi, điểm

- Giá phụ thuộc thứ trong tuần và loại ghế, khung giờ như nhau (#34). Có màn hình quản lý giá cho admin; đổi giá thì vé đã đặt giữ giá cũ.
- Bảng giá là nguồn giá duy nhất, thứ tính theo ngày chiếu của suất. Không nhập giá riêng cho từng suất chiếu.
- Giá vé và khuyến mãi dùng chung cho mọi rạp (chốt 06/11/2026).
- Giá tạm thời cho ghế thường (SRS 6.8): Thứ 2, 4, 5: 50.000đ; Thứ 3: 45.000đ; Thứ 6, 7, CN: 65.000đ. Giá VIP chưa có.
- Khuyến mãi trừ thẳng vào tiền vé (#35), áp dụng tự động hoặc khách nhập mã (#10). Không cộng dồn với đổi điểm (#35).
- Khuyến mãi có thể chỉ áp dụng vào một số thứ trong tuần, tính theo ngày chiếu của suất (theo thiết kế màn Khuyến mãi, xem "Câu hỏi còn mở").
- Giá và khuyến mãi chốt tại thời điểm khách bấm xác nhận thanh toán (#25).
- Điểm: 10.000đ = 1 điểm, cộng lúc đặt, không hết hạn, chỉ đổi điểm tại quầy (#36).

## Lịch chiếu và phim

- Admin chọn nhanh một khoảng giờ, sau đó chỉnh từng suất được (#37).
- Thời gian dọn phòng tính luôn trong khung suất chiếu (#37). Chặn mọi suất trùng khung giờ trong cùng phòng (#17).
- Không sửa, xóa suất chiếu hoặc phim đã có vé; muốn xóa thì xử lý ngoài website (#20, #38).
- Thời lượng phim không giới hạn cứng, dữ liệu mẫu trong SRS chỉ là ví dụ (#12).

## Tài khoản

- Đăng ký: chỉ bắt buộc tài khoản, mật khẩu, họ tên, email, SĐT; CCCD và địa chỉ không bắt buộc (#9). Nhóm tự đặt ràng buộc độ dài, định dạng, trùng email (#26).
- Đăng nhập sai 5 lần thì khóa tạm, mở lại bằng quên mật khẩu (#29).
- Admin khóa, mở khóa tài khoản và có nút đặt lại mật khẩu; màn hình sửa thành viên bỏ trường mật khẩu (#41).
- Vô hiệu hóa nhân viên thì mất quyền ngay, kể cả phiên đang đăng nhập (#24).
- Mỗi nhân viên gắn với một rạp (chốt 06/11/2026). Admin và khách hàng không gắn rạp.
- Phiên đăng nhập hết hạn sau 30 phút không thao tác, mật khẩu băm một chiều, chạy HTTPS (#45).

## Bán vé tại quầy và soát vé

- Nhân viên thu tiền ngay khi bán vé tại quầy, xuất hóa đơn (#43). Đơn đặt online không thanh toán tại quầy (chốt 06/11/2026).
- Đơn tại quầy luôn ghi nhân viên bán. Khách vãng lai mua tại quầy không cần tài khoản.
- Nhân viên chỉ bán và soát vé ở rạp của mình (chốt 06/11/2026).
- Khi soát vé hoặc xác nhận nhận vé, hệ thống ghi lại thời điểm (SRS 6.10.3).
- Tìm vé theo SĐT người nhận khi khách không mở được QR (#19).

## Thống kê

- Doanh thu tính tại thời điểm thanh toán thành công (#18), theo số tiền thực thu.
- Có biểu đồ và xuất Excel (#42). Lọc theo ngày, tháng, năm và theo rạp (lọc theo rạp chốt 06/11/2026).
- Thống kê suất chiếu nhóm theo phim, ngày chiếu, khung giờ, kèm doanh thu (#11).

## Câu hỏi còn mở

- Quên mật khẩu qua OTP SMS dùng Firebase (#1) hay link qua email (#41)? Hai câu đều được đồng ý.
- Ghế đôi hàng J có trong thiết kế nhưng #39 nói làm ở sprint sau.
- Giá ghế VIP.
- Màn hình thêm phòng chiếu: nhóm tự thiết kế, cần confirm lại với mentor (#28).
- Thiết kế có tab "Phim sắp chiếu" nhưng #38 chỉ liệt kê phim đang chiếu.
- PayPal báo thành công sau khi đã hết hạn giữ ghế (ghế có thể đã có người khác giữ) thì xử lý thế nào, khi không có hoàn tiền (#16)?
- Bán tại quầy thu bằng những hình thức nào? Hiện giữ nguyên tiền mặt, thẻ, QR.
- Khuyến mãi theo thứ trong tuần ("Thứ 3 vui vẻ") có trong thiết kế nhưng SRS và Q&A chưa nói. Nếu bỏ thì xóa bảng `khuyen_mai_thu` và đổi nội dung màn Khuyến mãi.
- Khuyến mãi theo đối tượng (sinh viên, sinh nhật, thành viên mới) có trong thiết kế, CSDL chưa lưu các điều kiện này.
- Màn lịch chiếu và chọn ghế ghi phụ đề hoặc lồng tiếng, CSDL chưa có cột này. Có giữ thông tin này không?
- Mỗi đơn chỉ được soát một lần? Tài liệu đang giả định là có: quét lại thì báo vé đã soát.
