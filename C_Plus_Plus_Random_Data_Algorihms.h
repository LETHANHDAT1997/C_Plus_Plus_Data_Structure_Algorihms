#ifndef _C_PLUS_PLUS_RANDOM_DATA_ALGORIHMS_
#define _C_PLUS_PLUS_RANDOM_DATA_ALGORIHMS_

#include <iostream>
#include <vector>
#include <random>

template <typename T>
class RandomGenerator {
public:
    // Hàm tạo mảng ngẫu nhiên
    T* generateRandomArray(size_t size, T minVal, T maxVal) {
        std::random_device rd;
        std::mt19937 gen(rd());

        // FIX: Dùng if constexpr để phân biệt kiểu số thực và số nguyên,
        // tránh lỗi biên dịch khi T = int (uniform_real_distribution không hỗ trợ kiểu nguyên).
        T* arr = new T[size];
        if constexpr (std::is_floating_point_v<T>) {
            std::uniform_real_distribution<T> distrib(minVal, maxVal);
            for (size_t i = 0; i < size; ++i)
                arr[i] = distrib(gen);
        } else {
            std::uniform_int_distribution<T> distrib(minVal, maxVal);
            for (size_t i = 0; i < size; ++i)
                arr[i] = distrib(gen);
        }
        return arr;
    }

    // Hàm tạo vector ngẫu nhiên
    std::vector<T> generateRandomVector(size_t size, T minVal, T maxVal) {
        std::random_device rd;
        std::mt19937 gen(rd());

        // FIX: Dùng if constexpr để phân biệt kiểu số thực và số nguyên
        std::vector<T> vec(size);
        if constexpr (std::is_floating_point_v<T>) {
            std::uniform_real_distribution<T> distrib(minVal, maxVal);
            for (size_t i = 0; i < size; ++i)
                vec[i] = distrib(gen);
        } else {
            std::uniform_int_distribution<T> distrib(minVal, maxVal);
            for (size_t i = 0; i < size; ++i)
                vec[i] = distrib(gen);
        }
        return vec;
    }
};

#endif