import apiClient from "../apiClient";

const BASE_URL = "/user";

const matchUserService = {
  getUserSuitable: () => apiClient.get(`${BASE_URL}/get-user-suitable`),
  updateAddressUser: (lon, lat) =>
    apiClient.put(`${BASE_URL}/update-address?lon=${lon}&lat=${lat}`),
  getSettingUser: () => apiClient.get(`${BASE_URL}/get-setting-user`),
  updateSettingUser: (settingData) =>
    apiClient.patch(`${BASE_URL}/update-setting-user`, settingData),
  getUserProfile: () => {
    console.log("🌐🌐🌐 API SERVICE: GET USER PROFILE");
    console.log("📡 URL: GET /user/get-profile");
    return apiClient.get(`${BASE_URL}/get-profile`);
  },
  updateUserProfile: (profileData) => {
    console.log("🌐🌐🌐 API SERVICE: UPDATE USER PROFILE");
    console.log("📡 URL: PUT /user/update-user");
    console.log("📋 Data:", profileData);
    return apiClient.put(`${BASE_URL}/update-user`, profileData);
  },
  getUsersWhoLikedMe: () => apiClient.get(`${BASE_URL}/get-user-likes`),
  getMatches: () => apiClient.get(`/matches`),
  getUnreadMatchCount: () => {
    console.log("🌐🌐🌐 API SERVICE: GET UNREAD MATCH COUNT");
    console.log("📡 URL: GET /count-match-not-read");
    return apiClient.get(`/matches/count-match-not-read`);
  },
  getMessages: (matchId) => {
    console.log("🌐🌐🌐 API SERVICE: GET MESSAGES");
    console.log("📡 URL: GET /messages/" + matchId);
    console.log("📋 Params: matchId:", matchId);
    return apiClient.get(`/messages/${matchId}`);
  },
  sendMessage: (messageData) => {
    console.log("🌐🌐🌐 API SERVICE: SEND MESSAGE");
    console.log("📡 URL: POST /chat/send");
    console.log("📋 Data:", messageData);
    return apiClient.post(`/chat/send`, messageData);
  },
  markMessagesAsRead: (matchId) => {
    console.log("🌐🌐🌐 API SERVICE: MARK MESSAGES AS READ");
    console.log("📡 URL: PUT /messages/mark-read/" + matchId);
    console.log("📋 Params: matchId:", matchId);
    return apiClient.put(`/messages/mark-read/${matchId}`);
  },
  likeUser: (userToId) => {
    console.log("🌐🌐🌐 API SERVICE: LIKE USER");
    console.log("📡 URL: POST /like");
    console.log("📋 Params: { userToId:", userToId, ", status: 0 (LIKE) }");
    return apiClient.post(`/like`, null, {
      params: { userToId, status: 0 },
    });
  },
  dislikeUser: (userToId) => {
    console.log("🌐🌐🌐 API SERVICE: DISLIKE USER");
    console.log("📡 URL: POST /api/like");
    console.log("📋 Params: { userToId:", userToId, ", status: 1 (DISLIKE) }");
    return apiClient.post(`/like`, null, {
      params: { userToId, status: 1 },
    });
  },
  // Update user password
  updatePassword: (passwordDTO) => {
    console.log("🌐🌐🌐 API SERVICE: UPDATE USER PASSWORD");
    console.log("📡 URL: PUT /user/update-password");
    console.log("📋 Payload:", passwordDTO);
    return apiClient.put(`${BASE_URL}/update-password`, passwordDTO);
  },
};
export default matchUserService;
