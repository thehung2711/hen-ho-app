import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ToastContainer } from "react-toastify";
import { SettingsProvider } from "./utils/useSettings";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useCallback, useRef } from "react";
import webSocketService from "./services/webSocketService";
import { getCurrentUserId, isAuthenticated, isLoginPage } from "./utils/auth";
import notification from "./utils/notification"; // Re-enabled for notifications

// Debug helper - expose to global để có thể test từ console
if (process.env.NODE_ENV === "development") {
  window.debugWS = {
    getState: () => webSocketService.getConnectionState(),
    debug: () => webSocketService.debugConnection(),
    testSubscription: () => webSocketService.testSubscription(),
    testNotification: (type = "LIKE") => {
      const testData = {
        type: type,
        userFromUsername: "TestUser",
        userFromId: 999,
        message: "Test notification",
      };
      console.log("🧪 Testing notification:", testData);
      // Test notifications - disabled per user request
      if (type === "MATCH") {
        console.log("🧪 Test Match notification:", testData.userFromUsername);
        // notification.showMatch(...) - disabled
      } else {
        console.log("🧪 Test Like notification:", testData.userFromUsername);
        // notification.showLike(...) - disabled
      }
    },
    reconnect: () => webSocketService.forceReconnect(),
    checkAuth: () => {
      const userId = getCurrentUserId();
      const isAuth = isAuthenticated();
      console.log("🔧 Auth Check:", {
        isAuthenticated: isAuth,
        userId: userId,
        token: localStorage.getItem("token") ? "✅ Có" : "❌ Không có",
      });
      return { isAuth, userId };
    },
  };

  console.log("🔧 Debug commands available:");
  console.log("  debugWS.debug() - Show connection info");
  console.log("  debugWS.getState() - Get current state");
  console.log(
    "  debugWS.testNotification('MATCH'|'LIKE') - Test UI notifications"
  );
  console.log("  debugWS.testSubscription() - Test STOMP subscription");
  console.log("  debugWS.reconnect() - Force reconnect");
  console.log("  debugWS.checkAuth() - Check authentication");
}

function AppContent() {
  const [wsConnected, setWsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const initializingRef = useRef(false);
  const handleNotificationRef = useRef(null); // ✅ Store callback in ref
  const processedNotificationsRef = useRef(new Set()); // ✅ Track processed notifications

  // Handle WebSocket notifications - useCallback để tránh re-render
  const notificationCountRef = useRef({});

  const handleNotification = useCallback((notificationData) => {
    try {
      // Tạo unique ID dựa trên nội dung thực của notification (KHÔNG dùng timestamp)
      const notifKey = `${notificationData.type}_${
        notificationData.userFromId || notificationData.senderId
      }_${notificationData.userToId || ""}`;

      // Kiểm tra xem notification này đã được xử lý chưa
      if (processedNotificationsRef.current.has(notifKey)) {
        console.warn(
          "🚫🚫🚫 DUPLICATE NOTIFICATION BLOCKED (ALREADY PROCESSED):",
          notifKey
        );
        return;
      }

      // Đánh dấu đã xử lý
      processedNotificationsRef.current.add(notifKey);

      // Tự động xóa sau 5 giây để cho phép notification tương tự sau đó
      setTimeout(() => {
        processedNotificationsRef.current.delete(notifKey);
      }, 5000);

      // Tạo unique ID cho notification để track
      const notifId = `${notificationData.type}_${
        notificationData.userFromId || notificationData.senderId
      }_${Date.now()}`;

      // Kiểm tra xem notification này đã được xử lý chưa (trong vòng 1 giây)
      const now = Date.now();
      if (
        notificationCountRef.current[notifId] &&
        now - notificationCountRef.current[notifId] < 1000
      ) {
        console.warn("🚫🚫🚫 DUPLICATE NOTIFICATION BLOCKED:", notifId);
        console.warn(
          "📍 Time difference:",
          now - notificationCountRef.current[notifId],
          "ms"
        );
        return;
      }

      notificationCountRef.current[notifId] = now;
      console.log("=".repeat(80));
      console.log("🔔🔔🔔 APP.JS - NOTIFICATION CALLBACK TRIGGERED!");
      console.log("=".repeat(80));
      console.log("📨 Notification data:", notificationData);
      console.log("🆔 Notification ID:", notifId);
      console.log("⏰ Timestamp:", new Date().toISOString());
      console.log(
        "📍 Stack trace:",
        new Error().stack.split("\n").slice(1, 3).join("\n")
      );

      if (!notificationData || typeof notificationData !== "object") {
        console.warn("⚠️ Invalid notification data:", notificationData);
        return;
      }

      switch (notificationData.type) {
        case "MATCH":
          console.log(
            "🎉 Displaying MATCH notification for:",
            notificationData.userFromUsername
          );
          notification.match(notificationData); // Hiển thị popup
          break;
        case "LIKE":
          console.log(
            "💖 Displaying LIKE notification for:",
            notificationData.userFromUsername
          );
          notification.like(notificationData); // Hiển thị popup
          break;
        case "CHAT":
          console.log("💬 CHAT notification:", notificationData);
          // Dispatch custom event để Match.js component có thể lắng nghe
          window.dispatchEvent(
            new CustomEvent("chatNotification", { detail: notificationData })
          );
          break;
        default:
          console.log("📢 New notification:", notificationData);
          notification.showInfo("New notification received");
      }
    } catch (error) {
      console.error("❌ Error handling notification:", error);
    }
  }, []);

  // ✅ Update ref mỗi khi handleNotification thay đổi
  useEffect(() => {
    handleNotificationRef.current = handleNotification;
  }, [handleNotification]);

  // Initialize WebSocket connection - tối ưu hóa logic
  const initWebSocket = useCallback(async () => {
    // Tránh double initialization
    if (initializingRef.current) {
      console.log("⏳ WebSocket đang khởi tạo, skip...");
      return;
    }

    const currentPath = window.location.pathname;
    const shouldConnect = isAuthenticated() && !isLoginPage(currentPath);
    const userId = getCurrentUserId();

    if (!shouldConnect || !userId) {
      console.log(
        "🚫 Không kết nối WebSocket: không authenticated hoặc đang ở login page"
      );
      return;
    }

    // Kiểm tra xem đã kết nối cho user này chưa
    const wsState = webSocketService.getConnectionState();
    if (wsState.connected && wsState.userId === userId) {
      console.log("✅ WebSocket đã kết nối cho user này, skip reconnect");
      setWsConnected(true);
      setCurrentUserId(userId);
      // KHÔNG update callback nữa - để tránh re-subscribe
      return;
    }

    // Nếu đang kết nối cho user khác, disconnect trước
    if (wsState.connected && wsState.userId !== userId) {
      console.log("� Switching user, disconnecting old WebSocket connection");
      webSocketService.disconnect();
      setWsConnected(false);
    }

    try {
      initializingRef.current = true;
      console.log("🚀 Khởi tạo WebSocket connection cho user:", userId);

      // ✅ Sử dụng wrapper để lấy callback mới nhất từ ref
      const stableCallback = (data) => {
        if (
          initializingRef.current !== null &&
          handleNotificationRef.current &&
          typeof handleNotificationRef.current === "function"
        ) {
          try {
            handleNotificationRef.current(data);
          } catch (error) {
            console.error("❌ Error in notification callback:", error);
          }
        }
      };

      await webSocketService.connect(userId, stableCallback);

      // Double check component vẫn mounted trước khi update state
      if (initializingRef.current !== null) {
        console.log("✅ WebSocket connected successfully");
        setWsConnected(true);
        setCurrentUserId(userId);
      }
    } catch (error) {
      // Chỉ update state nếu component vẫn mounted
      if (initializingRef.current !== null) {
        console.warn("⚠️ WebSocket connection failed:", error.message);
        setWsConnected(false);
        setCurrentUserId(null);
      }
      // App tiếp tục hoạt động bình thường không có WebSocket
    } finally {
      if (initializingRef.current !== null) {
        initializingRef.current = false;
      }
    }
  }, []); // ✅ EMPTY DEPS - initWebSocket không phụ thuộc vào gì nữa!

  // Main WebSocket effect - CHỈ RUN 1 LẦN KHI APP MOUNT
  useEffect(() => {
    console.log("🎯 App mounted - initializing WebSocket...");
    initWebSocket();

    // Listen for route/authentication changes
    const handleAuthChange = () => {
      const currentPath = window.location.pathname;
      const shouldConnect = isAuthenticated() && !isLoginPage(currentPath);
      const userId = getCurrentUserId();
      const wsState = webSocketService.getConnectionState();

      if (!shouldConnect || !userId) {
        if (wsState.connected) {
          console.log("🔌 Disconnecting WebSocket - không còn authenticated");
          webSocketService.disconnect();
          setWsConnected(false);
          setCurrentUserId(null);
        }
      } else if (userId !== wsState.userId && !wsState.connecting) {
        // User changed, reconnect
        console.log("👤 User changed, reconnecting WebSocket...");
        initWebSocket();
      }
    };

    // Listen for storage changes (login/logout từ tab khác)
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("popstate", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("popstate", handleAuthChange);
    };
  }, []); // ✅ EMPTY DEPENDENCIES - chỉ run 1 lần!

  // Disconnect on app unmount
  useEffect(() => {
    return () => {
      // Mark as unmounting
      initializingRef.current = null;
      webSocketService.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
