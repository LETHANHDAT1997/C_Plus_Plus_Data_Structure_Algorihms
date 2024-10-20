#include "C_Plus_Plus_Data_Structure_Algorihms.h"

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
    Merge_Sort<float> MerSortVec(floatVec,MIN_TO_MAX);
    Merge_Sort<float> MerSortArr(floatArr,size,MIN_TO_MAX);

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