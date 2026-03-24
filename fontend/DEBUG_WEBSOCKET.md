# 🔍 WebSocket Debug Checklist

## ❓ Tại sao Frontend không nhận được message từ Backend?

### 🔧 Debug Commands (Mở Console và chạy):

```javascript
// 1. Kiểm tra trạng thái kết nối
debugWS.debug();

// 2. Kiểm tra authentication
debugWS.checkAuth();

// 3. Kiểm tra state hiện tại
debugWS.getState();

// 4. Test subscription thủ công
debugWS.testSubscription();

// 5. Test notification UI (không qua WebSocket)
debugWS.testNotification("LIKE");
debugWS.testNotification("MATCH");

// 6. Force reconnect
debugWS.reconnect();

// 7. Kiểm tra global debug WebSocket
debugWebSocket.getInfo();
debugWebSocket.testCallback();
```

### 🎯 Các bước debug theo thứ tự:

#### Bước 1: Kiểm tra Authentication

- [ ] Token có tồn tại? `localStorage.getItem("token")`
- [ ] UserId có tồn tại? `getCurrentUserId()`
- [ ] User đã login chưa? `isAuthenticated()`

#### Bước 2: Kiểm tra WebSocket Connection

- [ ] SockJS connection thành công? (xem console log)
- [ ] STOMP connection thành công?
- [ ] Subscription được tạo?
- [ ] Có lỗi authentication 403/401?

#### Bước 3: Kiểm tra Backend

- [ ] Backend WebSocket server đang chạy?
- [ ] Endpoint `/ws` accessible?
- [ ] CORS configuration đúng?
- [ ] Authentication header được accept?

#### Bước 4: Kiểm tra Message Path

- [ ] Backend gửi đúng destination: `/user/{userId}/queue/notification`?
- [ ] Message format đúng JSON?
- [ ] UserId trong destination khớp với FE?

#### Bước 5: Kiểm tra Callback

- [ ] Notification callback được set?
- [ ] Callback function không bị lỗi?
- [ ] Component không bị unmount?

### 🚨 Các lỗi thường gặp:

1. **"Broker not available"** → Backend WebSocket server chưa start
2. **"403 Forbidden"** → Token invalid hoặc CORS issue
3. **"Connection timeout"** → Network/firewall blocking
4. **"No callback"** → Component unmount trước khi receive message
5. **"Parse error"** → Backend gửi sai format JSON

### 📋 Expected Console Logs (khi thành công):

```
🚀 Khởi tạo WebSocket connection cho user: [userId]
🔧 DEBUG - Connection Info: {...}
✅ SockJS connection opened successfully
✅ WebSocket Connected successfully: {...}
📡 DEBUG - Subscription Info: {...}
✅ Subscription created successfully: [subscriptionId]
```

### 📋 Khi nhận message:

```
🔧 DEBUG - Raw message received: {...}
🔔🔔🔔 PARSED NOTIFICATION: {...}
🔄 Calling notification callback...
✅ Callback executed successfully
🔔 Global notification received: {...}
```

### 🛠️ Quick Fixes:

1. **Restart backend WebSocket server**
2. **Check CORS settings cho /ws endpoint**
3. **Verify authentication token format**
4. **Check user ID consistency giữa FE và BE**
5. **Test với Postman/WebSocket client tool**

### 📞 Test với Backend:

1. Gửi POST request tới backend để trigger notification
2. Check backend logs có gửi message không
3. Verify destination path trong backend code
4. Test authentication headers
