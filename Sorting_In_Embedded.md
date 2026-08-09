# Thuật toán sắp xếp trong Lập trình Nhúng (Embedded Systems)

## 🔑 Tiêu chí của hệ thống nhúng khác với PC

| Ràng buộc | Embedded | PC |
|---|---|---|
| **RAM** | Vài KB đến vài MB | GB |
| **Stack size** | Cực nhỏ (vài KB) | ~8 MB |
| **Heap (`new`/`malloc`)** | Thường **bị cấm** | Thoải mái |
| **`std::vector`** | Thường **không dùng** | OK |
| **Đệ quy** | **Nguy hiểm** (Stack Overflow) | OK |
| **Xác định thời gian** | Cần **deterministic** | Không cần |

---

## ❌ Thuật toán KHÔNG nên dùng trong embedded

### 1. `QuickSort` – Tránh nếu dùng đệ quy

```cpp
// Nguy hiểm trên MCU có stack nhỏ (STM32 thường chỉ ~4-8 KB stack)
void quickSort(int low, int high) {   // Đệ quy sâu O(log N) ~ O(N)
    quickSort(low, pi - 1);           // ← mỗi call tốn stack frame
    quickSort(pi + 1, high);
}
```

- Worst-case stack depth: **O(N)** → **Crash MCU**
- Non-deterministic timing → không dùng cho real-time

### 2. `MergeSort` – Tránh vì cấp phát heap động

```cpp
std::vector<T> L(n1);   // new[] bên trong → heap allocation
std::vector<T> R(n2);   // Heap có thể bị phân mảnh (fragmentation) trên MCU
```

- Heap fragmentation nguy hiểm cho hệ thống chạy dài ngày
- `std::vector` không có trên nhiều bare-metal environment

---

## ✅ Thuật toán NÊN dùng trong embedded

### 🥇 Insertion Sort – Tốt nhất cho embedded nhỏ

```
✔ Không đệ quy        → stack an toàn
✔ Không cấp phát heap → chỉ dùng O(1) bộ nhớ phụ
✔ In-place            → làm việc trực tiếp trên mảng gốc
✔ Stable sort         → giữ nguyên thứ tự phần tử bằng nhau
✔ Best case O(N)      → cực nhanh nếu dữ liệu gần đã sắp xếp (sensor data)
✔ Deterministic       → thời gian thực thi có thể tính trước
```

> **Phù hợp khi:** N < 100, dữ liệu cảm biến gần có thứ tự.

### 🥈 Selection Sort – Đơn giản, ổn định với flash memory

```
✔ Không đệ quy, không heap
✔ Số lần SWAP tối thiểu O(N) → bảo vệ flash (write endurance)
✗ Luôn O(N²) dù đã sắp xếp
```

> **Phù hợp khi:** cần **giảm tối đa số lần ghi** (flash/EEPROM có giới hạn write cycle).

### 🥉 Shell Sort *(chưa có trong repo)* – Trade-off tốt

```
✔ Không đệ quy, không heap
✔ O(N log² N) trung bình – nhanh hơn O(N²)
✔ Tốt cho N từ 100 đến vài nghìn
```

---

## 📊 So sánh theo độ lớn dữ liệu

| N | Khuyến nghị | Lý do |
|---|---|---|
| N < 50 | **Insertion Sort** | Overhead thấp, cache-friendly |
| 50 < N < 1000 | **Shell Sort** | Cân bằng tốc độ / bộ nhớ |
| N > 1000 | **Heap Sort** (iterative) | O(N log N), không đệ quy, không heap |
| N > 1000 (có RAM) | **QuickSort iterative** + explicit stack | Dùng vòng lặp + stack tường minh thay đệ quy |

---

## 📐 So sánh độ phức tạp

| Thuật toán | Time (Best) | Time (Avg) | Time (Worst) | Space | Đệ quy | Heap |
|---|---|---|---|---|---|---|
| Insertion Sort | O(N) | O(N²) | O(N²) | **O(1)** | ❌ | ❌ |
| Selection Sort | O(N²) | O(N²) | O(N²) | **O(1)** | ❌ | ❌ |
| Bubble Sort | O(N) | O(N²) | O(N²) | **O(1)** | ❌ | ❌ |
| Shell Sort | O(N log N) | O(N log² N) | O(N²) | **O(1)** | ❌ | ❌ |
| Heap Sort | O(N log N) | O(N log N) | O(N log N) | **O(1)** | ❌ | ❌ |
| Quick Sort | O(N log N) | O(N log N) | O(N²) | O(log N) | ⚠️ | ❌ |
| Merge Sort | O(N log N) | O(N log N) | O(N log N) | **O(N)** | ⚠️ | ⚠️ |

---

## 💡 Nguyên tắc vàng cho embedded

> **Không dùng `new`/`malloc`/`std::vector` trong production embedded code.**  
> Mọi bộ nhớ phải được phân bổ tĩnh (`static`) hoặc trên stack với kích thước biết trước.

### Ví dụ: Cách dùng an toàn với codebase hiện tại

```cpp
// ✅ Embedded-safe: cấp phát mảng TĨNH, không dùng heap
#define MAX_SENSOR_SAMPLES  64

static float sensorBuffer[MAX_SENSOR_SAMPLES];  // static → sống suốt vòng đời chương trình
size_t n = readSensorData(sensorBuffer, MAX_SENSOR_SAMPLES);

// InsertionSort chỉ dùng O(1) bộ nhớ phụ, không đệ quy → an toàn
InsertionSort<float> sorter(sensorBuffer, n, SortDirection::Ascending);
sorter.sort();
```

### ❌ Cách dùng NGUY HIỂM trong embedded

```cpp
// ❌ KHÔNG làm vì phân bổ heap động → fragmentation, non-deterministic
float* buf = new float[n];                     // new[] → HEAP
std::vector<float> vec(n);                     // vector → HEAP
MergeSort<float> ms(vec, SortDirection::Ascending);  // vector nội bộ → HEAP
```

---

## 🏆 Kết luận

| Tình huống | Lựa chọn tối ưu |
|---|---|
| MCU bare-metal, N nhỏ (< 100) | ✅ **Insertion Sort** |
| Cần bảo vệ flash/EEPROM | ✅ **Selection Sort** |
| MCU có RAM vừa, N trung bình | ✅ **Shell Sort** |
| RTOS, cần O(N log N) guaranteed | ✅ **Heap Sort** (iterative) |
| Có OS, N lớn, có RAM đủ | ⚠️ Quick Sort (iterative version) |
| **Tuyệt đối tránh** | ❌ MergeSort (heap) + QuickSort đệ quy sâu |
