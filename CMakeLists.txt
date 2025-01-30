# Đặt phiên bản tối thiểu của CMake yêu cầu
cmake_minimum_required(VERSION 3.16)

# Đặt tên cho project
project(C_Plus_Plus_Data_Structure_Algorihms)

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
add_executable(C_Plus_Plus_Data_Structure_Algorihms ${SOURCES})

# Thu thập tất cả các tệp .cpp trong thư mục
file(GLOB_RECURSE SOURCE_FILES "${CMAKE_SOURCE_DIR}/*.cpp")

# Lặp lại qua từng tệp .cpp để tạo tệp .ii tương ứng
foreach(SOURCE_FILE ${SOURCE_FILES})
    # Lấy tên tệp không có phần mở rộng (ví dụ: main hoặc foo)
    get_filename_component(FILENAME_WE ${SOURCE_FILE} NAME_WE)
    
    # Gọi add_custom_command cho từng tệp nguồn, add_custom_command sẽ add các lệnh custom để xử lí cho từng tệp tương ứng
    add_custom_command(
        OUTPUT ${CMAKE_BINARY_DIR}/${FILENAME_WE}.ii
        COMMAND ${CMAKE_CXX_COMPILER} -E ${SOURCE_FILE} -o ${CMAKE_BINARY_DIR}/${FILENAME_WE}.ii
        DEPENDS ${SOURCE_FILE}
        COMMENT "Generating preprocessed file ${FILENAME_WE}.ii"
    )
    
    # Tạo target tùy chỉnh cho mỗi file source, được hiểu là để xuất file .ii cho từng file source
    add_custom_target(${FILENAME_WE}_preprocess ALL
        DEPENDS ${CMAKE_BINARY_DIR}/${FILENAME_WE}.ii
    )

    # Đảm bảo rằng quá trình build của MyCppProject sẽ phụ thuộc vào việc tạo các file .ii, do đó "quá trình tiền xử lý" sẽ được thực hiện "trước" khi biên dịch
    add_dependencies(C_Plus_Plus_Data_Structure_Algorihms ${FILENAME_WE}_preprocess)
endforeach()

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
