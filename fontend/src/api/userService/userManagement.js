import apiClient from "../apiClient";

const BASE_URL = "/user";

const userService = {
  // Get all users for management
  getUsersManagement: () => apiClient.get(`${BASE_URL}/get-user-management`),

  // Get single user by username
  getUserByUsername: (username) => apiClient.get(`${BASE_URL}/${username}`),

  // Update user
  updateUser: (username, data) =>
    apiClient.put(`${BASE_URL}/${username}`, data),
};

export default userService;
