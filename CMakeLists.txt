# Đặt phiên bản tối thiểu của CMake yêu cầu
cmake_minimum_required(VERSION 3.16)

# Đặt tên cho project
project(MyCppProject)

# Đặt tiêu chuẩn C++
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Nếu bạn muốn đảm bảo rằng cờ "-g" luôn được thêm vào bất kể CMake sử dụng trình biên dịch nào, bạn có thể dùng lệnh này. 
# Tuy nhiên, đây không phải là yêu cầu bắt buộc khi bạn đã thiết lập CMAKE_BUILD_TYPE thành Debug
set(CMAKE_C_FLAGS_DEBUG "${CMAKE_C_FLAGS_DEBUG} -g")

# Phải có dòng này mới debug GDB bằng lệnh layout src được
set(CMAKE_BUILD_TYPE Debug)

# Xác định sanh sách các tệp nguồn được được thêm vào dự án
set(SOURCES C_Plus_Plus_Data_Structure_Algorihms.cpp)

# Thêm tệp nguồn vào project
add_executable(MyCppProject ${SOURCES})

# (Tùy chọn) Thêm các thư viện ngoài nếu có
# target_link_libraries(MyCppProject PRIVATE some_library)

# (Tùy chọn) Thêm các tùy chọn biên dịch đặc biệt
# target_compile_options(MyCppProject PRIVATE -Wall -Wextra -O2)

# set(CMAKE_C_FLAGS "-m32")  # Sử dụng cho kiến trúc 32-bit
# hoặc
# set(CMAKE_CXX_FLAGS "-m32")  # Sử dụng cho kiến trúc 32-bit

# Hoặc sử dụng cho kiến trúc 64-bit
# set(CMAKE_C_FLAGS "-m64")
# hoặc
# set(CMAKE_CXX_FLAGS "-m64")

# set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -maccumulate-outgoing-args")
# hoặc
# set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -maccumulate-outgoing-args")

# if(CMAKE_SIZEOF_VOID_P EQUAL 8)
#     set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -m64")
#     # hoặc
#     set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -m64")
# else()
#     set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -m32")
#     # hoặc
#     set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -m32")
# endif()

# Note: lệnh terminal để chạy chương trình
#   cmake -S . -B ./build -G "MinGW Makefiles"
#   mingw32-make -C build
#   gdb ./build/MyCppProject (lệnh để debug)

# Lưu ý: Debug cho vector sẽ sử dụng dạng lệnh sau đây
# output/print *(your_vector._M_impl._M_start)@your_vector_size
# VD: print *(numbers._M_impl._M_start)     // in phần tử đầu tiên của vector
#     print *(numbers._M_impl._M_start)@2   // in hai phần tử đầu tiên của vector
#     print *(numbers._M_impl._M_start+2)   // in phần tử thứ 2 của vector
