💕 Hen Ho App - Tinder Clone Frontend

  Ứng dụng hẹn hò hiện đại được xây dựng bằng React, hỗ trợ ghép đôi người dùng, nhắn tin thời gian thực và quản lý Admin.

  ✨ Tính năng chính

  👤 Cho người dùng
   - Đăng ký & Đăng nhập: Quản lý tài khoản và thông tin cá nhân.
   - Khám phá (Swipe): Vuốt thẻ để Thích (Like) hoặc Bỏ qua (Pass) người dùng khác.
   - Ghép đôi (Matching): Thông báo ngay lập tức khi hai người cùng thích nhau.
   - Trò chuyện (Chat): Nhắn tin thời gian thực qua WebSocket.
   - Hồ sơ & Cài đặt: Cập nhật ảnh (qua Supabase), tiểu sử và thiết lập khoảng cách tìm kiếm.

  👨‍💼 Cho Admin
   - Dashboard: Thống kê tổng số người dùng, lượt ghép đôi và tin nhắn.
   - Quản lý người dùng: Xem danh sách và chỉnh sửa thông tin thành viên.
   - Quản lý sở thích: Thêm/sửa danh mục sở thích để người dùng lựa chọn.

  🛠 Công nghệ sử dụng
   - Frontend: React JS, React Router.
   - UI Library: Ant Design (AntD).
   - Giao tiếp API: Axios.
   - Real-time: WebSocket (STOMP & SockJS).

  🚀 Cài đặt nhanh

  1. Tải dự án
   1 git clone https://github.com/your-username/tinder-fe.git
   2 cd tinder-fe

  2. Cài đặt thư viện

   1 npm install

  3. Cấu hình biến môi trường
  Tạo file .env tại thư mục gốc và nhập các thông tin sau:

   1 REACT_APP_API_URL=http://localhost:8080/api
   2 REACT_APP_SUPABASE_URL=your_supabase_url
   3 REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
   4 REACT_APP_SUPABASE_BUCKET=your_bucket_name

  4. Chạy ứng dụng
   1 npm start
  Ứng dụng sẽ chạy tại địa chỉ: http://localhost:3000

  📂 Cấu trúc thư mục chính
   - src/api: Các dịch vụ gọi API (Auth, User, Match...).
   - src/features: Logic chính của các tính năng (Login, Swipe, RegisterInfo).
   - src/pages: Các trang giao diện hoàn chỉnh.
   - src/components: Các thành phần dùng chung (Header, Footer, Route bảo vệ).
   - src/services: Cấu hình WebSocket.

  ---
