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

// Merge Sort
template <typename T>
class MergeSort : public BasicSort<T> {
public:
    using BasicSort<T>::BasicSort;

    void merge(int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        std::vector<T> L(n1);
        std::vector<T> R(n2);

        for (int i = 0; i < n1; i++)
            L[i] = this->data[left + i];
        for (int j = 0; j < n2; j++)
            R[j] = this->data[mid + 1 + j];

        int i = 0, j = 0, k = left;

        while (i < n1 && j < n2) {
            if ((this->direction == SortDirection::Ascending && L[i] <= R[j]) ||
                (this->direction == SortDirection::Descending && L[i] >= R[j])) {
                this->data[k] = L[i++];
            } else {
                this->data[k] = R[j++];
            }
            k++;
        }

        while (i < n1) this->data[k++] = L[i++];
        while (j < n2) this->data[k++] = R[j++];
    }

    void sort() override {
        int n = this->size;
        for (int curr_size = 1; curr_size < n; curr_size = 2 * curr_size) {
            for (int left = 0; left < n - 1; left += 2 * curr_size) {
                int mid = std::min(left + curr_size - 1, n - 1);
                int right = std::min((left + 2 * curr_size - 1), (n - 1));
                merge(left, mid, right);
            }
        }
    }
};

#endif