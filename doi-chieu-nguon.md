# Đối chiếu với PDF gốc

Nguồn là `SQRT Decomposition.pdf`, 68 trang. Số trang dưới đây tính từ bìa. Trang 1 được dùng làm mẫu bìa vì không có tệp ảnh bìa riêng trong các tệp tìm được.

| Trang PDF | Slidev | Nội dung |
| --- | --- | --- |
| 1 | 1 | Bìa |
| 2–17 | 2–8 | Tổng đoạn, gán điểm, mã C++, độ phức tạp |
| 3–13, 63–64, 67–68 | 9–13 | Demo tổng đoạn bổ sung, Bài 1 và Bài 2 kèm đáp án ngay sau phần tổng đoạn |
| 18–19 | 14–15 | So sánh Sqrt, Fenwick và Segment |
| 20–24 | 16, 18, 20, 22, 24 | Năm biểu đồ, theo đúng thứ tự và số liệu nguồn |
| 20–24 | 17, 19, 21, 23, 25 | Kết luận bổ sung ngay sau từng biểu đồ, nêu điều kiện lựa chọn |
| 65–66 | 26–27 | Bài 3 và gợi ý bổ sung ngay sau phần so sánh |
| 25–32 | 28–30 | Cộng đoạn, hỏi điểm và hỏi tổng có lazy |
| 33–40 | 31–39 | Mo offline, dịch biên, sắp xếp, phân tích, thêm ví dụ phụ thuộc đáp án trước ở slide 33 |
| 41–49 | 40–41 | Mode với ba truy vấn, gộp các lần dịch vào các bước bấm |
| 35–49 | 42 | Demo bổ sung chạy đủ ba truy vấn Mo, trả kết quả theo id đầu vào |
| 50–55 | 43–48 | Bảng đếm, set, mã C++, thứ tự zíc zắc và Hilbert |
| 56–61 | 49–54 | Ứng dụng và mô hình 100 triệu bản ghi |
| 62 | 55 | Hỏi đáp tổng hợp |

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


## Nội dung bổ sung theo góp ý seminar

Các slide kết luận tách quan sát trong mẫu đo khỏi tiêu chí chọn cấu trúc, các ngưỡng tỉ lệ cập nhật và quy mô mảng chỉ mô tả cấu hình nguồn đã đo

Slide 32 nêu rõ chi phí chờ, lưu truy vấn và sắp xếp của offline, đồng thời phân biệt điều kiện chung của offline với điều kiện mảng tĩnh của Mo cơ bản

Slide 33 dùng ví dụ tự xây dựng, Q1 trả về 6 rồi mới xác định đoạn Q2 là [6,9], kết quả 34

Gợi ý Bài 3 là phần bổ sung vì PDF không có đáp án, với trường hợp C dùng mảng đã sắp trong mỗi block, truy vấn O(B + (n/B) log B) và gán điểm O(B)

Demo Mo giữ mảng và ba đoạn của nguồn, đổi thứ tự đầu vào thành [3,9], [0,9], [0,4] để minh họa id, xử lý theo thứ tự Q3, Q2, Q1 rồi ghi đáp án theo đầu vào là 2, 2, 1

Tham khảo giải thích thuật toán bổ sung tại [Sqrt Decomposition — CP-Algorithms](https://cp-algorithms.com/data_structures/sqrt_decomposition.html)
