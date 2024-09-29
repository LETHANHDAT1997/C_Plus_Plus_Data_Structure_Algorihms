# C_Plus_Plus_Data_Structure_Algorihms
# Thư mục root
Cơ sở của hệ thống phân cấp tệp Linux bắt đầu từ thư mục gốc (root).
Thư mục root thường được gọi là "dấu gạch chéo /" vì không có thư mục nào khác phía trên nó,nếu ai đó nói rằng hãy nhìn kỹ vào "dấu gạch chéo" hoặc tệp đó ở trong "dấu gạch chéo", thì họ đang đề cập đến thư mục root.

# Thư mục /bin
Thư mục chứa mã máy của các chương trình sau khi biên dịch

# Thư mục /etc
Thư mục chứa các tệp cấu hình của các chương trình,phần mềm trong Linux.

# Thư mục /home
Là nơi lưu trữ dữ liệu của người dùng, một máy tính có thể có nhiều người dùng,đây là nơi để lưu trữ và tách dữ liệu giữa các người dùng khác nhau.

# Thư mục /opt
Đây là nới chứa các phần mềm bên thứ ba không đi kèm với hệ điều hành.

# Thư mục /tmp
Là không gian tạm thời, sẽ được clear khi khởi động, vì vậy nếu bạn lưu trữ file trong đây thì khi khởi động nó sẽ được xóa đi.

# Thư mục /usr
Thư mục chứa các chương trình liên quand đến người dùng

# Thư mục /var
Thư mục này chứa các dữ liệu thường xuyên thay đổi như các tệp nhật ký.

# Thư mục /boot
Thư mục chứa các tệp khởi động của hệ điều hành, đây là nới bạn sẽ tìm thấy nhận linux

# Thư mục /media
Đây là thư mục để truy cập các tệp được lưu trữ trong CD Rom,DVD và USB cắm vào máy tính

# Thư mục /export
Chia sẻ các file hệ thống

# Thư mục /mnt
Là nơi để gắn kết các file hệ thống bên ngoài.

# Thư mục /root
Khác với thư mục root

The Prompt
# [jason@linuxsvr ~]$ 
Đây là thể hiện người dùng tên là jason theo là đấu @ và tên của hệ thống linux đang kết nối linuxsvr
Ở cuối lời nhắc, bạn sẽ thấy ký hiệu đô la $, đây là dấu hiệu cho thấy bạn đang sử dụng hệ thống với tư cách là người dùng bình thường chứ không phải là người dùng cấp cao.

# [root@linuxsvr:~]#
Đây thể hiện là người dùng cấp cao và root ở đây là tên người không liên quan đến thư mục root
# jason@linuxsvr:~>
Lưu ý dấu ~ biểu thị cho thư mục chính của tài khoản hiện tại, ví dụ 
    ~jason = /home/jason
    ~pat   = /home/pat
    ~root  = /root
    ~ftp   = /var/ftp

Commands Linux
Điều đầu tiên bạn cần biết là Linux commands phân biệt chữ hoa và chữ thường

# pwd
Hiển thị đường dẫn thư mục làm việc hiện tại

# cd [dir]
Di chuyển bạn đến thư mục dir, nếu không có dir thì sẽ lùi lại thư mục mẹ
Note:   cd . Thư mục hiện hành
        cd .. Thư mục mẹ
        cd - Trở lại thư mục trước đó

# ls [OPTION]
Lệnh liệt kê các tệp và thư mục hiện có trong thư mục hiện tại
Note:   ls -l Liệt kê thông tin các tệp
        ls -lr Liệt kê thông tin các tệp theo chiều ngược lại
        ls -a hoặc ls -l -a Liệt kê các file ẩn
        ls --color hiển thị danh sách các tệp và thư mục với   các màu sắc khác nha
        ls -R liệt kê tất cả tệp và thư mục con trong thư mục hiện tại
        ls -F giúp bạn nhận biết loại tệp hoặc thư mục
              Các ký hiệu:
                / Thêm vào cuối tên thư mục.
                * Thêm vào cuối tên tệp thực thi.
                @ Thêm vào cuối tên liên kết mềm (symlink).
                | Thêm vào cuối tên các tệp FIFO (First In First Out).
                = Thêm vào cuối tên của socket.
                VD: bin/  script.sh*  link@  fifo|  socket=
        ls -l "my notes.txt" mở một tệp có khoảng trắng
Note: 

# tree [OPTION]
Lệnh này hiển thị các tệp và thư mục hiện có trong thư mục chính ở dạng cây thư mục
Note: tree hiển thị tất cả tệp và thư mục
      tree -d chỉ hiển thị thư mục
      tree -C giống lệnh tree nhưng có tô màu sắc dễ nhìn


# cat [OPTION] [FILE]...
Lệnh cat cho phép người dùng tạo một hoặc nhiều file, xem nội dung file, nối file và chuyển hướng đầu ra trong terminal hoặc file.
    + Hiển thị nội dung của file
        cat /etc/hosts
    + Xem nội dung của nhiều file trong Terminal
        cat test test1
    + Tạo file bằng lệnh Cat
        cat >test2
        sau đó nhập văn bản vào và nhấn CTRL + D
    + Sử dụng lệnh Cat với các tùy chọn more và less
        cat song.txt | more hiển thị nhiều nội dung tệp hơn
        cat song.txt | less hiển thị ít nội dung tệp hơn
    + Hiển thị số dòng trong file
        cat -n song.txt
    + Hiển thị $ ở cuối file
        cat -e test
    + Hiển thị các dòng được phân tách bằng tab trong file
        cat -T test
    + Hiển thị nhiều file cùng một lúc
        cat test; cat test1; cat test2
    + Ghi đè nội dung từ một file vào một file khác
        cat test > test1
    + Ghi thêm nội dung vào một file khác
        cat test >> test1
    + Chuyển hướng đầu vào chuẩn với toán tử chuyển hướng
        cat < test2
        Thay vì cung cấp tệp trực tiếp cho lệnh cat (như cat test2), lệnh cat < test2 lấy đầu vào từ tệp test2 và hiển thị nội dung đó ra màn hình. Tuy nhiên, trong trường hợp này, kết quả đầu ra sẽ giống hệt với lệnh cat test2
    + Ghi đè nội dung nhiều file vào một tệp
        cat test test1 test2 > test3
    + Ghi thêm nội dung nhiều file vào một tệp
        cat test test1 test2 >> test3
    + Sắp xếp nội dung của nhiều file trong một file duy nhất
        cat test test1 test2 test3 | sort > test4
    
    
# ENVIROMENT VARIABLES
Chúng là các biến môi trường chứa các thông tin nào đó
Thông thường các biến này sẽ in hoa tất cả chữ cái
Thông thường để in ra giá trị của chúng ta có thể dùng lệnh "echo $VAR_NAME"

# echo $PATH
PATH là một biến môi trường chứa danh sách đường dẫn đến các thư mục mà hệ thống sẽ tìm kiếm khi một lệnh được gọi hoặc một chương trình được thực thi. Khi bạn chạy một lệnh trong Linux mà không chỉ rõ đường dẫn tuyệt đối (như /bin/ls), hệ thống sẽ tìm kiếm chương trình thực thi của lệnh này trong các thư mục được liệt kê trong biến PATH
Giả sử bạn chạy lệnh echo $PATH
Kết quả: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games
Danh sách này cho hệ thống biết rằng khi bạn nhập một lệnh, nó sẽ tìm kiếm lệnh đó theo thứ tự trong các thư mục này. Nếu tìm thấy lệnh trong một thư mục nào đó, nó sẽ thực thi lệnh từ thư mục đó và không tiếp tục tìm trong các thư mục còn lại

# which [command]
Cho biết thư mục chứa chương trình để thực hiện lệnh này

# mkdir [p] directory
Tạo một thư mục rỗng hoặc một thư mục với nhiêu thư mục con bên trong

# rmdir [p] directory
Remove một thư mục

# rm -rf directory
Xóa thư mục và tất cả tệp trong thư mục 
rm -rf là lệnh nguy hiểm, đặc biệt khi được sử dụng với các thư mục hệ thống hoặc sai đường dẫn, vì nó xóa mọi thứ mà không thể lấy lại được

