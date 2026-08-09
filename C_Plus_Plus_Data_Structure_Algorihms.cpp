#include "C_Plus_Plus_Data_Structure_Algorihms.h"
#include "C_Plus_Plus_Random_Data_Algorihms.h"

#define SIZE 100000

// Hàm in đường kẻ tiêu đề cho từng thuật toán
static void printHeader(const std::string& name)
{
    std::string line(70, '-');
    std::cout << "\n" << line << "\n";
    std::cout << "  Sorting Algorithm : " << name << "\n";
    std::cout << line << "\n";
}

// Hàm in kết quả thời gian
static void printTime(double ms)
{
    std::cout << "  [Vector] + [Array] Time : " << ms << " ms\n";
}

// Hàm chạy một thuật toán sắp xếp và đo thời gian
// Nhận dữ liệu ban đầu (chưa sắp xếp) và tạo bản sao riêng trước khi sort
// để đảm bảo mỗi thuật toán đều chạy trên dữ liệu gốc (benchmark công bằng)
template <template <typename> class SortAlgo>
static void runBenchmark(const std::string&        name,
                         const std::vector<float>& originalVec,
                         const float*              originalArr,
                         SortDirection             dir)
{
    printHeader(name);

    // Tạo bản sao để không ảnh hưởng đến dữ liệu gốc
    std::vector<float> vecCopy = originalVec;
    float* arrCopy = new float[SIZE];
    std::copy(originalArr, originalArr + SIZE, arrCopy);

    auto start = std::chrono::high_resolution_clock::now();

    SortAlgo<float> sortVec(vecCopy, dir);
    sortVec.sort();

    SortAlgo<float> sortArr(arrCopy, SIZE, dir);
    sortArr.sort();

    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> elapsed = end - start;

    printTime(elapsed.count());

    delete[] arrCopy;
}

// Hàm hiển thị menu chính
static void printMenu()
{
    std::cout << "\n";
    std::cout << "╔══════════════════════════════════════════╗\n";
    std::cout << "║       C++ Sorting Algorithm Tester       ║\n";
    std::cout << "║          Data size: " << SIZE << " elements        ║\n";
    std::cout << "╠══════════════════════════════════════════╣\n";
    std::cout << "║  [1]  Selection Sort                     ║\n";
    std::cout << "║  [2]  Bubble Sort                        ║\n";
    std::cout << "║  [3]  Insertion Sort                     ║\n";
    std::cout << "║  [4]  Merge Sort                         ║\n";
    std::cout << "║  [5]  Quick Sort                         ║\n";
    std::cout << "║  [6]  Run ALL algorithms (benchmark)     ║\n";
    std::cout << "║  [0]  Exit                               ║\n";
    std::cout << "╚══════════════════════════════════════════╝\n";
    std::cout << "  Chọn thuật toán [0-6]: ";
}

// Hàm hỏi hướng sắp xếp
static SortDirection askDirection()
{
    std::cout << "  Hướng sắp xếp - [1] Ascending  [2] Descending: ";
    int d = 1;
    std::cin >> d;
    return (d == 2) ? SortDirection::Descending : SortDirection::Ascending;
}

int main(void)
{
    // Sinh dữ liệu ngẫu nhiên một lần duy nhất (dữ liệu gốc không bị thay đổi)
    RandomGenerator<float> rng;
    const std::vector<float> originalVec = rng.generateRandomVector(SIZE, 1.0f, 100.0f);
    float* originalArr = rng.generateRandomArray(SIZE, 1.0f, 100.0f);

    std::cout << "Đã tạo " << SIZE << " phần tử ngẫu nhiên (float, range [1, 100]).\n";

    int choice = -1;

    while (choice != 0)
    {
        printMenu();
        std::cin >> choice;

        if (choice == 0) break;

        // Hỏi hướng sắp xếp (trừ khi Exit)
        SortDirection dir = SortDirection::Ascending;
        if (choice >= 1 && choice <= 6)
            dir = askDirection();

        switch (choice)
        {
            case 1:
                runBenchmark<SelectionSort>("Selection Sort", originalVec, originalArr, dir);
                break;

            case 2:
                runBenchmark<BubbleSort>("Bubble Sort", originalVec, originalArr, dir);
                break;

            case 3:
                runBenchmark<InsertionSort>("Insertion Sort", originalVec, originalArr, dir);
                break;

            case 4:
                runBenchmark<MergeSort>("Merge Sort", originalVec, originalArr, dir);
                break;

            case 5:
                runBenchmark<QuickSort>("Quick Sort", originalVec, originalArr, dir);
                break;

            case 6:
                // Chạy tất cả – mỗi thuật toán dùng bản sao riêng của dữ liệu gốc
                runBenchmark<SelectionSort> ("Selection Sort",  originalVec, originalArr, dir);
                runBenchmark<BubbleSort>    ("Bubble Sort",     originalVec, originalArr, dir);
                runBenchmark<InsertionSort> ("Insertion Sort",  originalVec, originalArr, dir);
                runBenchmark<MergeSort>     ("Merge Sort",      originalVec, originalArr, dir);
                runBenchmark<QuickSort>     ("Quick Sort",      originalVec, originalArr, dir);
                break;

            default:
                std::cout << "  [!] Lựa chọn không hợp lệ. Vui lòng nhập 0-6.\n";
                break;
        }
    }

    // Giải phóng bộ nhớ mảng động
    delete[] originalArr;

    std::cout << "\nThoát chương trình. Goodbye!\n";
    return 0;
}