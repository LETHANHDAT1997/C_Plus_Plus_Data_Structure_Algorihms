#include "C_Plus_Plus_Data_Structure_Algorihms.h"

// // Hàm để in vector
// template<typename T>
// void printVector(const std::vector<T>& vec) {
//     for (T num : vec) {
//         std::cout << num << " ";
//     }
//     std::cout << std::endl;
// }

// // Hàm hợp nhất hai phần của mảng vec
// template<typename T>
// void merge(std::vector<T>& vec, int left, int mid, int right) 
// {
//     int n1 = mid - left + 1;
//     int n2 = right - mid;

//     std::cout << "n1:"  << n1   << " ";
//     std::cout << "n2:"   << n2   << " ";
//     std::cout << std::endl;

//     std::vector<T> L(n1);
//     std::vector<T> R(n2);
    
//     for (int i = 0; i < n1; i++)
//     {
//         L[i] = vec[left + i];
//         std::cout << "vec[left + i]: "  <<  vec[left + i]   << " ";
//     }

//     for (int j = 0; j < n2; j++)
//     {
//         R[j] = vec[mid + 1 + j];
//         std::cout << "vec[mid + 1 + j]: "  <<  vec[mid + 1 + j]   << " ";
//     }
//     std::cout << std::endl;
    
//     int i = 0, j = 0, k = left;

//     while (i < n1 && j < n2) 
//     {
//         if (L[i] <= R[j]) 
//         {
//             vec[k] = L[i];
//             i++;
//         } 
//         else 
//         {
//             vec[k] = R[j];
//             j++;
//         }
//         k++;
//     }
    
//     while (i < n1) 
//     {
//         vec[k] = L[i];
//         i++;
//         k++;
//     }
    
//     while (j < n2) 
//     {
//         vec[k] = R[j];
//         j++;
//         k++;
//     }
//     printVector(vec);
//     std::cout << std::endl;
//     std::cout << std::endl;
// }

// template<typename T>
// // Hàm thực hiện sắp xếp Merge Sort không đệ quy
// void mergeSortIterative(std::vector<T>& vec) 
// {
//     int n = vec.size();
//     for (int size = 1; size < n; size *= 2) 
//     {
//         for (int left = 0; left < n - 1; left += 2 * size) 
//         {
//             int mid   = std::min(left + size - 1, n - 1);
//             int right = std::min(left + 2 * size - 1, n - 1);
//             std::cout << "left:"  << left   << " ";
//             std::cout << "mid:"   << mid   << " ";
//             std::cout << "right:" << right << " ";
//             std::cout << std::endl;
            
//             merge(vec, left, mid, right);
//         }
//     }
// }

int main(void)
{
    /* Mảng kiểu float */
    float floatArr[] = {74.5, 74.5, 35.3, 35.3, 22.7, 32.1, 21.9, 21.9};
    int size = sizeof(floatArr) / sizeof(floatArr[0]);
    /* Vector kiểu float */
    std::vector<float> floatVec = {64.5, 64.5, 25.3, 22.1, 12.7, 11.9, 11.9};

    // Ghi nhận thời điểm bắt đầu
    auto start = std::chrono::high_resolution_clock::now();    

    /* Selection_Sort */
    Selection_Sort<float> SSortVec(floatVec,MIN_TO_MAX);
    Selection_Sort<float> SSortArr(floatArr,size,MIN_TO_MAX);

    /* Bubble_Sort */
    Bubble_Sort<float> BSortVec(floatVec,MIN_TO_MAX);
    Bubble_Sort<float> BSortArr(floatArr,size,MIN_TO_MAX);

    /* Insertion_Sort */
    Insertion_Sort<float> ISortVec(floatVec,MAX_TO_MIN);
    Insertion_Sort<float> ISortArr(floatArr,size,MAX_TO_MIN);

    /* Merge_Sort */
    // mergeSortIterative(floatVec);
    // printVector(floatVec);

    // Ghi nhận thời điểm kết thúc
    auto end = std::chrono::high_resolution_clock::now();
    // Tính toán thời gian trôi qua
    std::chrono::duration<double, std::milli> elapsed = end - start;
    std::cout << "Time processing: " << elapsed.count() << "milliseconds" << std::endl;

    return 0;
}