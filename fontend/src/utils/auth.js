// Utility functions for authentication
export const getCurrentUserId = () => {
  // Get user ID from localStorage or token
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.id || user.userId;
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  // Fallback: get from token if available
  const token =
    localStorage.getItem("token") || localStorage.getItem("access_token");
  if (token) {
    try {
      // Basic JWT decode (without verification)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const decoded = JSON.parse(jsonPayload);
      return decoded.userId || decoded.id || decoded.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return null;
};

export const isAuthenticated = () => {
  return !!getCurrentUserId();
};

export const isLoginPage = (pathname) => {
  return ["/login", "/register", "/"].includes(pathname);
};

// Decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Get user role from localStorage or decode from token
export const getUserRole = () => {
  // First try to get from localStorage
  const storedRole = localStorage.getItem("userRole");
  if (storedRole) {
    return storedRole;
  }

  // If not in localStorage, try to decode from token
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = decodeToken(token);
    if (decoded) {
      // Xử lý các trường hợp khác nhau của role trong token
      let role = null;

      // Trường hợp 1: role trực tiếp
      if (decoded.role) {
        role = decoded.role;
      }
      // Trường hợp 2: authorities là array
      else if (
        Array.isArray(decoded.authorities) &&
        decoded.authorities.length > 0
      ) {
        role = decoded.authorities[0];
      }
      // Trường hợp 3: authorities là string
      else if (typeof decoded.authorities === "string") {
        role = decoded.authorities;
      }
      // Trường hợp 4: scope
      else if (decoded.scope) {
        role = decoded.scope;
      }

      // Save to localStorage for future use
      if (role) {
        localStorage.setItem("userRole", role);
      }
      return role;
    }
  }

  return null;
};

// Check if user is admin
export const isAdmin = () => {
  const role = getUserRole();
  return role === "ADMIN" || role === "ROLE_ADMIN";
};
