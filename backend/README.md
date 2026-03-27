# Tinder Dating App Backend
    2
    3 Dự án này là hệ thống Backend cho ứng dụng hẹn hò (tương tự Tinder), được xây dựng trên nền tảng Java Spring Boot. Hệ thống cung cấp đầy đủ các tính năng từ xác thực người
      dùng, quản lý hồ sơ, ghép đôi (matching) cho đến nhắn tin thời gian thực.
    4
    5 ## 🚀 Công nghệ sử dụng
    6
    7 *   **Framework chính:** Spring Boot 3.2.5 (Java 17)
    8 *   **Cơ sở dữ liệu:** MySQL (Lưu trữ dữ liệu quan hệ), Redis (Caching)
    9 *   **Bảo mật:** Spring Security & JWT (JSON Web Token)
   10 *   **Messaging & Real-time:** 
   11     *   RabbitMQ (Xử lý hàng đợi tin nhắn)
   12     *   WebSocket & STOMP (Nhắn tin thời gian thực)
   13 *   **Lưu trữ hình ảnh:** Tích hợp Supabase Storage
   14 *   **Trí tuệ nhân tạo (AI) & Vector DB:**
   15     *   Spring AI (OpenAI)
   16     *   LangChain4j & Qdrant (Sử dụng Vector Database cho các tính năng tìm kiếm thông minh/gợi ý)
   17 *   **Bản đồ & Vị trí:** GraphHopper API & OpenStreetMap (OSM) để tính toán khoảng cách và định vị.
   18 *   **Công cụ hỗ trợ:** Lombok, MapStruct (Mapping DTO), Maven.
   19
   20 ## ✨ Tính năng chính
   21
   22 1.  **Hệ thống xác thực (Auth):** Đăng ký, đăng nhập, quên mật khẩu và đổi mật khẩu an toàn với JWT.
   23 2.  **Quản lý người dùng:** 
   24     *   Thiết lập hồ sơ cá nhân, sở thích.
   25     *   Tải lên và quản lý ảnh (tích hợp Supabase).
   26     *   Cập nhật vị trí để tìm kiếm đối tượng xung quanh.
   27 3.  **Cơ chế ghép đôi (Matching):**
   28     *   Tính năng Like/Dislike.
   29     *   Thông báo khi có Match mới.
   30     *   Sử dụng AI/Vector DB (Qdrant) để tối ưu hóa gợi ý ghép đôi dựa trên sở thích và hành vi.
   31 4.  **Nhắn tin (Chat):**
   32     *   Nhắn tin thời gian thực qua WebSocket.
   33     *   Lưu trữ lịch sử tin nhắn.
   34     *   Thông báo đẩy (Notifications).
   35 5.  **Dịch vụ vị trí:** Tính toán khoảng cách giữa các người dùng bằng GraphHopper.
   36 6.  **Hệ thống tự động (CronJobs):** Tự động dọn dẹp dữ liệu cũ, xử lý các tác vụ định kỳ (LikeCleanUp).
   37 7.  **Dashboard:** Cung cấp thông tin tổng quan và thống kê hệ thống.
   38
   39 ## 🛠 Cấu trúc dự án
   40
   41 *   `config/`: Cấu hình Security, Socket, CORS, Supabase, WebClient.
   42 *   `controller/`: Các API Endpoint xử lý yêu cầu từ Client.
   43 *   `service/`: Xử lý logic nghiệp vụ.
   44 *   `repository/`: Tương tác với cơ sở dữ liệu.
   45 *   `dto/`: Các đối tượng chuyển đổi dữ liệu (Request/Response).
   46 *   `model/`: Các thực thể (Entities) trong cơ sở dữ liệu.
   47 *   `jwt/`: Xử lý tạo và xác thực Token.
   48 *   `utils/`: Các dịch vụ bổ trợ như GraphHopper, OSM, Mappers.
   49
   50 ## ⚙️ Cài đặt & Khởi chạy
   51
   52 ### Yêu cầu hệ thống
   53 *   Java 17+
   54 *   MySQL
   55 *   Redis
   56 *   RabbitMQ
   57 *   Docker (Tùy chọn, để chạy Qdrant hoặc các dịch vụ đi kèm qua `docker-compose.yml`)
   58
   59 ### Các bước thực hiện
   1 2.  **Cấu hình biến môi trường:**
   2     Chỉnh sửa tệp `src/main/resources/application.yaml` (hoặc `application-dev.yaml`) để cập nhật thông tin kết nối DB, Mail server, và API Keys (OpenAI, GraphHopper, Qdrant).
   3 3.  **Chạy dự án:**
      ./mvnw spring-boot:run

   1
   2 ## 📝 Thông tin liên hệ
   3 Dự án được phát triển bởi nhóm phát triển Tinder App. Mọi thắc mắc vui lòng liên hệ qua Email trong tệp cấu hình.
