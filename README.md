# Sqrt Decomposition

Project Slidev cho bài seminar, gồm 46 slide 16:9 với speaker notes tiếng Việt. Font và năm biểu đồ thực nghiệm được đóng gói cùng project.

[Mở bài trình chiếu trên GitHub Pages](https://pnthuc.github.io/sqrt-decomposition-seminar/). GitHub Actions triển khai lại sau mỗi lần đẩy lên `main`.

## Chạy trong thư mục này

Cần Node.js 22.22.0 trở lên.

```sh
npm ci
npm run dev -- --port 3047
```

Mở [bản trình chiếu](http://localhost:3047/) hoặc [chế độ người trình bày](http://localhost:3047/presenter/).

- **→ / ←** tiến hoặc lùi một bước bấm. Khi hết bước, phím chuyển sang slide tiếp theo hoặc trước đó.
- Ví dụ tổng đoạn ở slide 4, lazy ở slide 16, cửa sổ Mo ở slide 22 và ví dụ mode ở slide 27–28.
- Ở slide 4, kéo qua các ô rồi thả chuột, hoặc dùng Tab và Enter để đặt hai đầu. Ba phép tính hiện ngay khi chọn xong. Phím → trình bày lại từng bước, hoặc chạy ví dụ gốc nếu chưa chọn đoạn.
- Slide dùng chuyển cảnh ngắn theo chiều bấm và tôn trọng thiết lập giảm chuyển động của hệ điều hành.
- Speaker notes có số trang PDF và chỉ dẫn tương ứng với từng lần bấm.

`npm run build` tạo bản web tĩnh trong `dist/`. Phục vụ thư mục đó qua HTTP để trình chiếu bản build.

## Tệp cần xem

- [slides.md](slides.md) chứa nội dung, công thức KaTeX và speaker notes.
- [Đối chiếu nguồn](doi-chieu-nguon.md) ghi lại cách gom trang PDF và những chỗ cần kiểm tra về kỹ thuật.
- Ảnh chụp Edge ở 1280×720 gồm [bìa](previews/cover.png), [trang chuyển chương](previews/section-mo.png), [truy vấn tổng](previews/range-sum.png), [cửa sổ Mo](previews/mo-window.png), [bảng lazy](previews/lazy-table.png) và [biểu đồ thực nghiệm](previews/benchmark.png).
