#ifndef _C_PLUS_PLUS_DATA_STRUCTURE_ALGORITHMS_
#define _C_PLUS_PLUS_DATA_STRUCTURE_ALGORITHMS_

#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono> //thư viện đo thời gian thực hiện các tác vụ.

// Hướng sắp xếp
enum class SortDirection {
    Ascending,
    Descending
};

// Lớp cơ sở hỗ trợ cả mảng và vector
template <typename T>
class BasicSort {
protected:
    T* data;
    size_t size;
    SortDirection direction;

public:
    // Constructor từ mảng
    BasicSort(T* arr, size_t sz, SortDirection dir)
        : data(arr), size(sz), direction(dir) {}

    // Constructor từ vector
    BasicSort(std::vector<T>& vec, SortDirection dir)
        : data(vec.data()), size(vec.size()), direction(dir) {}

    virtual ~BasicSort() = default;
    virtual void sort() = 0;

    void print() const {
        for (size_t i = 0; i < size; ++i) {
            std::cout << data[i] << " ";
        }
        std::cout << "\n";
    }
};

// Selection Sort
template <typename T>
class SelectionSort : public BasicSort<T> {
public:
    using BasicSort<T>::BasicSort;

    void sort() override {
        for (size_t i = 0; i < this->size - 1; ++i) {
            size_t index = i;
            for (size_t j = i + 1; j < this->size; ++j) {
                if ((this->direction == SortDirection::Ascending && this->data[j] < this->data[index]) ||
                    (this->direction == SortDirection::Descending && this->data[j] > this->data[index])) {
                    index = j;
                }
            }
            std::swap(this->data[i], this->data[index]);
        }
    }
};

// Bubble Sort
template <typename T>
class BubbleSort : public BasicSort<T> {
public:
    using BasicSort<T>::BasicSort;

    void sort() override {
        bool swapped;
        for (size_t i = 0; i < this->size - 1; ++i) {
            swapped = false;
            for (size_t j = 0; j < this->size - i - 1; ++j) {
                if ((this->direction == SortDirection::Ascending && this->data[j] > this->data[j + 1]) ||
                    (this->direction == SortDirection::Descending && this->data[j] < this->data[j + 1])) {
                    std::swap(this->data[j], this->data[j + 1]);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
};

// Insertion Sort
template <typename T>
class InsertionSort : public BasicSort<T> {
public:
    using BasicSort<T>::BasicSort;

    void sort() override {
        for (size_t i = 1; i < this->size; ++i) {
            T key = this->data[i];
            int j = i - 1;
            while (j >= 0 && ((this->direction == SortDirection::Ascending && this->data[j] > key) ||
                              (this->direction == SortDirection::Descending && this->data[j] < key))) {
                this->data[j + 1] = this->data[j];
                --j;
            }
            this->data[j + 1] = key;
        }
    }
};

// Quick Sort
template <typename T>
class QuickSort : public BasicSort<T> {
public:
    using BasicSort<T>::BasicSort;

    int partition(int low, int high) {
        T pivot = this->data[high];
        int i = low - 1;

        for (int j = low; j < high; ++j) {
            if ((this->direction == SortDirection::Ascending && this->data[j] <= pivot) ||
                (this->direction == SortDirection::Descending && this->data[j] >= pivot)) {
                ++i;
                std::swap(this->data[i], this->data[j]);
            }
        }
        std::swap(this->data[i + 1], this->data[high]);
        return i + 1;
    }

    void quickSort(int low, int high) {
        if (low < high) {
            int pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }

    void sort() override {
        if (this->size > 0)
            quickSort(0, static_cast<int>(this->size) - 1);
    }
};

// Merge Sort (Thuật toán sắp xếp trộn)
template <typename T>
class MergeSort : public BasicSort<T>
{
public:
    using BasicSort<T>::BasicSort;

    // Hàm trộn hai phân đoạn đã được sắp xếp: [left...mid] và [mid+1...right]
    void merge(int left, int mid, int right)
    {
        int n1 = mid - left + 1; // Số lượng phần tử của phân đoạn bên trái
        int n2 = right - mid;    // Số lượng phần tử của phân đoạn bên phải

        // Tạo các mảng tạm L (Left) và R (Right) để lưu dữ liệu trước khi trộn
        std::vector<T> L(n1);
        std::vector<T> R(n2);

        // Sao chép dữ liệu từ mảng gốc sang mảng tạm L và R
        for (int i = 0; i < n1; i++)
        {
            L[i] = this->data[left + i];
        }
        for (int j = 0; j < n2; j++)
        {
            R[j] = this->data[mid + 1 + j];
        }

        int i = 0;      // Chỉ số chạy duyệt mảng tạm L
        int j = 0;      // Chỉ số chạy duyệt mảng tạm R
        int k = left;   // Chỉ số chạy ghi đè kết quả lên mảng gốc data

        // Trộn các phần tử từ L và R vào lại mảng gốc theo thứ tự sắp xếp
        while (i < n1 && j < n2)
        {
            if ((this->direction == SortDirection::Ascending && L[i] <= R[j]) ||
                (this->direction == SortDirection::Descending && L[i] >= R[j]))
            {
                this->data[k] = L[i++]; // Lấy từ L nếu thỏa mãn hướng sắp xếp
            }
            else
            {
                this->data[k] = R[j++]; // Ngược lại lấy từ R
            }
            k++;
        }

        // Sao chép các phần tử còn lại của mảng L (nếu có)
        while (i < n1)
        {
            this->data[k++] = L[i++];
        }
        // Sao chép các phần tử còn lại của mảng R (nếu có)
        while (j < n2)
        {
            this->data[k++] = R[j++];
        }
    }

    // Hàm thực hiện sắp xếp (Triển khai theo phương pháp Bottom-Up / không đệ quy)
    void sort() override
    {
        int n = this->size; // Tổng số lượng phần tử của mảng
        
        /*
          Vòng lặp ngoài: Nhân đôi kích thước phân đoạn con (curr_size) sau mỗi lượt: 1 -> 2 -> 4 -> 8...
          
          Giải thích cách hoạt động (Bottom-Up / Sắp xếp từ dưới lên):
          Thay vì đệ quy chia đôi mảng lớn từ trên xuống, thuật toán đi từ các phần tử nhỏ nhất và gộp chúng lại:
          - Lượt 1 (curr_size = 1): Trộn các cặp mảng con kích thước 1 kề nhau thành mảng con kích thước 2.
            Ví dụ: [4], [2], [7], [1] -> Trộn thành các nhóm đã sắp xếp: [2, 4] và [1, 7].
          - Lượt 2 (curr_size = 2): Trộn các cặp mảng con kích thước 2 kề nhau thành mảng con kích thước 4.
            Ví dụ: [2, 4] và [1, 7] -> Trộn thành [1, 2, 4, 7].
          - Lượt 3 (curr_size = 4): Trộn các cặp mảng con kích thước 4 kề nhau thành mảng con kích thước 8...
          
          Do kích thước của phân đoạn con cần trộn ở lượt sau luôn gấp đôi lượt trước (vì trộn 2 mảng con 
          kích thước curr_size thành 1 mảng kích thước 2*curr_size), nên ta có bước cập nhật: curr_size = 2 * curr_size.
          Vòng lặp sẽ dừng khi curr_size >= n (kích thước mảng gốc).
        */
        for (int curr_size = 1; curr_size < n; curr_size = 2 * curr_size)
        {
            // Vòng lặp trong: Duyệt qua các cặp mảng con để trộn chúng lại
            for (int left = 0; left < n - 1; left += 2 * curr_size)
            {
                // Xác định vị trí giữa (mid) và ranh giới phải (right) của cặp mảng con
                int mid = std::min(left + curr_size - 1, n - 1);
                int right = std::min((left + 2 * curr_size - 1), (n - 1));
                
                // Trộn hai mảng con kề nhau
                merge(left, mid, right);
            }
        }
    }
};

#endif