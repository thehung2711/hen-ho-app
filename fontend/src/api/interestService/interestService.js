import apiClient from "../apiClient";

const BASE_URL = "/interest";

const interestService = {
  // Get all interests
  getInterests: () => apiClient.get(`${BASE_URL}`),

  // Get single interest by ID
  getInterestById: (id) => apiClient.get(`${BASE_URL}/${id}`),

  // Create new interest
  createInterest: (data) => apiClient.post(`${BASE_URL}`, data),

  // Update interest
  updateInterest: (id, data) => apiClient.put(`${BASE_URL}/${id}`, data),

  // Delete interest
  deleteInterest: (id) => apiClient.delete(`${BASE_URL}/${id}`),
};

export default interestService;
