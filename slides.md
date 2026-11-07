---
theme: default
title: Sqrt Decomposition
favicon: /favicon.svg
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: light
lineNumbers: true
transition: seminar-shift
fonts:
  provider: none
drawings:
  enabled: false
layout: default
class: seminar-opener seminar-cover
---

<SeminarOpener scene="cover">

<p class="cover-kicker">THUẬT TOÁN CHIA CĂN</p>

# Sqrt<br>Decomposition

</SeminarOpener>

<!--
PDF trang 1
-->

---
class: seminar-opener
chapter: sum
---

<SeminarOpener scene="sum">

# Chia block để xử lý tổng đoạn

Từ một truy vấn cụ thể đến cách lưu tổng block

</SeminarOpener>

<!--
PDF trang 2
-->

---

# Mỗi block lưu tổng các phần tử trong block đó

Với 12 phần tử, chọn $B = 4 \approx \sqrt{12}$

<BlockStrip :values="[1,2,3,4,5,6,7,8,9,10,11,12]" :block-size="4" :captions="['b[0] = 10', 'b[1] = 26', 'b[2] = 42']" />

<div class="columns">
<div>

**B** là kích thước block

</div>
<div>

**s** là số block, $s = \lceil n/B \rceil = 3$

</div>
</div>

<!--
PDF trang 3–5  
Các ô được đánh chỉ số từ 0  
B không bắt buộc đúng bằng căn, chỉ cần là số nguyên dương  
Làm tròn lên số block để tính cả block cuối có thể ngắn hơn  
Tiếp theo áp dụng cho sum(2, 10)
-->

---
clicks: 3
---

# Truy vấn: tính tổng đoạn [L, R]

<SumDemo :step="$clicks" />

<!--
PDF trang 3–8  
Mảng dùng chỉ số từ 0  
Block 0 chứa a[0..3], block 1 chứa a[4..7], block 2 chứa a[8..11]
[click] Cộng a[2] và a[3] để chạm đầu block 1
[click] Block 1 nằm trọn trong truy vấn  
Lấy một tổng đã lưu rồi nhảy sang i = 8
[click] Cộng a[8], a[9], a[10]  
Vị trí 11 nằm ngoài truy vấn
-->

---
clicks: 1
---

# Cập nhật: 1 giá trị ở vị trí i

Gán `a[5] = 20` ở vị trí 5 thuộc block 1

<BlockStrip
  :values="[1,2,3,4,5,$clicks ? 20 : 6,7,8,9,10,11,12]"
  :block-size="4"
  :captions="['b[0] = 10', $clicks ? 'b[1] = 40' : 'b[1] = 26', 'b[2] = 42']"
  :marks="{ 5: 'edge' }"
  :active-block="1"
/>

<div v-click class="result-line reveal">Δ = 20 − 6 = 14 → tổng block 1 tăng từ 26 lên 40</div>

<!--
PDF trang 9–11  
Giữ giá trị cũ để tính phần chênh lệch
[click] Cập nhật a[5] và cộng chênh lệch vào b[1]  
Hai tổng block còn lại giữ nguyên
-->

---
class: code-slide
---

# Xây dựng O(n), gán điểm O(1)

```cpp
vector<long long> block_sum((n + B - 1) / B, 0);
for (int i = 0; i < n; ++i)
    block_sum[i / B] += a[i];

void assign(int i, long long x) {
    block_sum[i / B] += x - a[i];
    a[i] = x;
}
```

Mỗi phần tử thuộc block `i / B` theo phép chia nguyên

<!--
PDF trang 12  
Đoạn mã minh họa giả sử n, B, a và block_sum đã được khai báo ở phạm vi thích hợp  
B phải dương  
Dùng long long cho tổng với giả định tổng và phép trừ vẫn nằm trong miền biểu diễn
-->

---
class: code-slide
---

# Chỉ nhảy B ô khi cả block nằm trong đoạn

```cpp {all|4-6|7-9}
long long sum(int l, int r) {
    long long ans = 0;
    for (int i = l; i <= r; ) {
        if (i % B == 0 && B <= r - i + 1) {
            ans += block_sum[i / B];
            i += B;
        } else {
            ans += a[i++];
        }
    }
    return ans;
}
```

Với `[2, 10]`, thứ tự `i` là 2, 3, 4, 8, 9, 10 và tổng bằng **63**

<!--
PDF trang 13  
Dùng mảng ban đầu cho ví dụ 63
[click] Nhảy B ô khi đang ở đúng đầu block và còn ít nhất B ô trong truy vấn
[click] Duyệt từng ô ở biên hoặc trong block cuối ngắn hơn B  
Cận O(B + n/B) vẫn giữ nguyên
-->

---

# Độ phức tạp và bộ nhớ

<div class="columns">
<div>
<h2>L, R cùng block</h2>

Ví dụ `[1, 3]` có $R-L+1\le B$ ô

$$O(B)$$

</div>
<div v-click class="accent reveal">
<h2>L, R khác block</h2>

Ví dụ `[1, 10]` có tối đa hai biên và $\lfloor n/B \rfloor$ block trọn dài $B$

$$O\left(B+\frac{n}{B}\right)$$

</div>
</div>

<div v-click class="reveal">

**Chọn $B \approx \sqrt n$** để truy vấn mất $O(\sqrt n)$, với bộ nhớ $O(n)$

</div>

<!--
PDF trang 14–17  
Nếu cùng block thì duyệt tối đa B ô
[click] Nếu khác block, mỗi biên có tối đa B−1 ô, còn số block trọn dài B bị chặn bởi n/B
[click] Cân bằng hai số hạng cho B gần căn n  
Tổng bộ nhớ là O(n + ceil(n/B)) = O(n), trong đó tổng block chỉ tốn O(ceil(n/B)) bộ nhớ phụ
-->

---
class: seminar-opener
chapter: lazy
---

<SeminarOpener scene="lazy">

# So sánh, thực nghiệm và lazy

Khi đổi thao tác, chi phí thay đổi thế nào?

</SeminarOpener>

<!--
PDF trang 18
-->

---

# Chọn cấu trúc theo thao tác cần hỗ trợ

| Tổng đoạn + gán điểm | Sqrt | Fenwick | Segment |
| --- | --- | --- | --- |
| Xây dựng | $O(n)$ | $O(n)$ | $O(n)$ |
| Gán điểm | $O(1)$ | $O(\log n)$ | $O(\log n)$ |
| Tổng đoạn | $O(\sqrt n)$ | $O(\log n)$ | $O(\log n)$ |

<!--
PDF trang 19  
Bảng dùng Fenwick xây tuyến tính, và lưu giá trị cũ để chuyển phép gán thành phép cộng chênh lệch  
Dòng truy vấn của Sqrt giả sử B gần căn n  
Các biểu đồ sau đo hiện thực cụ thể và tách phần xử lý khỏi dựng cấu trúc và I/O
-->

---

# Tỉ lệ cập nhật ảnh hưởng đến tổng thời gian

<BenchmarkChart chart="updates" description="Thời gian mỗi 100.000 thao tác theo thứ tự Sqrt, Fenwick, Segment — 10%: 13.54, 2.28, 9.22 ms — 50%: 7.94, 2.20, 6.08 ms — 90%: 1.69, 1.77, 2.80 ms — 99%: 0.34, 1.79, 1.96 ms" />

<!--
PDF trang 20  
n = q = 100.000, L đều trong [1,n], Sqrt B = 316  
Chỉ đo xử lý thao tác, không gồm xây dựng và I/O  
MSVC _MSC_FULL_VER=195136247, C++ /O2, Intel Core i5-12450HX thế hệ 12  
Mỗi seed đo 5 lần  
Cột là trung vị của 3 trung vị theo seed, vạch là min–max của các trung vị đó  
Với mẫu này Fenwick có thời gian thấp hơn ở 10% và 50% cập nhật, còn Sqrt có thời gian thấp hơn ở 90% và 99%
-->

---

# Bộ nhớ cấu trúc cần tính cả dữ liệu mà nó giữ

<BenchmarkChart chart="memory" description="Dung lượng do cấu trúc sở hữu — Tổng đoạn: Sqrt 783.8 KiB, Fenwick 1562.6 KiB, Segment 2048.0 KiB — Min và max đều có Sqrt 783.8 KiB, Segment 2048.0 KiB, Fenwick N/A" />

<!--
PDF trang 21  
n = 100.000, giá trị 8 byte, Sqrt B = 316  
Mỗi cấu trúc min/max chỉ lưu một loại cực trị  
Số liệu tính capacity các mảng và sizeof đối tượng, loại dữ liệu đầu vào hoặc trace chung và allocator  
Đây là dung lượng cấu trúc sở hữu, khác với peak RAM/RSS  
1 KiB = 1.024 byte  
N/A chỉ phép thử Fenwick trong bảng này, với truy vấn min/max đoạn bất kỳ và phép gán điểm
-->

---

# Kích thước block cần được kiểm tra bằng thực nghiệm

<BenchmarkChart chart="blockSize" description="B lần lượt là 79, 158, 316, 632, 1265 — Thời gian tương ứng là 10.52, 7.84, 7.91, 10.67, 17.76 ms mỗi 100.000 thao tác" />

<!--
PDF trang 22  
n = q = 100.000, cập nhật 50%, L đều trong [1,n], cùng trace cho mọi B  
Các B xấp xỉ 0,25√n, 0,5√n, √n, 2√n, 4√n  
C++ /O2, MSVC _MSC_FULL_VER=195136247, Intel Core i5-12450HX thế hệ 12  
Chỉ đo xử lý, loại xây dựng và I/O  
Trung vị của 3 trung vị theo seed, 5 lần mỗi seed, vạch min–max các trung vị  
Giá trị 7,84 và 7,91 ms sát nhau, nên đọc cùng vạch biến thiên
-->

---

# Min/max: bản Sqrt quét lại block sau mỗi phép gán

<BenchmarkChart chart="extremes" description="Ở 10%, 50%, 90%, 99% cập nhật, min của Sqrt là 31.2, 32.4, 26.0, 24.3 và Segment là 11.7, 9.7, 4.5, 3.1 — Max của Sqrt là 29.3, 31.3, 26.4, 24.6 và Segment là 11.4, 9.5, 4.8, 3.2 ms mỗi 100.000 thao tác" />

<!--
PDF trang 23  
n = q = 100.000, L đều trong [1,n], Sqrt B = 316  
Sqrt trong thử nghiệm này quét lại block sau mọi phép gán, khác với gán điểm khi chỉ lưu tổng  
Đo 3 seed × 5 mẫu, dùng trung vị của trung vị và vạch min–max theo seed  
Loại xây dựng và I/O, /O2, CPU ghim
-->

---

# Min/max khi tăng quy mô mảng

<BenchmarkChart chart="scaling" description="Với n bằng 1.000, 10.000, 100.000, min của Sqrt là 5.0, 11.6, 30.6 và Segment là 5.3, 7.2, 9.3 — Max của Sqrt là 5.1, 11.1, 31.5 và Segment là 5.3, 7.4, 9.3 ms mỗi 100.000 thao tác" />

<!--
PDF trang 24  
q = 100.000, cập nhật 50%, L đều trong [1,n], Sqrt B = floor(√n)  
Mỗi cấu hình có 3 seed × 5 mẫu  
Dùng trung vị của trung vị và vạch min–max theo seed  
Loại xây dựng và I/O, /O2, CPU ghim
-->

---
clicks: 3
---

# Cập nhật: Cộng 3 vào [2,10] sẽ hoạt động như thế nào?

<LazyDemo :step="$clicks" />

<!--
PDF trang 25–29  
a[i] lưu giá trị cơ sở  
lazy[k] lưu phần cộng đồng nhất của block k
[click] Cộng trực tiếp vào a[2] và a[3]  
Giá trị lần lượt thành 6 và 7
[click] Chỉ đổi lazy[1] thành 3 ở ví dụ này  
Các giá trị cơ sở 5, 6, 7, 8 không cần ghi lại
[click] Cộng trực tiếp vào a[8], a[9] và a[10]  
Giá trị lần lượt thành 12, 13, 14  
Vị trí 11 vẫn bằng 12
-->

---

# Truy vấn 1 điểm

<BlockStrip :values="[1,2,6,7,5,6,7,8,12,13,14,12]" :block-size="4" :captions="['lazy[0] = 0','lazy[1] = 3','lazy[2] = 0']" :marks="{5: 'retained'}" :active-block="1" />

<div class="display-math">

$$\operatorname{value}(i) = a[i] + \mathrm{lazy}\!\left[\left\lfloor\frac{i}{B}\right\rfloor\right]$$

</div>

<div v-click class="reveal">

Tại vị trí 5, giá trị thực là **6 + 3 = 9**

</div>

<!--
PDF trang 30  
a[5] hiển thị 6 vì đó là giá trị cơ sở
[click] Lấy block bằng phép chia nguyên rồi cộng lazy[1] = 3  
Đọc một điểm là O(1)
-->

---

# Cộng đoạn và hỏi tổng đều O(B + n/B)

`b[k]` lưu tổng thực, `lazy[k]` lưu phần cộng treo

| Phần được xử lý | Cộng đoạn +v | Truy vấn tổng |
| --- | --- | --- |
| Ô biên | `a[i] += v`<br>`b[k] += v` | `a[i] + lazy[k]` |
| Block trọn | `lazy[k] += v`<br>`b[k] += v × len[k]` | `b[k]` |

`len[k]` là số phần tử của block `k`, kể cả block cuối ngắn hơn

<!--
PDF trang 31–32  
Bất biến b[k] = tổng các a[i] cơ sở trong block k + len[k] × lazy[k]  
Khi hỏi tổng block trọn, phần cộng treo đã được tính trong b[k]  
Ví dụ cộng 3 vào [2,10] làm tổng thực lần lượt thành 16, 38 và 51  
Cả hai thao tác xử lý tối đa hai biên và các block trọn, nên có cùng cận
-->

---
class: seminar-opener
chapter: mo
---

<SeminarOpener scene="mo">

# Mo’s algorithm

Sắp lại truy vấn để tái sử dụng một cửa sổ

</SeminarOpener>

<!--
PDF trang 33
-->

---

# Xử lí online offline

<div class="columns">
<div>
<h2>Online</h2>
<p>Đến đâu, xử lý đến đó</p>
<p class="emphasis">Q1 → trả lời → Q2</p>
</div>
<div class="accent">
<h2>Offline</h2>
<p>Nhận toàn bộ truy vấn trước</p>
<p class="emphasis">Sắp thứ tự rồi xử lý</p>
</div>
</div>

Mo cơ bản áp dụng khi mảng **tĩnh** và có thể đổi thứ tự xử lý truy vấn

<!--
PDF trang 34  
Các truy vấn độc lập và đã biết trước  
Giữ id gốc để trả lời theo thứ tự đầu vào  
Nếu truy vấn sau phụ thuộc câu trả lời trước, không áp dụng cách sắp xếp này  
Mảng thay đổi đòi hỏi biến thể khác
-->

---

# Bài toán: tìm mode trong đoạn [L, R]

Mode là giá trị xuất hiện nhiều nhất, **nếu đồng hạng thì lấy giá trị lớn nhất**

<BlockStrip :values="[1,1,1,2,2,3,3,3,2,2]" />

Ba truy vấn `[0, 4]`, `[0, 9]` và `[3, 9]`

<div v-click class="reveal">

Với đoạn `[0, 9]`

| Giá trị $x$ | 1 | 2 | 3 |
| --- | --- | --- | --- |
| `cnt[x]` | 3 | **4** | 3 |

**Mode = 2**

</div>

<!--
PDF trang 35  
Dùng mảng chỉ số từ 0  
Mode ở đây có quy tắc phụ là chọn giá trị lớn hơn khi hai tần suất bằng nhau  
Đây sẽ là quy tắc sắp thứ tự cặp (tần suất, giá trị) ở trang sau
[click] Với đoạn [0,9], giá trị 2 có tần suất 4 và là mode
-->

---
clicks: 2
---

# Ý tưởng: giữ lại phần giao của hai đoạn

<MoDemo :step="$clicks" />

<!--
PDF trang 36  
Đang giữ [1,5] và muốn lấy [2,6]  
Phần giao [2,5] vẫn được giữ trong bộ đếm  
Mỗi lần dịch biên thêm hoặc xóa đúng một phần tử  
Ví dụ này minh họa bỏ trước rồi thêm và luôn có cửa sổ hợp lệ  
Mã tổng quát ở phần sau ưu tiên mở rộng trước
[click] Bỏ vị trí 1  
L chuyển từ 1 sang 2
[click] Thêm vị trí 6  
R chuyển từ 5 sang 6
-->

---

# Điều kiện dịch biên

| Điều kiện | Thao tác | Ý nghĩa |
| --- | --- | --- |
| `q.l < L` | `add(--L)` | Mở rộng sang trái |
| `R < q.r` | `add(++R)` | Mở rộng sang phải |
| `L < q.l` | `remove(L++)` | Thu hẹp bên trái |
| `q.r < R` | `remove(R--)` | Thu hẹp bên phải |

Nếu xử lý theo thứ tự bất kỳ, số lần thêm hoặc xóa có thể lên tới $O(NQ)$

<!--
PDF trang 37  
N là số phần tử, Q là số truy vấn  
L, R là cửa sổ hiện tại  
Các lệnh ++ và -- trước toán hạng cập nhật con trỏ trước khi lấy ô mới  
Các lệnh ++ và -- sau toán hạng lấy ô cũ để xóa  
Với hai đoạn rời nhau, mở rộng trước rồi mới thu hẹp để tránh xóa phần tử chưa có trong cửa sổ
-->

---

# Tối ưu: nhóm truy vấn theo block của L

Với $B = 3$, sắp theo cặp $\bigl(\lfloor L/B\rfloor,\ R\bigr)$

<BlockStrip :values="[0,1,2,3,4,5,6,7,8,9]" :block-size="3" index-only />

<div v-click class="reveal">

| Thứ tự Mo | Đoạn | L | $\lfloor L/B\rfloor$ | R |
| --- | --- | --- | --- | --- |
| Query 1 | [0, 4] | 0 | 0 | 4 |
| Query 2 | [0, 9] | 0 | 0 | 9 |
| Query 3 | [3, 9] | 3 | 1 | 9 |

</div>

<!--
PDF trang 38  
L/B là phép chia nguyên
[click] Đọc thứ tự truy vấn sau khi sắp  
Query 1–3 trên slide là thứ tự minh họa, để khớp trang 41–49  
Nguồn ghi “Query 0” cho [3,9] ở trang 38  
Khi cài đặt, id vẫn lấy từ thứ tự đầu vào thực tế và được giữ nguyên sau sort
-->

---

# Sắp theo block kiểm soát cả hai con trỏ

Trong cùng một nhóm, đầu trái nằm cùng block và các truy vấn được sắp theo $R$ tăng dần

<div class="columns">
<div>
<h2>Con trỏ L</h2>

Mỗi lần chuyển truy vấn trong nhóm, dịch tối đa $B-1$ vị trí

</div>
<div class="accent">
<h2>Con trỏ R</h2>

Trong nhóm, $R$ chỉ dịch sang phải nhưng có thể quay lại khi đổi nhóm

</div>
</div>

Có tối đa $\lceil N/B\rceil$ nhóm

<!--
PDF trang 39  
Sắp xếp theo block của L để giới hạn dao động trong mỗi nhóm  
R đi không giảm trong mỗi nhóm, do đó có thể tính cả lượt quét và chi phí chuyển nhóm theo O(N) mỗi nhóm
-->

---

# Độ phức tạp của Mo

Giả sử `add`, `remove` và `get_ans` đều tốn $O(1)$

| Con trỏ | Cách đếm số bước | Tổng |
| --- | --- | --- |
| R | $O(N)$ mỗi nhóm, kể cả chuyển nhóm | $O(N^2/B)$ |
| L | Tối đa $B-1$ bước trong nhóm mỗi lần đổi truy vấn | $O(QB+N)$ |

<div v-click class="reveal">

Với $B\approx\sqrt N$, có $O((N+Q)\sqrt N)$ lần thêm hoặc xóa

Tính cả sắp xếp, tổng thời gian là $O\left(Q\log Q+(N+Q)\sqrt N\right)$

</div>

<!--
PDF trang 40  
Giả sử 1 ≤ B ≤ N  
Số bước của L trong cùng nhóm là O(QB)  
Giữa các nhóm theo thứ tự block tăng dần, tổng quãng đường của L là O(N) vì mỗi lần chỉ tiến tới block ở bên phải  
Số hạng N bị hấp thụ bởi N²/B, nên kết quả chung của PDF giữ nguyên
[click] Thay B xấp xỉ căn N rồi cộng chi phí sắp xếp  
Với map và set ở ví dụ mode, nhân số lần thêm/xóa với O(log(D+1)), cộng Q lần đọc mode và thời gian sort
-->

---
clicks: 5
---

# Query 2: Mode [0, 9]

<MoDemo example="expand" :step="$clicks" />

<!--
PDF trang 41–46  
Query 1 [0,4] đếm (3,2,0) nên mode = 1  
Giữ L = 0 và năm ô đang có để xử lý Query 2
[click] Thêm vị trí 5  
cnt[3] tăng từ 0 lên 1
[click] Thêm vị trí 6  
cnt[3] tăng từ 1 lên 2
[click] Thêm vị trí 7  
cnt[3] tăng từ 2 lên 3  
Giá trị 1 và 3 đồng hạng, lấy 3
[click] Thêm vị trí 8  
cnt[2] tăng từ 2 lên 3  
Cả ba đồng hạng, lấy 3
[click] Thêm vị trí 9  
cnt[2] tăng từ 3 lên 4  
Cửa sổ [0,9] hoàn tất, mode = 2
-->

---
clicks: 3
---

# Query 3: Mode [3, 9]

<MoDemo example="shrink" :step="$clicks" />

<!--
PDF trang 47–49  
Giữ R = 9  
Mỗi lần bỏ đúng một ô ở trái và phần giao [3,9] được giữ nguyên
[click] Bỏ vị trí 0, cnt[1] từ 3 xuống 2
[click] Bỏ vị trí 1, cnt[1] từ 2 xuống 1
[click] Bỏ vị trí 2, cnt[1] từ 1 xuống 0  
Cửa sổ [3,9] hoàn tất, mode vẫn bằng 2
-->

---

# Duy trì mode bằng bảng đếm và set

<div class="columns">
<div>

| $x$ | `cnt[x]` |
| --- | --- |
| 1 | 3 |
| 2 | 4 |
| 3 | 3 |

</div>
<div class="accent">

`best = {(3,1), (3,3), (4,2)}`

Mỗi cặp lưu (tần suất, giá trị) và cặp lớn nhất là **(4, 2)**

</div>
</div>

Xóa cặp cũ → cập nhật `cnt[x]` → chèn cặp mới nếu còn xuất hiện

<!--
PDF trang 50  
Bảng dùng đoạn [0,9]  
set sắp theo tần suất rồi giá trị  
Khi tần suất bằng nhau, phần tử lớn hơn đứng sau, đúng quy tắc của đề  
Cặp có tần suất 0 không nằm trong best
-->

---
class: code-slide
---

# Code: cập nhật tần suất và lấy mode

```cpp
map<int, int> cnt;
set<pair<int, int>> best;

void change(int pos, int delta) {
    int x = a[pos], old = cnt[x];
    if (old > 0) best.erase({old, x});
    int now = cnt[x] = old + delta;
    if (now > 0) best.insert({now, x});
}
void add(int pos)    { change(pos, +1); }
void remove(int pos) { change(pos, -1); }
int get_mode()       { return best.rbegin()->second; }
```

`add` và `remove` tốn $O(\log(D+1))$, còn đọc mode tốn $O(1)$ khi đoạn có phần tử

<!--
PDF trang 51  
D là số giá trị phân biệt trên toàn mảng  
map giữ các khóa có tần suất 0 sau khi đã gặp, nên cận với D đếm riêng trong cửa sổ cần xóa khóa 0  
Với B gần căn N, thời gian cho bài mode này là O(Q log Q + (N+Q)√N log(D+1))  
Chỉ gọi get_mode khi đoạn không rỗng
-->

---
class: code-slide
---

# Code: sắp truy vấn, giữ lại id gốc

```cpp
struct Query { int l, r, id; };
int B = max(1, (int)sqrt(n));

auto cmp = [&](const Query& x, const Query& y) {
    int bx = x.l / B, by = y.l / B;
    if (bx != by) return bx < by;
    return x.r < y.r;
};
sort(qs.begin(), qs.end(), cmp);
```

Gán `id` theo vị trí đầu vào trước khi sắp

<!--
PDF trang 52  
Điều kiện truy vấn là 0 ≤ l ≤ r < n  
Thứ tự giữa hai truy vấn có cùng khóa (block, r) không ảnh hưởng kết quả  
Sau khi xử lý, có thể in ans theo thứ tự id
-->

---
class: code-slide
---

# Code: di chuyển cửa sổ và ghi đáp án

```cpp
int L = 0, R = -1;
vector<int> ans(qs.size());
for (const Query& q : qs) {
    while (L > q.l) add(--L);
    while (R < q.r) add(++R);
    while (L < q.l) remove(L++);
    while (R > q.r) remove(R--);
    ans[q.id] = get_mode();
}
```

Bất biến sau mỗi bước dịch biên: `cnt` và `best` mô tả đúng cửa sổ `[L, R]`

<!--
PDF trang 53  
Bắt đầu với cửa sổ rỗng [0,-1]  
Mở rộng trước khi thu hẹp để không xóa một ô nằm ngoài cửa sổ  
Khi các vòng lặp kết thúc, L = q.l và R = q.r  
Ghi kết quả vào id gốc
-->

---

# Tối ưu thêm

## Đường đi của R khi chuyển block

<MoOrdering />

<!--
PDF trang 54  
Mỗi hàng là một block của L, và mũi tên minh họa chiều sắp R  
Nét đứt là lúc đổi block  
Đổi hướng xen kẽ có thể giữ R gần phía vừa quét xong  
Hình chỉ minh họa hướng, quãng đường thực phụ thuộc vào các truy vấn
-->

---

# Cách sort khác thay thế Mo

<div class="columns">
<div class="accent">
<h2>Hilbert order</h2>
<p>Sắp các điểm <strong>(L, R)</strong> theo thứ tự trên đường cong Hilbert</p>
</div>
<div>
<h2>Quãng đường của hai con trỏ</h2>
<p>Những truy vấn ở gần nhau trên mặt phẳng thường được xử lý gần nhau hơn</p>
</div>
</div>

[An alternative sorting order for Mo’s algorithm](https://codeforces.com/blog/entry/61203)

<!--
PDF trang 55  
Hilbert thay thứ tự sắp truy vấn trong Mo  
Ý tưởng là giảm quãng đường dịch hai con trỏ trên các tập truy vấn phù hợp  
Hiệu quả thực tế phụ thuộc dữ liệu và chi phí tính khóa sắp xếp
-->

---
class: seminar-opener
chapter: practice
---

<SeminarOpener scene="practice">

# Ứng dụng thực tiễn

Tư tưởng của Sqrt Decomposition làm được gì?

</SeminarOpener>

<!--
PDF trang 56  
Liên hệ tư tưởng chia thành vùng, lưu tóm tắt và dùng tóm tắt để giảm lượng dữ liệu cần xử lý
-->

---

# BRIN: đọc tóm tắt trước, bỏ vùng không phù hợp

**Điều kiện: Amount ≥ 100**

<div class="three-parts">
  <div class="edge"><h2>Vùng A</h2><p>Min 10, Max 80</p><strong>Bỏ qua</strong></div>
  <div><h2>Vùng B</h2><p>Min 60, Max 140</p><strong>Đọc</strong></div>
  <div><h2>Vùng C</h2><p>Min 150, Max 220</p><strong>Đọc</strong></div>
</div>

Vùng A có **Max < 100**, nên không thể chứa hàng thỏa điều kiện

<p class="small">Ví dụ chỉ mục BRIN kiểu min/max trong PostgreSQL</p>

<!--
PDF trang 57  
BRIN tóm tắt những trang vật lý liền nhau và có lợi khi cột có tương quan với vị trí lưu trữ  
Trong ví dụ này, B và C là các vùng ứng viên  
Bộ thực thi kiểm tra điều kiện trên các hàng ở vùng được đọc  
Tài liệu: https://www.postgresql.org/docs/current/brin.html
-->

---

# Lưu trữ dạng cột: chỉ đọc vùng và cột cần thiết

| Hệ thống / định dạng | Đơn vị lưu trữ |
| --- | --- |
| Parquet | Row group / column chunk |
| Snowflake | Micro-partition |
| BigQuery | Block của bảng clustered |

<p class="result-line">Metadata → loại vùng không khớp → đọc cột cần dùng</p>

<!--
PDF trang 58  
Tùy định dạng và bộ đọc, metadata cho biết thống kê và vị trí cột để bỏ qua vùng không thể thỏa bộ lọc  
Các ví dụ minh họa cùng tư tưởng tổ chức và tóm tắt dữ liệu theo vùng
Parquet: https://parquet.apache.org/docs/concepts/
Snowflake: https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions
BigQuery: https://docs.cloud.google.com/bigquery/docs/clustered-tables
-->

---

# Mô hình 100 triệu bản ghi: ghép hai biên và phần giữa

**100.000.000 bản ghi chia thành 10.000 block, mỗi block có 10.000 bản ghi**

Mỗi block lưu `Total_Amount`, `Max_Transaction` và `Error_Count`

Tính tổng đoạn **[12.345, 89.012.345]**, chỉ số từ 0

<div class="three-parts">
  <div v-click class="edge reveal"><h2>Biên trái</h2><p>12.345..19.999</p><strong>7.655 ô</strong></div>
  <div v-click class="reveal"><h2>Block 2..8.900</h2><p>Đọc Total_Amount đã lưu</p><strong>8.899 tổng block</strong></div>
  <div v-click class="edge reveal"><h2>Biên phải</h2><p>89.010.000..89.012.345</p><strong>2.346 ô</strong></div>
</div>

<div v-click class="reveal"><strong class="formula-text">7.655 + 8.899 + 2.346 = 18.900</strong> giá trị cần cộng</div>

<!--
PDF trang 59  
Mỗi block dài B = 10.000 và các khoảng đều lấy cả hai đầu mút
[click] Biên trái nằm cuối block 1
[click] Đếm 8.900 − 2 + 1 = 8.899 tổng block
[click] Biên phải nằm ở đầu block 8.901
[click] Cộng số ô ở hai biên và số tổng block  
Đây là số giá trị cần cộng trong mô hình, khác với số lần đọc đĩa hay thời gian thực nghiệm
-->

---

# Sửa một bản ghi: chi phí phụ thuộc metadata

Bản ghi $i$ thuộc block $k=\lfloor i/B\rfloor$, với $B$ là kích thước block

| Metadata | Cách sửa khi gán điểm | Chi phí |
| --- | --- | --- |
| `Total_Amount` | Cộng `new − old` | $O(1)$ |
| `Error_Count` | Trừ cờ lỗi cũ, cộng cờ mới | $O(1)$ |
| `Max_Transaction` | Có thể cần quét lại block | $O(B)$ |

**Ví dụ max**<br>`[4, 9, 7]` → sửa 9 thành 2 → max mới là **7**

<!--
PDF trang 60  
Khi một giá trị cực đại bị giảm và metadata chỉ giữ max, có thể phải tìm lại max từ dữ liệu trong block  
trang 59–60 gọi kích thước block là s, khác với ký hiệu s là số block ở trang 5  
Dùng B xuyên suốt bộ slide này
-->

---

# Đánh giá khả năng áp dụng

| Đặc điểm | Điều kiện hoặc lợi ích |
| --- | --- |
| Cache-Friendly | Duyệt ô liền nhau có thể tận dụng cache và prefetch |
| Parallel Processing | Có thể xử lý các block độc lập |
| Low running cost | Dễ cài đặt, kiểm thử và tích hợp |

**Chi phí gán điểm phụ thuộc metadata**<br>Chèn và xóa làm thay đổi ranh giới trong mô hình block cố định

<!--
PDF trang 61  
Gán điểm cho tổng hoặc đếm lỗi vẫn O(1), còn min/max có thể cần O(B)  
Mảng liên tiếp có thể phải dời dữ liệu hoặc tái cân bằng block khi chèn, xóa  
Lợi ích cache phụ thuộc cách bố trí dữ liệu và tải công việc  
Các block chỉ song song độc lập nếu không có xung đột truy cập hoặc cập nhật
-->

---
class: seminar-opener
chapter: questions
---

<SeminarOpener scene="questions">

# Phần steve hỏi đáp

</SeminarOpener>

<!--
PDF trang 62  
Dành thời gian hỏi đáp trước khi chuyển sang các bài tập
-->

---

# Bài 1: tự tính một truy vấn mới

Tính `sum(1, 9)` trên mảng ban đầu với **B = 4**

<BlockStrip :values="[1,2,3,4,5,6,7,8,9,10,11,12]" :block-size="4" />

<p class="exercise">Chỉ ra biên trái, block trọn và biên phải</p>

<!--
PDF trang 63  
Để người nghe tự xác định các chỉ số trước khi tính  
Bài dùng đoạn đóng và chỉ số từ 0  
Đáp án xuất hiện sau Bài 3
-->

---

# Bài 2: cập nhật rồi truy vấn lại

Từ mảng Bài 1, gán `a[5] = 20`

<BlockStrip :values="[1,2,3,4,5,6,7,8,9,10,11,12]" :block-size="4" :marks="{5: 'edge'}" />

<p class="exercise">Tổng block nào đổi?<br><code>sum(1, 9)</code> mới bằng bao nhiêu?</p>

<!--
PDF trang 64  
Hỏi xem có cần tính lại cả ba block không  
Đáp án ở cuối bài
-->

---
clicks: 1
---

# Bài 3: chọn cấu trúc và giải thích

<ol class="exercise-options" type="A">
  <li>Mảng tĩnh, nhiều truy vấn tổng<span class="focus-option" v-click aria-hidden="true"></span></li>
  <li>Gán điểm + tổng đoạn, nhiều truy vấn</li>
  <li>Đếm ≥ K, gán điểm, muốn code theo block</li>
</ol>

<!--
PDF trang 65–66  
Yêu cầu nêu cấu trúc, chi phí truy vấn và chi phí cập nhật nếu có
[click] Nhấn mạnh trường hợp A để bắt đầu thảo luận  
Nguồn không đưa đáp án cho Bài 3
-->

---

# Đáp án Bài 1: sum(1,9) = 54

Đoạn **[1, 9]** trên mảng ban đầu

<BlockStrip :values="[1,2,3,4,5,6,7,8,9,10,11,12]" :block-size="4" :captions="['b[0] = 10','b[1] = 26','b[2] = 42']" :marks="{1:'edge',2:'edge',3:'edge',4:'retained',5:'retained',6:'retained',7:'retained',8:'edge',9:'edge'}" />

<div class="three-parts">
  <div class="edge"><h2>Biên trái</h2><strong>2 + 3 + 4 = 9</strong></div>
  <div><h2>Block giữa</h2><strong>26</strong></div>
  <div class="edge"><h2>Biên phải</h2><strong>9 + 10 = 19</strong></div>
</div>

<p class="formula-text">9 + 26 + 19 = 54</p>

<!--
PDF trang 67  
Biên trái ở chỉ số 1–3, block giữa ở 4–7 và biên phải ở 8–9
-->

---

# Đáp án Bài 2: sum(1,9) = 68

Sau gán `a[5] = 20`, **Δ = 14**

<BlockStrip :values="[1,2,3,4,5,20,7,8,9,10,11,12]" :block-size="4" :captions="['b[0] = 10','b[1] = 40','b[2] = 42']" :marks="{1:'edge',2:'edge',3:'edge',4:'retained',5:'added',6:'retained',7:'retained',8:'edge',9:'edge'}" :active-block="1" />

<div class="three-parts">
  <div class="edge"><h2>Biên trái</h2><strong>9</strong></div>
  <div><h2>Block giữa</h2><strong>26 + 14 = 40</strong></div>
  <div class="edge"><h2>Biên phải</h2><strong>19</strong></div>
</div>

<p class="formula-text">9 + 40 + 19 = 68</p>

<!--
PDF trang 68  
Chỉ block 1 đổi tổng  
Biên trái và biên phải vẫn có tổng lần lượt là 9 và 19
-->
