import apiClient from "../apiClient";

const BASE_URL = "/auth";

const authService = {
  login: (data) => apiClient.post(`${BASE_URL}/login`, data),
  register: (data) => apiClient.post(`${BASE_URL}/register`, data),
  create_user_info: (data) => apiClient.put(`/user/create-infor-user`, data),
  check_user: () => apiClient.get("/user/check-user"),
  forgotPassword: (email) => {
    console.log("🌐🌐🌐 API SERVICE: FORGOT PASSWORD");
    console.log("📡 URL: POST /auth/forgot-password");
    console.log("📧 Email:", email);
    return apiClient.post(`${BASE_URL}/forgot-password`, { email });
  },
};

export default authService;
