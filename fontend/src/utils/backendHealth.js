// Backend health check utility
export const checkBackendHealth = async () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  try {
    // Try multiple endpoints to check if backend is available
    const endpoints = [
      `${baseURL}/actuator/health`,
      `${baseURL}/api/health`,
      `${baseURL}/health`,
      baseURL,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          timeout: 3000,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          console.log("✅ Backend is available at:", endpoint);
          return true;
        }
      } catch (err) {
        // Continue to next endpoint
        continue;
      }
    }

    console.warn("⚠️ Backend not available at any endpoint");
    return false;
  } catch (error) {
    console.warn("⚠️ Backend health check failed:", error.message);
    return false;
  }
};

export default {
  checkBackendHealth,
};
