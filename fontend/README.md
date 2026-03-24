# Tinder Clone - Ứng dụng Frontend# 💕 Tinder Clone - Frontend Application# Getting Started with Create React App

Ứng dụng hẹn hò hiện đại được xây dựng với React, hỗ trợ nhắn tin thời gian thực, ghép đôi người dùng và quản lý admin.A modern dating application built with React, featuring real-time messaging, user matching, and admin management.This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Mục lục## 📋 Table of Contents## Available Scripts

- [Tính năng](#tính-năng)- [Features](#features)In the project directory, you can run:

- [Công nghệ](#công-nghệ)

- [Yêu cầu](#yêu-cầu)- [Technologies](#technologies)

- [Cài đặt](#cài-đặt)

- [Cấu hình](#cấu-hình)- [Prerequisites](#prerequisites)### `npm start`

- [Chạy ứng dụng](#chạy-ứng-dụng)

- [Cấu trúc dự án](#cấu-trúc-dự-án)- [Installation](#installation)

- [Tích hợp API](#tích-hợp-api)

- [Hướng dẫn người dùng](#hướng-dẫn-người-dùng)- [Configuration](#configuration)Runs the app in the development mode.\

- [Hướng dẫn Admin](#hướng-dẫn-admin)

- [Xử lý lỗi](#xử-lý-lỗi)- [Running the Application](#running-the-application)Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Tính năng- [Project Structure](#project-structure)

### Tính năng người dùng- [API Integration](#api-integration)The page will reload when you make changes.\

- **Xác thực**: Đăng nhập, Đăng ký, Quên mật khẩu

- **Quản lý hồ sơ**: Tạo và cập nhật hồ sơ cá nhân với ảnh- [User Guide](#user-guide)You may also see any lint errors in the console.

- **Khám phá**: Vuốt thẻ để tìm người phù hợp

- **Ghép đôi**: Thích/Bỏ qua người dùng, super like- [Admin Guide](#admin-guide)

- **Nhắn tin thời gian thực**: Hệ thống chat dựa trên WebSocket

- **Cài đặt**: Tùy chỉnh sở thích khám phá (khoảng cách, tuổi, giới tính)- [Troubleshooting](#troubleshooting)### `npm test`

- **Thông báo**: Thông báo ghép đôi và tin nhắn theo thời gian thực

- **Thiết kế responsive**: Hoạt động trên desktop và mobile## ✨ FeaturesLaunches the test runner in the interactive watch mode.\

### Tính năng AdminSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- **Dashboard**: Xem thống kê (người dùng, ghép đôi, tin nhắn)

- **Quản lý người dùng**: Xem và chỉnh sửa thông tin người dùng### User Features

- **Quản lý sở thích**: Tạo và cập nhật sở thích người dùng

- 🔐 **Authentication**: Login, Register, Forgot Password### `npm run build`

## Công nghệ

- 👤 **Profile Management**: Create and update user profile with photos

### Cốt lõi

- **React** 18.x - Framework UI- 🔍 **Discovery**: Swipe cards to find matchesBuilds the app for production to the `build` folder.\

- **React Router** - Điều hướng và routing

- **Ant Design** - Thư viện component UI- ❤️ **Matching**: Like/Pass users, super likesIt correctly bundles React in production mode and optimizes the build for the best performance.

- **Axios** - HTTP client

- 💬 **Real-time Messaging**: WebSocket-based chat system

### Tính năng thời gian thực

- **@stomp/stompjs** - WebSocket messaging- 📊 **Settings**: Customize discovery preferences (distance, age, gender)The build is minified and the filenames include the hashes.\

- **SockJS** - WebSocket fallback

- 🔔 **Notifications**: Real-time match and message notificationsYour app is ready to be deployed!

### Quản lý state và dữ liệu

- **React Hooks** - Quản lý state local- 📱 **Responsive Design**: Works on desktop and mobile

- **dayjs** - Xử lý ngày tháng

- **react-toastify** - Thông báo toastSee the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Upload file### Admin Features

- **Supabase** - Lưu trữ ảnh và CDN

- 📊 **Dashboard**: View statistics (users, matches, messages)### `npm run eject`

### Styling

- **CSS Modules** - Styling component- 👥 **User Management**: View and edit user information

- **Ant Design** - Component có sẵn

- 💖 **Interest Management**: Create and update user interests**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Yêu cầu

## 🛠 TechnologiesIf you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

### CoreInstead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

- **Node.js** (phiên bản 16.x trở lên)

- **npm** hoặc **yarn**- **React** 18.x - UI framework

- **Git**

- **React Router** - Navigation and routingYou don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Cài đặt

- **Ant Design** - UI component library

### 1. Clone repository

- **Axios** - HTTP client## Learn More

````bash

git clone https://github.com/tsui24/tinder-fe.git### Real-time FeaturesYou can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

cd tinder-fe

```- **@stomp/stompjs** - WebSocket messaging



### 2. Cài đặt dependencies- **SockJS** - WebSocket fallbackTo learn React, check out the [React documentation](https://reactjs.org/).



```bash### State Management & Data### Code Splitting

npm install

# hoặc- **React Hooks** - Local state management

yarn install

```- **dayjs** - Date manipulationThis section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)



### 3. Cấu hình biến môi trường- **react-toastify** - Toast notifications



Tạo file `.env` trong thư mục gốc:### Analyzing the Bundle Size



```env### File Upload

# Cấu hình API

REACT_APP_API_URL=http://localhost:8080/api- **Supabase** - Image storage and CDNThis section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)



# Cấu hình Supabase (để upload ảnh)### Styling### Making a Progressive Web App

REACT_APP_SUPABASE_URL=your_supabase_url

REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key- **CSS Modules** - Component-scoped styling

REACT_APP_SUPABASE_BUCKET=your_bucket_name

```- **Ant Design** - Pre-built componentsThis section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)



## Cấu hình## 📦 Prerequisites### Advanced Configuration



### Cài đặt API ClientBefore you begin, ensure you have the following installed:This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)



API client được cấu hình trong `src/api/apiClient.js`:- **Node.js** (v16.x or higher)### Deployment



```javascript- **npm** or **yarn**

const apiClient = axios.create({

  baseURL: "http://localhost:8080/api",- **Git**This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

  headers: {

    "Content-Type": "application/json",## 🚀 Installation### `npm run build` fails to minify

  },

});### 1. Clone the repositoryThis section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

````

```````bash

### Cấu hình WebSocketgit clone https://github.com/tsui24/tinder-fe.git

cd tinder-fe

WebSocket được cấu hình trong `src/services/webSocketService.js`:```



```javascript### 2. Cài đặt dependencies

const SOCKET_URL = "http://localhost:8080/ws";

``````bash

npm install

### Cài đặt Supabase# hoặc

yarn install

Cấu hình Supabase trong `src/config/supabaseClient.js`:```



```javascript### 3. Cấu hình biến môi trường

export const supabase = createClient(

  process.env.REACT_APP_SUPABASE_URL,Tạo file `.env` trong thư mục gốc:

  process.env.REACT_APP_SUPABASE_ANON_KEY

);```env

```# Cấu hình API

REACT_APP_API_URL=http://localhost:8080/api

## Chạy ứng dụng

# Cấu hình Supabase (để upload ảnh)

### Chế độ DevelopmentREACT_APP_SUPABASE_URL=your_supabase_url

REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

```bashREACT_APP_SUPABASE_BUCKET=your_bucket_name

npm start```

# hoặc

yarn start## Cấu hình

```````

### Cài đặt API Client

Ứng dụng sẽ mở tại `http://localhost:3000`

API client được cấu hình trong `src/api/apiClient.js`:

### Build cho Production

```````javascript

```bashconst apiClient = axios.create({

npm run build  baseURL: "http://localhost:8080/api",

# hoặc  headers: {

yarn build    "Content-Type": "application/json",

```  },

});

### Chạy Tests```



```bash### Cấu hình WebSocket

npm test

# hoặcWebSocket được cấu hình trong `src/services/webSocketService.js`:

yarn test

``````javascript

const SOCKET_URL = "http://localhost:8080/ws";

## Cấu trúc dự án```



```### Cài đặt Supabase

tinder-fe/

├── public/                 # File tĩnhCấu hình Supabase trong `src/config/supabaseClient.js`:

│   ├── index.html

│   └── favicon.ico```javascript

├── src/export const supabase = createClient(

│   ├── api/               # API services  process.env.REACT_APP_SUPABASE_URL,

│   │   ├── apiClient.js  process.env.REACT_APP_SUPABASE_ANON_KEY

│   │   ├── authService/);

│   │   ├── interestService/```

│   │   ├── userService/

│   │   └── dashboardService/## Chạy ứng dụng

│   ├── components/        # Component tái sử dụng

│   │   ├── ProtectedRoute.js### Chế độ Development

│   │   ├── AdminRoute.js

│   │   ├── header/```bash

│   │   └── footer/npm start

│   ├── features/          # Module tính năng# hoặc

│   │   ├── auth/yarn start

│   │   │   ├── Login.js```

│   │   │   ├── Register.js

│   │   │   └── ForgotPassword.jsỨng dụng sẽ mở tại `http://localhost:3000`

│   │   ├── match/

│   │   │   └── Match.js### Build cho Production

│   │   └── registerinfo/

│   │       └── RegisterInfo.js```bash

│   ├── layouts/           # Component layoutnpm run build

│   │   ├── Layout.js# hoặc

│   │   └── AdminLayout.jsyarn build

│   ├── pages/             # Component trang```

│   │   ├── Admin/

│   │   │   ├── Dashboard/### Chạy Tests

│   │   │   ├── Users/

│   │   │   └── Interests/```bash

│   │   ├── Profile/npm test

│   │   └── Settings/# hoặc

│   ├── routes/            # Cấu hình routeyarn test

│   │   └── index.js```

│   ├── services/          # Business logic services

│   │   └── webSocketService.js## Cấu trúc dự án

│   ├── utils/             # Hàm tiện ích

│   │   ├── auth.js```

│   │   ├── notification.jstinder-fe/

│   │   └── useSettings.js├── public/                 # File tĩnh

│   ├── App.js             # Component chính│   ├── index.html

│   ├── App.css│   └── favicon.ico

│   └── index.js           # Entry point├── src/

├── package.json│   ├── api/               # API services

└── README.md│   │   ├── apiClient.js

```│   │   ├── authService/

│   │   ├── interestService/

## Tích hợp API│   │   ├── userService/

│   │   └── dashboardService/

### Base URL│   ├── components/        # Component tái sử dụng

```│   │   ├── ProtectedRoute.js

http://localhost:8080/api│   │   ├── AdminRoute.js

```│   │   ├── header/

│   │   └── footer/

### Các Endpoint chính│   ├── features/          # Module tính năng

│   │   ├── auth/

#### Xác thực│   │   │   ├── Login.js

```│   │   │   ├── Register.js

POST /auth/login│   │   │   └── ForgotPassword.js

POST /auth/register│   │   ├── match/

POST /auth/forgot-password│   │   │   └── Match.js

```│   │   └── registerinfo/

│   │       └── RegisterInfo.js

#### Người dùng│   ├── layouts/           # Component layout

```│   │   ├── Layout.js

GET  /user/check-user│   │   └── AdminLayout.js

PUT  /user/create-infor-user│   ├── pages/             # Component trang

GET  /user/get-user-management (Admin)│   │   ├── Admin/

GET  /user/get-infor-dashboard (Admin)│   │   │   ├── Dashboard/

```│   │   │   ├── Users/

│   │   │   └── Interests/

#### Ghép đôi│   │   ├── Profile/

```│   │   └── Settings/

GET  /matches│   ├── routes/            # Cấu hình route

POST /matches/like│   │   └── index.js

POST /matches/pass│   ├── services/          # Business logic services

GET  /count-match-not-read│   │   └── webSocketService.js

```│   ├── utils/             # Hàm tiện ích

│   │   ├── auth.js

#### Tin nhắn│   │   ├── notification.js

```│   │   └── useSettings.js

GET  /messages/{matchId}│   ├── App.js             # Component chính

POST /messages/send│   ├── App.css

PUT  /messages/mark-read/{matchId}│   └── index.js           # Entry point

```├── package.json

└── README.md

#### Sở thích```

```````

GET /interest## Tích hợp API

POST /interest (Admin)

PUT /interest/{id} (Admin)### Base URL

```

```

### WebSocket Topicshttp://localhost:8080/api

```

```

/topic/match - Thông báo ghép đôi### Main Endpoints

/topic/like - Thông báo thích

/topic/chat - Tin nhắn chat#### Authentication

```

```

## Hướng dẫn người dùngPOST /auth/login

POST /auth/register

### 1. Đăng kýPOST /auth/forgot-password

````

1. Truy cập `/register`

2. Điền username, email, password#### User

3. Click "Create Account"

4. Hoàn thiện thông tin hồ sơ tại `/register-info`:```

   - Upload ảnh (tối đa 6)GET  /user/check-user

   - Nhập họ tên, ngày sinh, giới tínhPUT  /user/create-infor-user

   - Thêm bio và sở thíchGET  /user/get-user-management (Admin)

   - Đặt vị tríGET  /user/get-infor-dashboard (Admin)

````

### 2. Đăng nhập

#### Matching

1. Truy cập `/login`

2. Nhập username và password```

3. Click "Sign In"GET /matches

   - **Người dùng thường** chuyển đến `/match`POST /matches/like

   - **Admin** chuyển đến `/admin`POST /matches/pass

GET /count-match-not-read

### 3. Khám phá và Ghép đôi```

**Vuốt thẻ:**#### Messages

- **Like** - Vuốt phải hoặc click nút tim

- **Pass** - Vuốt trái hoặc click nút X```

- **Super Like** - Vuốt lên hoặc click nút saoGET /messages/{matchId}

POST /messages/send

**Xem chi tiết:**PUT /messages/mark-read/{matchId}

- Click icon info để xem hồ sơ đầy đủ```

- Xem ảnh, bio và sở thích

#### Interests

### 4. Tin nhắn

````

1. Click icon Messages trên thanh công cụGET    /interest

2. Xem danh sách ghép đôiPOST   /interest (Admin)

3. Click vào một ghép đôi để mở chatPUT    /interest/{id} (Admin)

4. Gõ tin nhắn và nhấn Enter hoặc click Send```

5. Badge đếm tin nhắn chưa đọc

### WebSocket Topics

### 5. Cài đặt

````

**Cài đặt khám phá:**/topic/match - Match notifications

- Khoảng cách (1-100 km)/topic/like - Like notifications

- Độ tuổi (18-100 tuổi)/topic/chat - Chat messages

- Sở thích giới tính (Nam, Nữ, Tất cả)```

- Hiển thị trên Tinder (bật/tắt)

## 👤 User Guide

**Vị trí:**

- Xem vị trí hiện tại### 1. Registration

- Cập nhật tọa độ

1. Navigate to `/register`

### 6. Hồ sơ2. Fill in username, email, password

3. Click "Create Account"

1. Click icon Profile4. Complete profile information at `/register-info`:

1. Chỉnh sửa thông tin: - Upload photos (max 6)

   - Họ tên, ngày sinh, giới tính - Enter full name, birthday, gender

   - Bio và sở thích - Add bio and interests

   - Upload/xóa ảnh - Set location

1. Lưu thay đổi

### 2. Login

## Hướng dẫn Admin

1. Navigate to `/login`

### Đăng nhập Admin2. Enter username and password

3. Click "Sign In"

Đăng nhập với tài khoản admin. Sau khi đăng nhập, admin sẽ tự động được chuyển đến `/admin/dashboard` - **Regular users** → Redirected to `/match`

- **Admin users** → Redirected to `/admin`

### Dashboard (`/admin/dashboard`)

### 3. Discovery & Matching

Xem thống kê thời gian thực:

- **Tổng người dùng** - Số lượng người dùng đã đăng ký**Swipe Cards:**

- **Tổng ghép đôi** - Số lượng ghép đôi thành công

- **Tổng tin nhắn** - Tin nhắn đã trao đổi- ❤️ **Like** - Swipe right or click heart button

- ❌ **Pass** - Swipe left or click X button

**API:** `GET /api/user/get-infor-dashboard`- ⭐ **Super Like** - Swipe up or click star button

**Response:\*\***View Details:\*\*

````json

{- Click info icon to see full profile

  "code": 200,- View photos, bio, and interests

  "message": "Thanh Cong",

  "result": {### 4. Messages

    "totalUserCount": 5,

    "totalMatchesCount": 1,1. Click Messages icon in taskbar

    "totalMessageCount": 152. View list of matches

  }3. Click on a match to open chat

}4. Type message and press Enter or click Send

```5. Unread count badge shows new messages



### Quản lý người dùng (`/admin/users`)### 5. Settings



**Tính năng:****Discovery Settings:**

- Xem tất cả người dùng trong bảng

- Tìm kiếm theo username- Distance range (1-100 km)

- Chỉnh sửa thông tin người dùng:- Age range (18-100 years)

  - Họ tên- Gender preference (Male, Female, Everyone)

  - Email- Show me on Tinder (toggle)

  - Giới tính (Nam = 1, Nữ = 0, Khác = 2)

  - Ngày sinh**Location:**

  - Vị trí

- View current location

**API:** `GET /api/user/get-user-management`- Update coordinates



**Response:**### 6. Profile

```json

{1. Click Profile icon

  "code": 200,2. Edit information:

  "message": "Thanh Cong",   - Full name, birthday, gender

  "result": [   - Bio and interests

    {   - Upload/delete photos

      "username": "sondm123",3. Save changes

      "fullName": "sondm123",

      "email": "12@gmail.com",## 👨‍💼 Admin Guide

      "gender": 1,

      "birthday": "2005-10-01",### Admin Login

      "location": null

    }Login with admin credentials. After login, admin users will be automatically redirected to `/admin/dashboard`

  ]

}### Dashboard (`/admin/dashboard`)

````

View real-time statistics:

**Cách chỉnh sửa:**

1. Click nút "Edit" trên hàng người dùng- 👥 **Total Users** - Number of registered users

2. Cập nhật thông tin trong modal- 💕 **Total Matches** - Number of successful matches

3. Click "Update" để lưu- 💬 **Total Messages** - Messages exchanged

**Giá trị giới tính:\*\***API:\*\* `GET /api/user/get-infor-dashboard`

- `0` - Nữ (tag màu hồng)

- `1` - Nam (tag màu xanh)**Response:**

- `2` - Khác (tag màu tím)

````json

### Quản lý sở thích (`/admin/interests`){

  "code": 200,

**Tính năng:**  "message": "Thanh Cong",

- Xem tất cả sở thích  "result": {

- Tìm kiếm theo tên    "totalUserCount": 5,

- Tạo sở thích mới    "totalMatchesCount": 1,

- Chỉnh sửa sở thích hiện có    "totalMessageCount": 15

  }

**Tạo sở thích:**}

1. Click nút "Add Interest"```

2. Nhập tên (bắt buộc, 2-50 ký tự)

3. Nhập mô tả (tùy chọn, tối đa 200 ký tự)### User Management (`/admin/users`)

4. Click "Create"

**Features:**

**Chỉnh sửa sở thích:**

1. Click nút "Edit" trên hàng sở thích- View all users in table format

2. Cập nhật thông tin- Search by username

3. Click "Update"- Edit user information:

  - Full name

**Lưu ý:** Chức năng xóa đã được gỡ bỏ để đảm bảo tính toàn vẹn dữ liệu  - Email

  - Gender (Male = 1, Female = 0, Other = 2)

## Xử lý lỗi  - Birthday

  - Location

### Các lỗi thường gặp

**API:** `GET /api/user/get-user-management`

#### 1. Lỗi kết nối WebSocket

**Response:**

**Vấn đề:** "WebSocket connection failed" trong console

```json

**Giải pháp:**{

- Kiểm tra server backend đang chạy trên `http://localhost:8080`  "code": 200,

- Xác minh WebSocket endpoint `/ws` có thể truy cập  "message": "Thanh Cong",

- Kiểm tra cấu hình CORS trên backend  "result": [

- Đảm bảo người dùng đã xác thực (WebSocket chỉ kết nối cho người dùng đã đăng nhập)    {

      "username": "sondm123",

#### 2. Lỗi upload ảnh      "fullName": "sondm123",

      "email": "12@gmail.com",

**Vấn đề:** "Failed to upload image"      "gender": 1,

      "birthday": "2005-10-01",

**Giải pháp:**      "location": null

- Xác minh thông tin đăng nhập Supabase trong `.env`    }

- Kiểm tra bucket Supabase tồn tại và công khai  ]

- Đảm bảo kích thước ảnh < 5MB}

- Kiểm tra kết nối mạng```

- Xác minh định dạng file (jpg, jpeg, png, gif, webp)

**How to Edit:**

#### 3. Lỗi gọi API

1. Click "Edit" button on user row

**Vấn đề:** "Network Error" hoặc 401 Unauthorized2. Update information in modal

3. Click "Update" to save

**Giải pháp:**

- Xác minh API backend đang chạy trên cổng 8080**Gender Values:**

- Kiểm tra `baseURL` trong `src/api/apiClient.js`

- Đảm bảo token hợp lệ (kiểm tra localStorage: `localStorage.getItem('token')`)- `0` - Female (pink tag with ♀ icon)

- Xóa cache trình duyệt và localStorage- `1` - Male (blue tag with ♂ icon)

- Đăng nhập lại để lấy token mới- `2` - Other (purple tag)



#### 4. Không nhận thông báo### Interest Management (`/admin/interests`)



**Vấn đề:** Không nhận được thông báo ghép đôi/tin nhắn**Features:**



**Giải pháp:**- View all interests

- Kiểm tra trạng thái kết nối WebSocket trong console- Search by name

- Xác minh người dùng đã xác thực- Create new interests

- Kiểm tra lỗi trong browser console- Edit existing interests

- Tải lại trang để khởi tạo lại WebSocket

- Đảm bảo thông báo không bị chặn bởi trình duyệt**Create Interest:**



#### 5. Không truy cập được trang Admin1. Click "Add Interest" button

2. Enter name (required, 2-50 chars)

**Vấn đề:** Bị chuyển hướng đến `/match` khi truy cập `/admin`3. Enter description (optional, max 200 chars)

4. Click "Create"

**Giải pháp:**

- Xác minh role người dùng là "ADMIN" trong JWT token**Edit Interest:**

- Kiểm tra role trong console: `localStorage.getItem('userRole')`

- Đăng nhập với tài khoản admin1. Click "Edit" button on interest row

- Xóa localStorage và đăng nhập lại:2. Update information

  ```javascript3. Click "Update"

  localStorage.clear();

  ```**Note:** Delete functionality has been removed for data integrity



#### 6. Lỗi đếm tin nhắn## 🔧 Troubleshooting



**Vấn đề:** Số lượng tin nhắn chưa đọc không chính xác### Common Issues



**Giải pháp:**#### 1. WebSocket Connection Failed

- Kiểm tra response API từ `/count-match-not-read`

- Xác minh WebSocket đã kết nối**Problem:** "WebSocket connection failed" in console

- Click vào ghép đôi để đánh dấu tin nhắn là đã đọc

- Tải lại trang để làm mới số đếm**Solution:**



### Xóa dữ liệu ứng dụng- Check backend server is running on `http://localhost:8080`

- Verify WebSocket endpoint `/ws` is accessible

Nếu gặp lỗi liên tục:- Check CORS configuration on backend

- Ensure user is authenticated (WebSocket only connects for logged-in users)

```javascript

// Mở browser console (F12) và chạy:#### 2. Images Not Uploading

localStorage.clear();

// Sau đó tải lại trang (Ctrl+R hoặc Cmd+R)**Problem:** "Failed to upload image"

````

**Solution:**

## Bảo mật

- Verify Supabase credentials in `.env`

1. **Lưu trữ Token**: JWT tokens được lưu trong localStorage- Check Supabase bucket exists and is public

2. **Token trong Headers**: Tất cả API calls bao gồm `Authorization: Bearer <token>`- Ensure image size < 5MB

3. **Protected Routes**: Sử dụng component `ProtectedRoute` cho trang người dùng- Check network connection

4. **Admin Routes**: Sử dụng component `AdminRoute` cho trang admin- Verify file format (jpg, jpeg, png, gif, webp)

5. **Phân quyền theo Role**: Trang admin chỉ có thể truy cập bởi người dùng có role "ADMIN"

6. **Reset mật khẩu**: Quy trình quên mật khẩu an toàn với xác minh email#### 3. API Calls Failing

7. **Xác thực WebSocket**: Kết nối WebSocket yêu cầu xác thực hợp lệ

**Problem:** "Network Error" or 401 Unauthorized

## Hỗ trợ trình duyệt

**Solution:**

- Chrome (mới nhất)

- Firefox (mới nhất)- Verify backend API is running on port 8080

- Safari (mới nhất)- Check `baseURL` in `src/api/apiClient.js`

- Edge (mới nhất)- Ensure token is valid (check localStorage: `localStorage.getItem('token')`)

- IE11 (không hỗ trợ đầy đủ)- Clear browser cache and localStorage

- Login again to get new token

## Tùy chỉnh

#### 4. Notifications Not Working

### Thay đổi màu thương hiệu

**Problem:** Not receiving match/message notifications

Chỉnh sửa trong file CSS tương ứng:

**Solution:**

````css

/* Màu chính (Tinder đỏ) */- Check WebSocket connection status in console

.ant-btn-primary {- Verify user is authenticated

  background: #ff4458;- Check browser console for errors

  border-color: #ff4458;- Reload page to reinitialize WebSocket

}- Ensure notifications are not blocked by browser



.ant-btn-primary:hover {#### 5. Can't Access Admin Panel

  background: #ff5a6b;

  border-color: #ff5a6b;**Problem:** Redirected to `/match` when accessing `/admin`

}

```**Solution:**



### Thay đổi Logo- Verify user role is "ADMIN" in JWT token

- Check role in console: `localStorage.getItem('userRole')`

Thay thế file logo trong thư mục `public/`:- Login with admin credentials

- `favicon.ico` - Icon tab trình duyệt- Clear localStorage and login again:

- `logo192.png` - Logo nhỏ  ```javascript

- `logo512.png` - Logo lớn  localStorage.clear();

````

### Tùy chỉnh giao diện

#### 6. Count Issues in Messages

Theme Ant Design có thể được tùy chỉnh trong `src/index.css` hoặc bằng cách sử dụng ConfigProvider.

**Problem:** Unread message count incorrect

## Các lệnh có sẵn

**Solution:**

````bash

# Khởi động server development (http://localhost:3000)- Check API response from `/count-match-not-read`

npm start- Verify WebSocket is connected

- Click on match to mark messages as read

# Build cho production (tạo thư mục /build)- Reload page to refresh count

npm run build

### Clear Application Data

# Chạy tests

npm testIf you encounter persistent issues:



# Eject từ Create React App (thao tác một chiều)```javascript

npm run eject// Open browser console (F12) and run:

```localStorage.clear();

// Then reload page (Ctrl+R or Cmd+R)

## Biến môi trường```



Tạo file `.env` trong thư mục gốc:## 🔐 Security Notes



```env1. **Token Storage**: JWT tokens are stored in localStorage

# Bắt buộc2. **Token in Headers**: All API calls include `Authorization: Bearer <token>`

REACT_APP_API_URL=http://localhost:8080/api3. **Protected Routes**: Use `ProtectedRoute` component for user pages

4. **Admin Routes**: Use `AdminRoute` component for admin pages

# Tùy chọn (cho upload ảnh Supabase)5. **Role-Based Access**: Admin panel only accessible to users with role "ADMIN"

REACT_APP_SUPABASE_URL=https://your-project.supabase.co6. **Password Reset**: Secure forgot password flow with email verification

REACT_APP_SUPABASE_ANON_KEY=your-anon-key7. **WebSocket Auth**: WebSocket connections require valid authentication

REACT_APP_SUPABASE_BUCKET=avatars

```## 📱 Browser Support



## Triển khai- ✅ Chrome (latest)

- ✅ Firefox (latest)

### Deploy lên Vercel- ✅ Safari (latest)

- ✅ Edge (latest)

```bash- ⚠️ IE11 (not fully supported)

# Cài đặt Vercel CLI

npm i -g vercel## 🎨 Customization



# Deploy### Change Brand Color

vercel

```Edit in respective CSS files:



### Deploy lên Netlify```css

/* Primary color (Tinder red) */

```bash.ant-btn-primary {

# Build  background: #ff4458;

npm run build  border-color: #ff4458;

}

# Deploy thư mục /build lên Netlify

```.ant-btn-primary:hover {

  background: #ff5a6b;

### Cấu hình biến môi trường  border-color: #ff5a6b;

}

Đặt biến môi trường trong nền tảng hosting của bạn:```

- `REACT_APP_API_URL` - URL API production

- `REACT_APP_SUPABASE_URL` - URL Supabase### Change Logo

- `REACT_APP_SUPABASE_ANON_KEY` - Key Supabase

- `REACT_APP_SUPABASE_BUCKET` - Tên bucket lưu trữReplace logo files in `public/` directory:



## Đóng góp- `favicon.ico` - Browser tab icon

- `logo192.png` - Small logo

1. Fork repository- `logo512.png` - Large logo

2. Tạo nhánh tính năng (`git checkout -b feature/TinhNangMoi`)

3. Commit thay đổi (`git commit -m 'Thêm TinhNangMoi'`)### Modify Theme

4. Push lên nhánh (`git push origin feature/TinhNangMoi`)

5. Mở Pull RequestAnt Design theme can be customized in `src/index.css` or by using ConfigProvider.



## Giấy phép## 📝 Available Scripts



Dự án này được cấp phép theo MIT License - xem file LICENSE để biết chi tiết.```bash

# Start development server (http://localhost:3000)

## Tác giảnpm start



- **tsui24** - Công việc ban đầu - [GitHub Profile](https://github.com/tsui24)# Build for production (creates /build folder)

npm run build

## Lời cảm ơn

# Run tests

- Đội ngũ React cho framework tuyệt vờinpm test

- Đội ngũ Ant Design cho các component UI đẹp

- Đội ngũ Supabase cho việc lưu trữ file dễ dàng# Eject from Create React App (one-way operation)

- WebSocket/STOMP cho tính năng thời gian thựcnpm run eject

- Tất cả người đóng góp và tester```



## Hỗ trợ## 🌐 Environment Variables



Nếu bạn có câu hỏi hoặc cần trợ giúp:Create `.env` file in root:



1. Mở issue trên GitHub```env

2. Kiểm tra các issue hiện có để tìm giải pháp# Required

3. Liên hệ đội ngũ phát triểnREACT_APP_API_URL=http://localhost:8080/api



---# Optional (for Supabase image upload)

REACT_APP_SUPABASE_URL=https://your-project.supabase.co

**Được tạo với yêu thương bởi Đội ngũ Tinder Clone**REACT_APP_SUPABASE_ANON_KEY=your-anon-key

REACT_APP_SUPABASE_BUCKET=avatars

**Chúc bạn lập trình vui vẻ!**```


## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
````

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy /build folder to Netlify
```

### Configure Environment Variables

Set environment variables in your hosting platform:

- `REACT_APP_API_URL` - Production API URL
- `REACT_APP_SUPABASE_URL` - Supabase URL
- `REACT_APP_SUPABASE_ANON_KEY` - Supabase key
- `REACT_APP_SUPABASE_BUCKET` - Storage bucket name

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **tsui24** - _Initial work_ - [GitHub Profile](https://github.com/tsui24)

## 🙏 Acknowledgments

- React team for the amazing framework
- Ant Design team for beautiful UI components
- Supabase team for easy file storage
- WebSocket/STOMP for real-time features
- All contributors and testers

## 📞 Support

If you have any questions or need help:

1. Open an issue on GitHub
2. Check existing issues for solutions
3. Contact the development team

---

**Made with ❤️ by the Tinder Clone Team**

**Happy Coding! 💕**
