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
    /* Do Nothing */
}

template <class T>
void Basic_Sort<T>::printArray (const T arr[], int size)
{
    // std::cout << "This Basic Sort, function printArray !" << std::endl;
    /* Do Nothing */
}

template <class T>
void Basic_Sort<T>::printVector (const std::vector<T>& vec)
{
    // std::cout << "This Basic Sort,function printVector !" << std::endl;
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
                /* Do Nothing */
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


/*******************************************************************************************************   MERGE SORT   *******************************************************************************************************************/
/************************************** Merge Sort hoạt động bằng cách chia mảng thành các mảng nhỏ hơn và sắp xếp các mảng đó sau đó hợp nhất chúng lại với nhau để thu được mảng đã sắp xếp.  *******************************************/
template <class  T>
class Merge_Sort: public Basic_Sort<T>
{
public:
    Merge_Sort (T A[], int size, bool direct_sort);
    Merge_Sort (std::vector<T>& A, bool direct_sort);
    ~Merge_Sort();
    void divide(T vec[],unsigned int size);
    void divide(std::vector<T>& vec);
    void sortafterdivision(T vec[], int left, int mid, int right);
    void sortafterdivision(std::vector<T>& vec, int left, int mid, int right);
    void sort();
    void printArray(const T arr[], int size) ;
    void printVector(const std::vector<T>& vec) ;
};

template <class T>
Merge_Sort<T>::Merge_Sort (T A[], int size, bool direct_sort): Basic_Sort<T>(A,size,direct_sort) /*reference_array(A), check_type_sort(1), size_list(size), direct_sort(direct_sort), reference_vector(dump)*/
{
    this->sort();
}

template <class T>
Merge_Sort<T>::Merge_Sort (std::vector<T>& A, bool direct_sort): Basic_Sort<T>(A,direct_sort) /*reference_vector(A), check_type_sort(2), size_list(A.size()), direct_sort(direct_sort)*/
{
    this->sort();
}

template <class T>
Merge_Sort<T>::~Merge_Sort ()
{
    if(Basic_Sort<T>::check_type_sort == 1)
    {
        std::cout << "The end Merge Sort Array !" << std::endl;
    }
    else if (Basic_Sort<T>::check_type_sort == 2)
    {
        std::cout << "The end Merge Sort Vector !" << std::endl;
    }
    Basic_Sort<T>::check_type_sort = 0;
}

template <class T>
void Merge_Sort<T>::sort (void)
{
    if(Basic_Sort<T>::check_type_sort == 1)
    {    
        int n = Basic_Sort<T>::size_list;
        for (int size = 1; size < n; size *= 2) 
        {
            for (int left = 0; left < n - 1; left += 2 * size) 
            {
                int mid   = std::min(left + size - 1, n - 1);
                int right = std::min(left + 2 * size - 1, n - 1);
                // std::cout << "left:"  << left   << " ";
                // std::cout << "mid:"   << mid   << " ";
                // std::cout << "right:" << right << " ";
                // std::cout << std::endl;
                
                sortafterdivision(Basic_Sort<T>::reference_array, left, mid, right);
            }
        }
        this->printArray(Basic_Sort<T>::reference_array, Basic_Sort<T>::size_list);
    }
    else if(Basic_Sort<T>::check_type_sort == 2)
    {
        int n = Basic_Sort<T>::reference_vector.size();
        for (int size = 1; size < n; size *= 2) 
        {
            for (int left = 0; left < n - 1; left += 2 * size) 
            {
                int mid   = std::min(left + size - 1, n - 1);
                int right = std::min(left + 2 * size - 1, n - 1);
                // std::cout << "left:"  << left   << " ";
                // std::cout << "mid:"   << mid   << " ";
                // std::cout << "right:" << right << " ";
                // std::cout << std::endl;
                
                sortafterdivision(Basic_Sort<T>::reference_vector, left, mid, right);
            }
        }
        this->printVector(Basic_Sort<T>::reference_vector);      
    }
}

template <class T>
void Merge_Sort<T>:: sortafterdivision(T array[], int left, int mid, int right)
{
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // std::cout << "n1:"  << n1   << " ";
    // std::cout << "n2:"   << n2   << " ";
    // std::cout << std::endl;

    T L[n1] = {0};
    T R[n2] = {0};
    
    for (int i = 0; i < n1; i++)
    {
        L[i] = array[left + i];
        // std::cout << "array[left + i]: "  <<  array[left + i]   << " ";
    }

    for (int j = 0; j < n2; j++)
    {
        R[j] = array[mid + 1 + j];
        // std::cout << "array[mid + 1 + j]: "  <<  array[mid + 1 + j]   << " ";
    }
    // std::cout << std::endl;
    
    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) 
    {
        if(Basic_Sort<T>::direct_sort == 0)
        {
            if (L[i] <= R[j]) 
            {
                array[k] = L[i];
                i++;
            } 
            else 
            {
                array[k] = R[j];
                j++;
            }
            k++;
        }
        else if (Basic_Sort<T>::direct_sort == 1)
        {
            if (L[i] >= R[j]) 
            {
                array[k] = L[i];
                i++;
            } 
            else 
            {
                array[k] = R[j];
                j++;
            }
            k++;            
        }
    }
    
    while (i < n1) 
    {
        array[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) 
    {
        array[k] = R[j];
        j++;
        k++;
    }  
}

template <class T>
void Merge_Sort<T>:: sortafterdivision(std::vector<T>& vec, int left, int mid, int right)
{
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // std::cout << "n1:"  << n1   << " ";
    // std::cout << "n2:"   << n2   << " ";
    // std::cout << std::endl;

    T L[n1] = {0};
    T R[n2] = {0};
    
    for (int i = 0; i < n1; i++)
    {
        L[i] = vec[left + i];
        // std::cout << "vec[left + i]: "  <<  vec[left + i]   << " ";
    }

    for (int j = 0; j < n2; j++)
    {
        R[j] = vec[mid + 1 + j];
        // std::cout << "vec[mid + 1 + j]: "  <<  vec[mid + 1 + j]   << " ";
    }
    // std::cout << std::endl;
    
    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) 
    {
        if(Basic_Sort<T>::direct_sort == 0)
        {
            if (L[i] <= R[j]) 
            {
                vec[k] = L[i];
                i++;
            } 
            else 
            {
                vec[k] = R[j];
                j++;
            }
            k++;
        }
        else if (Basic_Sort<T>::direct_sort == 1)
        {
            if (L[i] >= R[j]) 
            {
                vec[k] = L[i];
                i++;
            } 
            else 
            {
                vec[k] = R[j];
                j++;
            }
            k++;            
        }
    }
    
    while (i < n1) 
    {
        vec[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) 
    {
        vec[k] = R[j];
        j++;
        k++;
    }  
}

template <class T>
void Merge_Sort<T>::printArray(const T arr[], int size)
{
    std::cout << "Merge Sort Array:";
    std::cout << std::endl;

    for (int i = 0; i < size; i++) 
    {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
}

template <class T>
void Merge_Sort<T>::printVector(const std::vector<T>& vec) 
{
    std::cout << "Merge Sort Vector:";
    std::cout << std::endl;

    for (const auto& element : vec) 
    {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}




#endif