import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import notification from "../utils/notification";
class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.connecting = false; // Thêm flag để tránh kết nối đồng thời
    this.currentUserId = null;
    this.notificationCallback = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.connectionPromise = null; // Lưu trữ promise để tránh kết nối trùng lặp
    this.subscriptions = new Map(); // Quản lý các subscriptions
    this.connectionTimeout = null;

    // Bind methods để đảm bảo context
    this.handleConnect = this.handleConnect.bind(this);
    this.handleStompError = this.handleStompError.bind(this);
    this.handleWebSocketError = this.handleWebSocketError.bind(this);
    this.handleWebSocketClose = this.handleWebSocketClose.bind(this);
  }

  async connect(userId, onNotificationReceived) {
    // Kiểm tra nếu đã kết nối cho cùng user
    if (this.connected && this.currentUserId === userId) {
      console.log("🔄 WebSocket đã kết nối sẵn cho user:", userId);
      // Cập nhật callback mới nếu có
      if (onNotificationReceived) {
        this.notificationCallback = onNotificationReceived;
      }
      return Promise.resolve();
    }

    // Kiểm tra nếu đang trong quá trình kết nối
    if (this.connecting && this.connectionPromise) {
      console.log("⏳ WebSocket đang kết nối, chờ completion...");
      return this.connectionPromise;
    }

    // Nếu user khác đăng nhập, disconnect connection cũ
    if (this.connected && this.currentUserId !== userId) {
      console.log("👤 User khác đăng nhập, đang disconnect connection cũ...");
      this.disconnect();
    }

    console.log("🚀 Khởi tạo WebSocket connection cho user:", userId);

    this.connecting = true;
    this.currentUserId = userId;
    this.notificationCallback = onNotificationReceived;

    // Tạo connection promise và lưu trữ để tránh duplicate connections
    this.connectionPromise = new Promise((resolve, reject) => {
      this.connectionTimeout = setTimeout(() => {
        console.error("❌ WebSocket connection timeout");
        this.connecting = false;
        this.connectionPromise = null;
        reject(new Error("WebSocket connection timeout"));
      }, 15000); // Tăng timeout lên 15 giây

      try {
        // Cleanup existing connection
        this.cleanupConnection();

        // Validate token trước khi kết nối
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy authentication token");
        }

        // Debug info
        console.log("🔧 DEBUG - Connection Info:", {
          userId: userId,
          token: token ? `${token.substring(0, 10)}...` : "NO TOKEN",
          endpoint: `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"
          }/ws`,
        });

        // Tạo SockJS connection
        const socket = new SockJS(
          `${process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"}/ws`
        );

        // Add SockJS event listeners để debug
        socket.onopen = () => {
          console.log("✅ SockJS connection opened successfully");
        };

        socket.onerror = (error) => {
          console.error("❌ SockJS connection error:", error);
        };

        socket.onclose = (event) => {
          console.log("🔌 SockJS connection closed:", event.code, event.reason);
        };

        // Tạo STOMP client với config tối ưu
        this.stompClient = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: (str) => {
            if (process.env.NODE_ENV === "development") {
              console.log("🔧 STOMP Debug:", str);
            }
          },
          reconnectDelay: 0, // Disable tự động reconnect của STOMP, dùng logic custom
          heartbeatIncoming: 30000, // 30 giây
          heartbeatOutgoing: 30000, // 30 giây
        });

        // Gán event handlers
        this.stompClient.onConnect = this.handleConnect.bind(
          this,
          resolve,
          reject
        );
        this.stompClient.onStompError = this.handleStompError.bind(
          this,
          resolve,
          reject
        );
        this.stompClient.onWebSocketError = this.handleWebSocketError.bind(
          this,
          resolve,
          reject
        );
        this.stompClient.onWebSocketClose = this.handleWebSocketClose.bind(
          this,
          resolve,
          reject
        );

        // Kích hoạt connection
        this.stompClient.activate();
      } catch (error) {
        this.clearConnectionTimeout();
        this.connecting = false;
        this.connectionPromise = null;
        console.error("❌ Lỗi khi khởi tạo WebSocket:", error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  handleConnect(resolve, reject, frame) {
    console.log("✅ WebSocket Connected successfully:", frame.headers);

    this.clearConnectionTimeout();
    this.connected = true;
    this.connecting = false;
    this.reconnectAttempts = 0;
    this.connectionPromise = null;

    // Subscribe to notifications
    this.subscribeToNotifications();

    resolve();
  }

  handleStompError(resolve, reject, frame) {
    this.clearConnectionTimeout();
    this.connecting = false;
    this.connectionPromise = null;

    const errorMessage = frame.headers["message"] || "Unknown STOMP error";
    console.error("⚠️ STOMP Error:", errorMessage, frame.body);

    this.connected = false;

    // Nếu lỗi authentication, không thử reconnect
    if (
      frame.headers["message"]?.includes("403") ||
      frame.headers["message"]?.includes("Unauthorized")
    ) {
      console.error("❌ Authentication failed, không thể reconnect");
      reject(new Error(`Authentication failed: ${errorMessage}`));
      return;
    }

    // Với các lỗi khác, thử reconnect
    this.scheduleReconnect();
    reject(new Error(`STOMP Error: ${errorMessage}`));
  }

  handleWebSocketError(resolve, reject, error) {
    this.clearConnectionTimeout();
    this.connecting = false;
    this.connectionPromise = null;

    console.error("⚠️ WebSocket Error:", error);
    this.connected = false;

    this.scheduleReconnect();
    // Không reject ngay, để reconnect logic xử lý
  }

  handleWebSocketClose(resolve, reject, event) {
    this.clearConnectionTimeout();
    this.connecting = false;
    this.connectionPromise = null;

    console.log("🔌 WebSocket Connection Closed:", event.code, event.reason);
    this.connected = false;

    // Nếu đóng bình thường (code 1000) hoặc do user logout, không reconnect
    if (event.code === 1000 || !this.currentUserId) {
      console.log("📴 WebSocket closed normally, không reconnect");
      return;
    }

    this.scheduleReconnect();
  }

  subscribeToNotifications() {
    if (!this.stompClient || !this.currentUserId) {
      console.error("❌ Không thể subscribe: missing client hoặc userId");
      return;
    }

    // Subscribe to MATCH, LIKE, và CHAT notifications - match với backend logic mới
    const matchDestination = `/topic/match/${this.currentUserId}`;
    const likeDestination = `/topic/like/${this.currentUserId}`;
    const chatDestination = `/topic/chat/${this.currentUserId}`;

    // ✅ KIỂM TRA NẾU ĐÃ SUBSCRIBE RỒI THÌ KHÔNG SUBSCRIBE NỮA
    if (this.subscriptions.has(matchDestination)) {
      console.log(
        "⚠️ ⚠️ ⚠️ ALREADY SUBSCRIBED! BLOCKED DUPLICATE SUBSCRIPTION!"
      );
      console.log(
        "📊 Current subscriptions:",
        Array.from(this.subscriptions.keys())
      );
      console.log(
        "📍 Called from:",
        new Error().stack.split("\n").slice(1, 4).join("\n")
      );
      return;
    }

    console.log("✅✅✅ CREATING NEW SUBSCRIPTIONS (FIRST TIME)");
    console.log("📡 DEBUG - NEW Subscription Info:", {
      matchDestination: matchDestination,
      likeDestination: likeDestination,
      chatDestination: chatDestination,
      userId: this.currentUserId,
      stompConnected: this.stompClient?.connected,
      hasCallback: !!this.notificationCallback,
    });

    try {
      // Subscribe to MATCH notifications (/topic/match/{userId})
      const matchSubscription = this.stompClient.subscribe(
        matchDestination,
        (message) => {
          console.log("🎉🎉🎉 MATCH MESSAGE RECEIVED:", {
            destination: message.headers?.destination,
            subscriptionId: matchSubscription?.id,
            timestamp: new Date().toISOString(),
          });
          console.log("📍 Message body:", message.body);

          try {
            const notificationData = JSON.parse(message.body);
            console.log("🔔🔔🔔 MATCH NOTIFICATION PARSED:", notificationData);

            // Thêm type để frontend biết đây là MATCH
            notificationData.type = "MATCH";

            // KHÔNG hiển thị notification ở đây - để callback xử lý
            // notification.match(notificationData); // ❌ Bỏ dòng này

            // Kiểm tra callback vẫn valid trước khi gọi
            if (
              this.notificationCallback &&
              typeof this.notificationCallback === "function"
            ) {
              try {
                console.log("🔄 Calling MATCH notification callback...");
                console.log(
                  "📍 MATCH CALLBACK TRACE:",
                  new Error().stack.split("\n")[1]
                );
                this.notificationCallback(notificationData);
                console.log("✅ MATCH Callback executed successfully");
              } catch (callbackError) {
                console.error("❌ Error in MATCH callback:", callbackError);
              }
            } else {
              console.warn("⚠️ No valid MATCH callback available");
            }
          } catch (parseError) {
            console.error("❌ Error parsing MATCH notification:", parseError);
            console.log("📝 Raw MATCH body:", message.body);
          }
        }
      );

      // Subscribe to LIKE notifications (/topic/like/{userId})
      const likeSubscription = this.stompClient.subscribe(
        likeDestination,
        (message) => {
          console.log("💖💖💖 LIKE MESSAGE RECEIVED:", {
            destination: message.headers?.destination,
            subscriptionId: likeSubscription?.id,
            timestamp: new Date().toISOString(),
          });
          console.log("📍 Message body:", message.body);

          try {
            const notificationData = JSON.parse(message.body);
            console.log("🔔🔔🔔 LIKE NOTIFICATION PARSED:", notificationData);

            // Thêm type để frontend biết đây là LIKE
            notificationData.type = "LIKE";

            // KHÔNG hiển thị notification ở đây - để callback xử lý
            // notification.like(notificationData); // ❌ Bỏ dòng này

            // Kiểm tra callback vẫn valid trước khi gọi
            if (
              this.notificationCallback &&
              typeof this.notificationCallback === "function"
            ) {
              try {
                console.log("🔄 Calling LIKE notification callback...");
                this.notificationCallback(notificationData);
                console.log("✅ LIKE Callback executed successfully");
              } catch (callbackError) {
                console.error("❌ Error in LIKE callback:", callbackError);
              }
            } else {
              console.warn("⚠️ No valid LIKE callback available");
            }
          } catch (parseError) {
            console.error("❌ Error parsing LIKE notification:", parseError);
            console.log("📝 Raw LIKE body:", message.body);
          }
        }
      );

      // Subscribe to CHAT notifications (/topic/chat/{userId})
      const chatSubscription = this.stompClient.subscribe(
        chatDestination,
        (message) => {
          console.log("💬 CHAT message received from backend:", {
            headers: message.headers,
            body: message.body,
            destination: message.headers?.destination,
          });

          try {
            const notification = JSON.parse(message.body);
            console.log("🔔🔔🔔 CHAT NOTIFICATION PARSED:", notification);

            // Thêm type để frontend biết đây là CHAT
            notification.type = "CHAT";

            // Kiểm tra callback vẫn valid trước khi gọi
            if (
              this.notificationCallback &&
              typeof this.notificationCallback === "function"
            ) {
              try {
                console.log("🔄 Calling CHAT notification callback...");
                this.notificationCallback(notification);
                console.log("✅ CHAT Callback executed successfully");
              } catch (callbackError) {
                console.error("❌ Error in CHAT callback:", callbackError);
              }
            } else {
              console.warn("⚠️ No valid CHAT callback available");
            }
          } catch (parseError) {
            console.error("❌ Error parsing CHAT notification:", parseError);
            console.log("📝 Raw CHAT body:", message.body);
          }
        }
      );

      console.log(
        "✅ MATCH Subscription created with ID:",
        matchSubscription?.id
      );
      console.log(
        "✅ LIKE Subscription created with ID:",
        likeSubscription?.id
      );
      console.log(
        "✅ CHAT Subscription created with ID:",
        chatSubscription?.id
      );

      // Lưu subscriptions để có thể unsubscribe sau
      this.subscriptions.set(matchDestination, matchSubscription);
      this.subscriptions.set(likeDestination, likeSubscription);
      this.subscriptions.set(chatDestination, chatSubscription);

      console.log("✅✅✅ SUBSCRIPTIONS CREATED SUCCESSFULLY!");
      console.log("📊 Total subscriptions:", this.subscriptions.size);
      console.log("📋 Subscription details:", {
        match: matchSubscription?.id,
        like: likeSubscription?.id,
        chat: chatSubscription?.id,
      });
    } catch (error) {
      console.error("❌ Error subscribing to notifications:", error);
    }
  }

  clearConnectionTimeout() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  cleanupConnection() {
    // Cleanup existing connection và subscriptions
    if (this.stompClient) {
      try {
        // Unsubscribe tất cả subscriptions
        this.subscriptions.forEach((subscription) => {
          subscription.unsubscribe();
        });
        this.subscriptions.clear();

        this.stompClient.deactivate();
      } catch (error) {
        console.error("❌ Error during cleanup:", error);
      }
      this.stompClient = null;
    }

    this.clearConnectionTimeout();
  }

  scheduleReconnect() {
    // Chỉ reconnect nếu còn attempts và có user đăng nhập
    if (
      this.reconnectAttempts >= this.maxReconnectAttempts ||
      !this.currentUserId
    ) {
      console.log("❌ Reached max reconnect attempts hoặc user đã logout");
      return;
    }

    // Không reconnect nếu đang connecting hoặc đã connected
    if (this.connecting || this.connected) {
      return;
    }

    this.reconnectAttempts++;
    const delay =
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1); // Exponential backoff

    console.log(
      `🔄 Scheduling reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
    );

    setTimeout(() => {
      // Double check user còn đăng nhập
      if (
        this.currentUserId &&
        this.notificationCallback &&
        !this.connected &&
        !this.connecting
      ) {
        console.log(
          `🔄 Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
        );

        this.connect(this.currentUserId, this.notificationCallback).catch(
          (error) => {
            console.error("❌ Reconnect failed:", error);
            // scheduleReconnect sẽ được gọi trong error handlers
          }
        );
      }
    }, delay);
  }

  disconnect() {
    console.log("🔌 Disconnecting WebSocket...");

    // Clear state trước
    this.connected = false;
    this.connecting = false;
    this.currentUserId = null;
    this.notificationCallback = null;
    this.reconnectAttempts = 0;
    this.connectionPromise = null;

    // Cleanup connection
    this.cleanupConnection();

    console.log("✅ WebSocket disconnected successfully");
  }

  isConnected() {
    return (
      this.connected &&
      this.stompClient &&
      this.stompClient.connected &&
      !this.connecting
    );
  }

  // Getter để check trạng thái
  getConnectionState() {
    return {
      connected: this.connected,
      connecting: this.connecting,
      userId: this.currentUserId,
      reconnectAttempts: this.reconnectAttempts,
      hasCallback: !!this.notificationCallback,
    };
  }

  // Method để update notification callback mà không cần reconnect
  updateNotificationCallback(callback) {
    if (this.connected) {
      console.log("🔄 Updating notification callback");
      console.log(
        "📊 Current callback:",
        this.notificationCallback ? "EXISTS" : "NULL"
      );
      console.log("📊 New callback:", callback ? "EXISTS" : "NULL");
      this.notificationCallback = callback;
      return true;
    }
    return false;
  }

  // Method để force reconnect (ví dụ khi token refresh)
  forceReconnect() {
    if (this.currentUserId && this.notificationCallback) {
      console.log("🔄 Force reconnecting WebSocket...");
      this.disconnect();
      return this.connect(this.currentUserId, this.notificationCallback);
    }
    return Promise.reject(new Error("No user or callback for reconnection"));
  }

  // Send message method (nếu cần thiết)
  sendMessage(destination, message) {
    if (!this.isConnected()) {
      throw new Error("WebSocket not connected");
    }

    try {
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(message),
      });
      console.log("📤 Message sent to:", destination);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      throw error;
    }
  }

  // Debug methods
  debugConnection() {
    console.log("🔧 === WEBSOCKET DEBUG INFO ===");
    console.log("Connection State:", this.getConnectionState());
    console.log("STOMP Client:", {
      exists: !!this.stompClient,
      connected: this.stompClient?.connected,
      active: this.stompClient?.active,
    });
    console.log("Subscriptions:", Array.from(this.subscriptions.keys()));
    console.log("Current User ID:", this.currentUserId);
    console.log("Has Callback:", !!this.notificationCallback);

    if (this.currentUserId) {
      console.log(
        "Expected MATCH destination:",
        `/topic/match/${this.currentUserId}`
      );
      console.log(
        "Expected LIKE destination:",
        `/topic/like/${this.currentUserId}`
      );
      console.log(
        "Expected CHAT destination:",
        `/topic/chat/${this.currentUserId}`
      );
    }

    // Check localStorage
    console.log("LocalStorage:", {
      token: localStorage.getItem("token") ? "✅ Có" : "❌ Không có",
      userId:
        localStorage.getItem("userId") ||
        localStorage.getItem("user_id") ||
        "❌ Không có",
    });
  }

  // Test subscription manually
  testSubscription() {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("❌ STOMP client not connected");
      return;
    }

    const testDestination = `/user/${this.currentUserId}/queue/test`;
    console.log("🧪 Testing subscription to:", testDestination);

    try {
      const testSub = this.stompClient.subscribe(testDestination, (message) => {
        console.log("🧪 Test message received:", message.body);
      });

      console.log("✅ Test subscription created:", testSub.id);

      // Unsubscribe after 10 seconds
      setTimeout(() => {
        testSub.unsubscribe();
        console.log("🧪 Test subscription removed");
      }, 10000);
    } catch (error) {
      console.error("❌ Test subscription failed:", error);
    }
  }

  // Test notifications manually
  testNotifications() {
    console.log("🧪 Testing notification destinations...");

    if (this.currentUserId) {
      const matchDest = `/topic/match/${this.currentUserId}`;
      const likeDest = `/topic/like/${this.currentUserId}`;
      const chatDest = `/topic/chat/${this.currentUserId}`;

      console.log("🧪 Expected destinations:");
      console.log("  MATCH:", matchDest);
      console.log("  LIKE:", likeDest);
      console.log("  CHAT:", chatDest);

      // Check if subscribed
      console.log("🧪 Current subscriptions:");
      this.subscriptions.forEach((sub, dest) => {
        console.log(`  ${dest}: ${sub.id}`);
      });
    }
  }
}

const webSocketService = new WebSocketService();

// Expose debug methods to global scope for debugging in console
if (typeof window !== "undefined") {
  window.debugWebSocket = {
    debugConnection: () => webSocketService.debugConnection(),
    testNotifications: () => webSocketService.testNotifications(),
    testSubscription: () => webSocketService.testSubscription(),
    forceReconnect: () => webSocketService.forceReconnect(),
    disconnect: () => webSocketService.disconnect(),
    connect: (userId, callback) => webSocketService.connect(userId, callback),
    getState: () => webSocketService.getConnectionState(),
  };
}

export default webSocketService;
