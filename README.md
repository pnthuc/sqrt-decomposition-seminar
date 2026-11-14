# Sqrt Decomposition

Project Slidev cho bài seminar, gồm 55 slide 16:9 với speaker notes tiếng Việt. Font và năm biểu đồ thực nghiệm được đóng gói cùng project.

[Mở bài trình chiếu trên GitHub Pages](https://pnthuc.github.io/sqrt-decomposition-seminar/). GitHub Actions triển khai lại sau mỗi lần đẩy lên `main`.

## Chạy trong thư mục này

Cần Node.js 22.22.0 trở lên.

```sh
npm ci
npm run dev -- --port 3047
```

Mở [bản trình chiếu](http://localhost:3047/) hoặc [chế độ người trình bày](http://localhost:3047/presenter/).

- **→ / ←** tiến hoặc lùi một bước bấm. Khi hết bước, phím chuyển sang slide tiếp theo hoặc trước đó.
- Ví dụ tổng đoạn ở slide 4, demo gán điểm và kéo chọn đoạn ở slide 9, lazy ở slide 28, cửa sổ Mo ở slide 35 và ví dụ mode ở slide 40–41
- Demo Mo trọn ba truy vấn ở slide 42, có 16 bước thêm, xóa và ghi đáp án, điều khiển bằng phím mũi tên hoặc nút Tiếp, Lùi và Chạy lại
- Bài 1 và đáp án ở slide 10–11, Bài 2 ở slide 12–13, Bài 3 và gợi ý ở slide 26–27
- Năm biểu đồ ở slide 16, 18, 20, 22, 24, mỗi biểu đồ có một slide kết luận liền sau
- Online và offline ở slide 32–33, gồm điều kiện áp dụng và ví dụ truy vấn phụ thuộc đáp án trước
- Ở slide 4, kéo qua các ô rồi thả chuột, hoặc dùng Tab và Enter để đặt hai đầu. Ba phép tính hiện ngay khi chọn xong. Phím → trình bày lại từng bước, hoặc chạy ví dụ gốc nếu chưa chọn đoạn.
- Ở slide 9, chọn đoạn rồi nhập vị trí và giá trị, bấm Gán điểm để theo dõi tổng block và tổng đoạn thay đổi, hoặc bấm Mảng ban đầu để khôi phục dữ liệu
- Slide dùng chuyển cảnh ngắn theo chiều bấm và tôn trọng thiết lập giảm chuyển động của hệ điều hành.
- Speaker notes có số trang PDF và chỉ dẫn tương ứng với từng lần bấm.

`npm run build` tạo bản web tĩnh trong `dist/`. Phục vụ thư mục đó qua HTTP để trình chiếu bản build.

## Điều khiển bằng điện thoại

1. Mở bài trình chiếu trên laptop. Đưa chuột xuống góc dưới bên trái rồi bấm biểu tượng điện thoại trên thanh Slidev.
2. Quét QR bằng điện thoại hoặc mở link ghép nối. Đóng hộp ghép nối trên laptop để tiếp tục trình chiếu.
3. Bấm **Lùi** hoặc **Tiến** trên điện thoại để lùi hoặc tiến từng bước. Mở lại hộp ghép nối và bấm **Kết thúc phiên** khi xong.

Trên GitHub Pages, điều khiển dùng PeerJS để ghép nối qua Internet. Nên thử trước trên cùng Wi-Fi hoặc hotspot. Mạng chặn WebRTC có thể không kết nối được. Nếu cần chạy qua LAN, dùng `npm run dev -- --remote --port 3047` rồi mở địa chỉ mạng mà Slidev in ra trên điện thoại. Giữ link hoặc QR ghép nối cho người điều khiển bài.

## Tệp cần xem

- [slides.md](slides.md) chứa nội dung, công thức KaTeX và speaker notes.
- [Đối chiếu nguồn](doi-chieu-nguon.md) ghi lại cách gom trang PDF và những chỗ cần kiểm tra về kỹ thuật.
- Ảnh chụp Edge ở 1280×720 gồm [bìa](previews/cover.png), [trang chuyển chương](previews/section-mo.png), [truy vấn tổng](previews/range-sum.png), [cửa sổ Mo](previews/mo-window.png), [bảng lazy](previews/lazy-table.png) và [biểu đồ thực nghiệm](previews/benchmark.png).

Ảnh bổ sung sau góp ý gồm [demo tổng đoạn](previews/sum-live.png), [demo Mo](previews/mo-run.png), [kết luận thực nghiệm](previews/benchmark-conclusion.png) và [online/offline](previews/offline-comparison.png)
