#ifndef _C_PLUS_CPLUS_DATA_STRUCTURE_ALGORIHMTS_
#define _C_PLUS_CPLUS_DATA_STRUCTURE_ALGORIHMTS_
#include <iostream>
#include <vector>
#include <algorithm> // std::swap
#include <chrono> //thư viện đo thời gian thực hiện các tác vụ.


#define MIN_TO_MAX 0
#define MAX_TO_MIN 1

/*****************************************************************************   BASIC CLASS   ****************************************************************************************/
/*********************************************** Basic Class chứa các phần tử cơ bản nhất để có thể xử lí trong quá trình sắp xếp  ****************************************************/
template <class  T>
class Basic_Sort
{
    public:
        Basic_Sort(T A[], int size, bool direct_sort) ;
        Basic_Sort(std::vector<T>& A, bool direct_sort) ;
        ~Basic_Sort();
        void printArray(const T arr[], int size) ;
        void printVector(const std::vector<T>& vec) ;
    protected:
        std::vector<T> dump;
        T* reference_array=nullptr;
        std::vector<T>& reference_vector;
        unsigned char check_type_sort = 0;
        unsigned int size_list = 0;
        bool direct_sort = 0;
};

template <class T>
Basic_Sort<T>::Basic_Sort (T A[], int size, bool direct_sort) :  reference_array(A), check_type_sort(1), size_list(size), direct_sort(direct_sort), reference_vector(dump)
{
    // sort();
}

template <class T>
Basic_Sort<T>::Basic_Sort (std::vector<T>& A, bool direct_sort) : reference_vector(A), check_type_sort(2), size_list(A.size()), direct_sort(direct_sort)
{
    // sort();
}

template <class T>
Basic_Sort<T>::~Basic_Sort ()
{
    // Nothing
}

template <class T>
void Basic_Sort<T>::printArray (const T arr[], int size)
{
    std::cout << "This Basic Sort, function printArray !" << std::endl;
}

template <class T>
void Basic_Sort<T>::printVector (const std::vector<T>& vec)
{
    std::cout << "This Basic Sort,function printVector !" << std::endl;
}

/*****************************************************************************   SELECTION SORT   ****************************************************************************************/
/************************************** Selection Sort so sánh từng phần tử liên tục, phù hợp với các danh sách dữ liệu trung bình và ngắn sẽ rất nhanh  *********************************/
template <class  T>
class Selection_Sort: public Basic_Sort<T>
{
public:
    Selection_Sort (T A[], int size, bool direct_sort);
    Selection_Sort (std::vector<T>& A, bool direct_sort);
    ~Selection_Sort();
    void sort();
    void printArray(const T arr[], int size) ;
    void printVector(const std::vector<T>& vec) ;
};

template <class T>
Selection_Sort<T>::Selection_Sort (T A[], int size, bool direct_sort) :  Basic_Sort<T>(A,size,direct_sort) /*reference_array(A), check_type_sort(1), size_list(size), direct_sort(direct_sort), reference_vector(dump)*/
{
    this->sort();
}

template <class T>
Selection_Sort<T>::Selection_Sort (std::vector<T>& A, bool direct_sort) : Basic_Sort<T>(A,direct_sort) /*reference_vector(A), check_type_sort(2), size_list(A.size()), direct_sort(direct_sort)*/
{
    this->sort();
}

template <class T>
Selection_Sort<T>::~Selection_Sort ()
{
    if(Basic_Sort<T>::check_type_sort == 1)
    {
        std::cout << "The end Selection Sort Array !" << std::endl;
    }
    else if (Basic_Sort<T>::check_type_sort == 2)
    {
        std::cout << "The end Selection Sort Vector !" << std::endl;
    }
    Basic_Sort<T>::check_type_sort = 0;
}

template <class T>
void Selection_Sort<T>::sort()
{
    int i,j,index = 0;
    if(Basic_Sort<T>::check_type_sort == 1)
    {
        T temp;
        for( i=0; i<Basic_Sort<T>::size_list-1 ; ++i)
        {
            index = i;

            for( j = i+1 ; j<Basic_Sort<T>::size_list ; ++j)
            {
                if(Basic_Sort<T>::direct_sort == 0)
                {
                    if (Basic_Sort<T>::reference_array[j] < Basic_Sort<T>::reference_array[index])
                        index = j;
                }
                else if (Basic_Sort<T>::direct_sort == 1)
                {
                    if (Basic_Sort<T>::reference_array[j] > Basic_Sort<T>::reference_array[index])
                        index = j;                
                }
            } 

            if (index != i)
            {
                temp = Basic_Sort<T>::reference_array[i];
                Basic_Sort<T>::reference_array[i] = Basic_Sort<T>::reference_array[index];
                Basic_Sort<T>::reference_array[index] = temp;
            }
        }
        printArray(Basic_Sort<T>::reference_array, Basic_Sort<T>::size_list);
    }
    else if (Basic_Sort<T>::check_type_sort == 2)
    {
        for( i=0; i<Basic_Sort<T>::size_list-1 ; ++i)
        {
            index = i;

            for( j = i+1 ; j<Basic_Sort<T>::size_list ; ++j)
            {
                if(Basic_Sort<T>::direct_sort == 0)
                {
                    if (Basic_Sort<T>::reference_vector[j] < Basic_Sort<T>::reference_vector[index])
                        index = j;
                }
                else if (Basic_Sort<T>::direct_sort == 1)
                {
                    if (Basic_Sort<T>::reference_vector[j] > Basic_Sort<T>::reference_vector[index])
                        index = j;                
                }
                else
                {

                }
            } 

            if (index != i)
            {
                std::swap(Basic_Sort<T>::reference_vector[i] , Basic_Sort<T>::reference_vector[index]);
            }
        }       
        printVector(Basic_Sort<T>::reference_vector);
    }
}

template <class T>
void Selection_Sort<T>::printArray(const T arr[], int size)
{
    std::cout << "Selection Sort Array:";
    std::cout << std::endl;

    for (int i = 0; i < size; i++) 
    {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

template <class T>
void Selection_Sort<T>::printVector(const std::vector<T>& vec) 
{
    std::cout << "Selection Sort Vector:";
    std::cout << std::endl;

    for (const auto& element : vec) 
    {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}

/*****************************************************************************   BUBBLE SORT   ****************************************************************************************/
/************************************** Bubble Sort so sánh hai phần tử liền đề liên tục, phù hợp với các danh sách dữ liệu ngắn sẽ rất nhanh  ****************************************/
template <class  T>
class Bubble_Sort: public Basic_Sort<T>
{
public:
    Bubble_Sort (T A[], int size, bool direct_sort);
    Bubble_Sort (std::vector<T>& A, bool direct_sort);
    ~Bubble_Sort();
    void sort();
    void printArray(const T arr[], int size) ;
    void printVector(const std::vector<T>& vec) ;
};

template <class T>
Bubble_Sort<T>::Bubble_Sort (T A[], int size, bool direct_sort): Basic_Sort<T>(A,size,direct_sort) /*reference_array(A), check_type_sort(1), size_list(size), direct_sort(direct_sort), reference_vector(dump)*/
{
    this->sort();
}

template <class T>
Bubble_Sort<T>::Bubble_Sort (std::vector<T>& A, bool direct_sort): Basic_Sort<T>(A,direct_sort) /*reference_vector(A), check_type_sort(2), size_list(A.size()), direct_sort(direct_sort)*/
{
    this->sort();
}

template <class T>
Bubble_Sort<T>::~Bubble_Sort ()
{
    if(Basic_Sort<T>::check_type_sort == 1)
    {
        std::cout << "The end Bubble Sort Array !" << std::endl;
    }
    else if (Basic_Sort<T>::check_type_sort == 2)
    {
        std::cout << "The end Bubble Sort Vector !" << std::endl;
    }
    Basic_Sort<T>::check_type_sort = 0;
}

template <class T>
void Bubble_Sort<T>::sort (void)
{
    if(Basic_Sort<T>::check_type_sort == 1)
    {
        bool swapped = false;
        T temp;
        // Lặp qua tất cả các phần tử trong mảng
        for (int i = 0; i < Basic_Sort<T>::size_list - 1; i++) 
        {
            swapped = false;
            // So sánh các phần tử liên tiếp và hoán đổi nếu cần
            for (int j = 0; j < Basic_Sort<T>::size_list - i - 1; j++) 
            {
                if(Basic_Sort<T>::direct_sort == 0)
                {
                    if (Basic_Sort<T>::reference_array[j] > Basic_Sort<T>::reference_array[j + 1]) 
                    {
                        // Hoán đổi các phần tử
                        temp = Basic_Sort<T>::reference_array[j];
                        Basic_Sort<T>::reference_array[j] = Basic_Sort<T>::reference_array[j + 1];
                        Basic_Sort<T>::reference_array[j + 1] = temp;
                        swapped = true;
                    }
                }
                else if(Basic_Sort<T>::direct_sort == 1)
                {
                    if (Basic_Sort<T>::reference_array[j] < Basic_Sort<T>::reference_array[j + 1]) 
                    {
                        // Hoán đổi các phần tử
                        temp = Basic_Sort<T>::reference_array[j];
                        Basic_Sort<T>::reference_array[j] = Basic_Sort<T>::reference_array[j + 1];
                        Basic_Sort<T>::reference_array[j + 1] = temp;
                        swapped = true;
                    }                
                }
            }
            // Nếu không có phần tử nào bị hoán đổi trong lần lặp này, mảng đã được sắp xếp
            if (!swapped) 
            {
                break;
            }
        }
        this->printArray(Basic_Sort<T>::reference_array, Basic_Sort<T>::size_list);
    }
    else if(Basic_Sort<T>::check_type_sort == 2)
    {
        bool swapped = false;
        // Lặp qua tất cả các phần tử trong mảng
        for (int i = 0; i < Basic_Sort<T>::size_list - 1; i++) 
        {
            swapped = false;
            // So sánh các phần tử liên tiếp và hoán đổi nếu cần
            for (int j = 0; j < Basic_Sort<T>::size_list - i - 1; j++) 
            {
                if(Basic_Sort<T>::direct_sort == 0)
                {
                    if (Basic_Sort<T>::reference_vector[j] > Basic_Sort<T>::reference_vector[j + 1]) 
                    {
                        // Hoán đổi các phần tử vector
                        std::swap(Basic_Sort<T>::reference_vector[j], Basic_Sort<T>::reference_vector[j + 1]);
                        swapped = true;
                    }
                }
                else if(Basic_Sort<T>::direct_sort == 1)
                {
                    if (Basic_Sort<T>::reference_vector[j] < Basic_Sort<T>::reference_vector[j + 1]) 
                    {
                        // Hoán đổi các phần tử vector
                        std::swap(Basic_Sort<T>::reference_vector[j], Basic_Sort<T>::reference_vector[j + 1]);
                        swapped = true;
                    }                
                }
                else
                {

                }
            }
            // Nếu không có phần tử nào bị hoán đổi trong lần lặp này, mảng đã được sắp xếp
            if (!swapped) 
            {
                break;
            }
        }
        this->printVector(Basic_Sort<T>::reference_vector);        
    }
}

template <class T>
void Bubble_Sort<T>::printArray(const T arr[], int size)
{
    std::cout << "Bubble Sort Array:";
    std::cout << std::endl;

    for (int i = 0; i < size; i++) 
    {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

template <class T>
void Bubble_Sort<T>::printVector(const std::vector<T>& vec) 
{
    std::cout << "Bubble Sort Vector:";
    std::cout << std::endl;

    for (const auto& element : vec) 
    {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}

/*****************************************************************************   INSERTION SORT   *******************************************************************************************/
/************************************** Insertion Sort so sánh hai phần tử liền đề liên tục, phù hợp với các danh sách dữ liệu ngắn sẽ rất nhanh  *******************************************/
template <class  T>
class Insertion_Sort: public Basic_Sort<T>
{
public:
    Insertion_Sort (T A[], int size, bool direct_sort);
    Insertion_Sort (std::vector<T>& A, bool direct_sort);
    ~Insertion_Sort();
    void sort();
    void printArray(const T arr[], int size) ;
    void printVector(const std::vector<T>& vec) ;
};

template <class T>
Insertion_Sort<T>::Insertion_Sort (T A[], int size, bool direct_sort): Basic_Sort<T>(A,size,direct_sort) /*reference_array(A), check_type_sort(1), size_list(size), direct_sort(direct_sort), reference_vector(dump)*/
{
    this->sort();
}

template <class T>
Insertion_Sort<T>::Insertion_Sort (std::vector<T>& A, bool direct_sort): Basic_Sort<T>(A,direct_sort) /*reference_vector(A), check_type_sort(2), size_list(A.size()), direct_sort(direct_sort)*/
{
    this->sort();
}

template <class T>
Insertion_Sort<T>::~Insertion_Sort ()
{
    if(Basic_Sort<T>::check_type_sort == 1)
    {
        std::cout << "The end Insertion Sort Array !" << std::endl;
    }
    else if (Basic_Sort<T>::check_type_sort == 2)
    {
        std::cout << "The end Insertion Sort Vector !" << std::endl;
    }
    Basic_Sort<T>::check_type_sort = 0;
}

template <class T>
void Insertion_Sort<T>::sort (void)
{
    if(Basic_Sort<T>::check_type_sort == 1)
    {    
        for (int i = 1; i < Basic_Sort<T>::size_list; i++) 
        {
            T key = Basic_Sort<T>::reference_array[i]; // Phần tử hiện tại cần chèn vào vị trí đúng
            int j = i - 1;

            if(Basic_Sort<T>::direct_sort == 0)
            {
                // Di chuyển các phần tử của reference_vector[0..i-1], mà lớn hơn key, lên một vị trí phía trước
                while (j >= 0 && Basic_Sort<T>::reference_array[j] > key) 
                {
                    Basic_Sort<T>::reference_array[j + 1] = Basic_Sort<T>::reference_array[j];
                    j--;
                }
                Basic_Sort<T>::reference_array[j + 1] = key; // Chèn key vào vị trí đúng
            }
            else if(Basic_Sort<T>::direct_sort == 1)
            {
                // Di chuyển các phần tử của reference_vector[0..i-1], mà lớn hơn key, lên một vị trí phía trước
                while (j >= 0 && Basic_Sort<T>::reference_array[j] < key) 
                {
                    Basic_Sort<T>::reference_array[j + 1] = Basic_Sort<T>::reference_array[j];
                    j--;
                }
                Basic_Sort<T>::reference_array[j + 1] = key; // Chèn key vào vị trí đúng
            }
            else
            {
                // Nothing
            }
        }
        this->printArray(Basic_Sort<T>::reference_array, Basic_Sort<T>::size_list);
    }
    else if(Basic_Sort<T>::check_type_sort == 2)
    {
        for (int i = 1; i < Basic_Sort<T>::size_list; i++) 
        {
            T key = Basic_Sort<T>::reference_vector[i]; // Phần tử hiện tại cần chèn vào vị trí đúng
            int j = i - 1;

            if(Basic_Sort<T>::direct_sort == 0)
            {
                // Di chuyển các phần tử của reference_vector[0..i-1], mà lớn hơn key, lên một vị trí phía trước
                while (j >= 0 && Basic_Sort<T>::reference_vector[j] > key) 
                {
                    // Hoán đổi các phần tử vector
                    std::swap(Basic_Sort<T>::reference_vector[j+1], Basic_Sort<T>::reference_vector[j]);
                    j--;
                }
                Basic_Sort<T>::reference_vector[j + 1] = key; // Chèn key vào vị trí đúng
            }
            else if(Basic_Sort<T>::direct_sort == 1)
            {
                // Di chuyển các phần tử của reference_vector[0..i-1], mà lớn hơn key, lên một vị trí phía trước
                while (j >= 0 && Basic_Sort<T>::reference_vector[j] < key) 
                {
                    // Hoán đổi các phần tử vector
                    std::swap(Basic_Sort<T>::reference_vector[j+1], Basic_Sort<T>::reference_vector[j]);
                    j--;
                }
                Basic_Sort<T>::reference_vector[j + 1] = key; // Chèn key vào vị trí đúng
            }
            else
            {
                // Nothing
            }

        }
        this->printVector(Basic_Sort<T>::reference_vector);      
    }
}

template <class T>
void Insertion_Sort<T>::printArray(const T arr[], int size)
{
    std::cout << "Insertion Sort Array:";
    std::cout << std::endl;

    for (int i = 0; i < size; i++) 
    {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

template <class T>
void Insertion_Sort<T>::printVector(const std::vector<T>& vec) 
{
    std::cout << "Insertion Sort Vector:";
    std::cout << std::endl;

    for (const auto& element : vec) 
    {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}














#endif