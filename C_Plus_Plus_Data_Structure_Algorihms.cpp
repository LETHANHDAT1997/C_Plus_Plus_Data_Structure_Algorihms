#include "C_Plus_Plus_Data_Structure_Algorihms.h"
#include "C_Plus_Plus_Random_Data_Algorihms.h"

#define SIZE 100

int main(void)
{
    // Sử dụng RandomGenerator với vector float 
    RandomGenerator<float> RandomVector;
    std::vector<float> floatVec = RandomVector.generateRandomVector(SIZE, 1, 100);
    std::cout << "Random Vector (int): ";
    for (float num : floatVec) 
    {
        std::cout << num << " ";
    }
    std::cout << "\n";

    // Sử dụng RandomGenerator với array int
    RandomGenerator<float> RandomArray;
    float* floatArr = RandomArray.generateRandomArray(SIZE, 1, 100);
    std::cout << "Random Array (float): ";
    for (size_t i = 0; i < SIZE; ++i) 
    {
        std::cout << floatArr[i] << " ";
    }
    std::cout << "\n";
    std::cout << "" << std::endl;

    // Ghi nhận thời điểm bắt đầu
    auto start = std::chrono::high_resolution_clock::now();    

    /* Selection_Sort */
    std::cout << "-------------------------------------------------------------Selection_Sort-------------------------------------------------------------" << std::endl;
    SelectionSort<float> SelectionVector(floatVec, SortDirection::Ascending);
    SelectionVector.sort();
    SelectionVector.print();
    SelectionSort<float> SelectionArray(floatArr,SIZE, SortDirection::Ascending);
    SelectionArray.sort();
    SelectionArray.print();
    std::cout << "" << std::endl;
    
    /* Bubble_Sort */
    std::cout << "-------------------------------------------------------------Bubble_Sort-------------------------------------------------------------" << std::endl;
    BubbleSort<float> BubbleSortVector(floatVec, SortDirection::Ascending);
    BubbleSortVector.sort();
    BubbleSortVector.print();
    BubbleSort<float> BubbleSortArray(floatArr,SIZE, SortDirection::Ascending);
    BubbleSortArray.sort();
    BubbleSortArray.print();
    std::cout << "" << std::endl;

    /* Insertion_Sort */
    std::cout << "-------------------------------------------------------------Insertion_Sort-------------------------------------------------------------" << std::endl;
    InsertionSort<float> InsertionSortVector(floatVec, SortDirection::Ascending);
    InsertionSortVector.sort();
    InsertionSortVector.print();
    InsertionSort<float> BInsertionSortArray(floatArr,SIZE, SortDirection::Ascending);
    BInsertionSortArray.sort();
    BInsertionSortArray.print();
    std::cout << "" << std::endl;

    /* Merge_Sort */
    std::cout << "-------------------------------------------------------------Merge_Sort-------------------------------------------------------------" << std::endl;
    MergeSort<float> MergeSortVector(floatVec, SortDirection::Ascending);
    MergeSortVector.sort();
    MergeSortVector.print();
    MergeSort<float> MergeSortArray(floatArr,SIZE, SortDirection::Ascending);
    MergeSortArray.sort();
    MergeSortArray.print();
    std::cout << "" << std::endl;
 

    // Ghi nhận thời điểm kết thúc
    auto end = std::chrono::high_resolution_clock::now();
    // Tính toán thời gian trôi qua
    std::chrono::duration<double, std::milli> elapsed = end - start;
    std::cout << "Time processing: " << elapsed.count() << "milliseconds" << std::endl;

    return 0;
}