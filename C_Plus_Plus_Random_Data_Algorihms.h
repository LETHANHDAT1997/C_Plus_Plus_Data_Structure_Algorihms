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
        std::uniform_real_distribution<T> distrib(minVal, maxVal); // Dùng uniform_real_distribution cho kiểu float

        // Cấp phát bộ nhớ cho mảng động
        T* arr = new T[size];
        for (size_t i = 0; i < size; ++i) {
            arr[i] = distrib(gen);
        }
        return arr;
    }

    // Hàm tạo vector ngẫu nhiên
    std::vector<T> generateRandomVector(size_t size, T minVal, T maxVal) {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<T> distrib(minVal, maxVal);

        std::vector<T> vec(size);
        for (size_t i = 0; i < size; ++i) {
            vec[i] = distrib(gen);
        }
        return vec;
    }
};

#endif