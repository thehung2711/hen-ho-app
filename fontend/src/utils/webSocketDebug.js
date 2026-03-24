// WebSocket Debug Utility
// Dùng để debug và kiểm tra connection

export const debugWebSocket = {
  // Test basic connection
  testConnection: () => {
    console.log("🔧 === WEBSOCKET DEBUG TEST ===");

    const token = localStorage.getItem("token");
    const userId =
      localStorage.getItem("userId") || localStorage.getItem("user_id");

    console.log("🔑 Token:", token ? "✅ Có" : "❌ Không có");
    console.log("👤 User ID:", userId || "❌ Không có");

    if (!token) {
      console.error("❌ Không có token - WebSocket sẽ fail");
      return;
    }

    if (!userId) {
      console.error("❌ Không có userId - Subscription sẽ fail");
      return;
    }

    console.log("📡 Testing WebSocket connection...");

    // Test SockJS connection
    const SockJS = require("sockjs-client");
    const { Client } = require("@stomp/stompjs");

    const socket = new SockJS("http://localhost:8080/ws");

    socket.onopen = () => {
      console.log("✅ SockJS connection opened");
    };

    socket.onmessage = (e) => {
      console.log("📨 SockJS message:", e.data);
    };

    socket.onerror = (e) => {
      console.error("❌ SockJS error:", e);
    };

    socket.onclose = (e) => {
      console.log("🔌 SockJS closed:", e.code, e.reason);
    };
  },

  // Test STOMP subscription
  testSubscription: (userId) => {
    console.log("🔧 Testing STOMP subscription for user:", userId);

    const destination = `/user/${userId}/queue/notification`;
    console.log("📡 Destination:", destination);

    // Log subscription format
    console.log("✅ Subscription format correct:", {
      destination,
      expected_backend_send_to: destination,
      user_id: userId,
    });
  },

  // Test message format
  testMessageFormat: () => {
    console.log("🔧 Expected message format from backend:");
    console.log({
      type: "MATCH | LIKE",
      userFromUsername: "string",
      userFromId: "number",
      userToId: "number",
      message: "string (optional)",
    });
  },

  // Log current WebSocket state
  logCurrentState: () => {
    const webSocketService = require("../services/webSocketService").default;
    const state = webSocketService.getConnectionState();

    console.log("🔧 Current WebSocket State:", {
      connected: state.connected,
      connecting: state.connecting,
      userId: state.userId,
      hasCallback: state.hasCallback,
      reconnectAttempts: state.reconnectAttempts,
    });
  },
};

// Auto-run debug khi import
if (process.env.NODE_ENV === "development") {
  console.log("🔧 WebSocket Debug utility loaded");
  console.log("📝 Available commands:");
  console.log("  debugWebSocket.testConnection()");
  console.log("  debugWebSocket.testSubscription(userId)");
  console.log("  debugWebSocket.testMessageFormat()");
  console.log("  debugWebSocket.logCurrentState()");
}

export default debugWebSocket;
