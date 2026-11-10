# Điều khiển Slidev bằng điện thoại

## Mục tiêu

Người thuyết trình mở Slidev trên laptop, ghép nối điện thoại qua QR hoặc link và dùng hai nút cảm ứng tương đương phím ← và →. Điện thoại mở điều khiển web trên trình duyệt hiện đại. Bản build GitHub Pages là một đích triển khai.

## Thiết kế

- Nút điều khiển nằm trên thanh công cụ Slidev. Hộp ghép nối có thể đóng khi trình chiếu và mở lại để kết thúc phiên.
- PeerJS tạo kết nối dữ liệu WebRTC. Dịch vụ công khai dùng để tìm và kết nối hai trình duyệt. Phiên dùng mã ngẫu nhiên, xác thực qua kênh dữ liệu và chấp nhận một điện thoại tại một thời điểm.
- Điện thoại hiển thị số slide, trạng thái kết nối và hai vùng bấm lớn. Mỗi lệnh gọi `nav.prev()` hoặc `nav.next()` và chờ xác nhận trước lần bấm tiếp theo.
- Không ghi phiên vào bộ nhớ lâu dài. Khi kết nối thất bại, điện thoại báo lỗi và có nút thử lại. Nếu WebRTC bị chặn, bản dev có thể dùng chế độ remote tích hợp của Slidev qua LAN.

## Mã nguồn và lệnh

- `custom-nav-controls.vue` điều khiển phiên trình chiếu.
- `pages/phone-remote.vue` là màn hình điện thoại được đăng ký trong `setup/routes.ts`.
- `npm run dev -- --port 3047` chạy tại máy.
- `npm run build -- --base /sqrt-decomposition-seminar/ --router-mode hash` dựng bản Pages.

## Kiểm tra và phạm vi

- Thử trên hai phiên trình duyệt độc lập ở cỡ màn hình laptop và điện thoại, kiểm tra ghép nối thật, chuyển slide, chuyển từng bước, mất kết nối và ghép lại.
- Kiểm tra bản build Pages, nút bị vô hiệu hóa khi chưa kết nối và link hết hiệu lực khi dừng phiên.
- Xử lý lệnh theo mẫu `await (command === 'next' ? nav.next() : nav.prev())`. Chỉ nhận hai lệnh điều hướng của bài này. Giữ phạm vi trong repo Slidev và dùng quy trình triển khai hiện có. Không lưu thông tin xác thực của phiên hoặc thêm quyền điều khiển hệ điều hành.
