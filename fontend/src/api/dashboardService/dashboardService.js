import apiClient from "../apiClient";

const BASE_URL = "/user";

const dashboardService = {
  // Get dashboard statistics
  getDashboardInfo: () => apiClient.get(`${BASE_URL}/get-infor-dashboard`),
};

export default dashboardService;
