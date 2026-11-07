# Đối chiếu với PDF gốc

Nguồn là `SQRT Decomposition.pdf`, 68 trang. Số trang dưới đây tính từ bìa. Trang 1 được dùng làm mẫu bìa vì không có tệp ảnh bìa riêng trong các tệp tìm được.

| Trang PDF | Slidev | Nội dung |
| --- | --- | --- |
| 1 | 1 | Bìa |
| 2–17 | 2–8 | Tổng đoạn, gán điểm, mã C++, độ phức tạp |
| 18–19 | 9–10 | So sánh Sqrt, Fenwick và Segment |
| 20–24 | 11–15 | Năm biểu đồ, theo đúng thứ tự nguồn |
| 25–32 | 16–18 | Cộng đoạn, hỏi điểm và hỏi tổng có lazy |
| 33–40 | 19–26 | Mo offline, dịch biên, sắp xếp, phân tích |
| 41–49 | 27–28 | Mode với ba truy vấn, gộp các lần dịch vào các bước bấm |
| 50–55 | 29–34 | Bảng đếm, set, mã C++, thứ tự zíc zắc và Hilbert |
| 56–61 | 35–40 | Ứng dụng và mô hình 100 triệu bản ghi |
| 62–68 | 41–46 | Hỏi đáp, ba bài tập và hai đáp án từ PDF |

Năm biểu đồ được vẽ lại theo số liệu, đơn vị và điều kiện đo trong PDF. Vạch min–max được đặt theo tọa độ trên biểu đồ nguồn vì PDF không in giá trị hai đầu vạch. Ảnh gốc nằm trong [assets/benchmark](assets/benchmark) để đối chiếu, còn speaker notes ghi cách đọc từng phép thử.

## Chỗ cần kiểm tra

| Trang PDF | Điểm cần làm rõ | Cách xử lý trong Slidev |
| --- | --- | --- |
| 5, 14–17 | $B$ phải nguyên dương. Công thức $s=n/B$ chỉ đúng khi $n$ chia hết cho $B$. | Dùng $B\approx\sqrt n$ và $s=\lceil n/B\rceil$. Ví dụ vẫn chọn $B=4$ và có 3 block. Ghi rõ bộ nhớ phụ cho tổng block là $O(\lceil n/B\rceil)$, tổng bộ nhớ là $O(n)$. |
| 19 | Chi phí xây Fenwick $O(n)$ phụ thuộc cách xây. Gán điểm bằng hiệu cần biết giá trị cũ. | Giữ nguyên bảng và ghi hai điều kiện trong speaker notes. |
| 27, 30–32 | Tiêu đề tr. 27 nói cập nhật $b[i]$ nhưng bước đó thay `lazy[1]`. Phép lấy block ở tr. 30 cần chia nguyên. Định nghĩa tổng ở tr. 31 có thể bị đọc là tổng của các giá trị cơ sở. | Tách ví dụ chỉ giữ lazy khỏi biến thể giữ cả tổng. Dùng $k=\lfloor i/B\rfloor$. Ở biến thể thứ hai, $b[k]=\sum_{i\text{ trong block }k} a[i]+\operatorname{len}[k]\cdot\operatorname{lazy}[k]$. |
| 38, 41–49, 52 | Đoạn `[3, 9]` có tên “Query 0” ở tr. 38 và “Query 3” trong chuỗi minh họa. | Dùng “Query 3” khi nói về thứ tự minh họa. Mã C++ giữ riêng `id` theo thứ tự đầu vào. |
| 39–40 | Cận $O(QB)$ của $L$ chỉ đếm các bước bên trong từng nhóm. Khi đổi nhóm, $L$ còn có thể tiến thêm. | Ghi $O(QB+N)$ cho $L$. Chi phí chuyển nhóm cộng lại $O(N)$ và đã được hấp thụ bởi $O(N^2/B)$, nên tổng cận trong PDF vẫn đúng. |
| 40, 51 | Phân tích tổng quát giả sử `add` và `remove` là $O(1)$, còn ví dụ mode dùng `map` và `set`. `map` giữ khóa có tần suất 0. | Định nghĩa $D$ là số giá trị phân biệt trên toàn mảng. Ghi rõ mỗi lần thêm hoặc xóa mất $O(\log(D+1))$. Với $B\approx\sqrt N$, tổng cận cho mã mode là $O(Q\log Q+(N+Q)\sqrt N\log(D+1))$. |
| 59–60 | Nguồn dùng $s$ cho kích thước block ở đây, còn tr. 5 dùng $s$ cho số lượng block. | Giữ kích thước 10.000 và mọi số liệu truy vấn. Dùng $B$ cho kích thước block và cho cận $O(B)$ khi quét lại max. |
| 61 | Nhận xét về gán điểm mâu thuẫn với tr. 12, 19 và 60. Hiệu quả prefetch cũng phụ thuộc tải công việc. | Phân biệt gán điểm cho tổng hoặc đếm lỗi $O(1)$ với cập nhật min/max có thể cần $O(B)$. Chèn và xóa có thể làm dời dữ liệu hoặc đổi ranh giới block. |
