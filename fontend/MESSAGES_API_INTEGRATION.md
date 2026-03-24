# 💬 Messages API Integration - Complete Guide

## ✅ Đã Hoàn Thành

### 📡 **API Integration**

- **Endpoint**: `GET /api/messages/{matchId}`
- **Method**: `getMessages(matchId)` đã được thêm vào `matchUserService.js`
- **Location**: `src/api/userService/matchUser.js`

### 🔄 **Flow Logic**

1. **Load Matches**: API `/api/matches` → Display matches list
2. **Click Match**: User click vào một match → `handleMatchSelect(match)`
3. **Load Messages**: `loadMessages(match.id)` → API `/api/messages/{matchId}`
4. **Display Messages**: Transform data và hiển thị chat interface

### 📊 **API Response Handling**

#### **Case 1: Code 204 - No Messages**

```json
{
  "code": 204,
  "message": "No messages found",
  "result": null
}
```

→ **UI**: Hiển thị empty chat (không có tin nhắn)

#### **Case 2: Code 200 - Has Messages**

```json
{
  "code": 200,
  "message": "OK",
  "result": [
    {
      "matchId": 1,
      "senderId": 3,
      "senderName": "Vu Duy le",
      "content": "Hello, test message",
      "sentAt": "2025-11-02T23:40:47.086672",
      "read": false
    }
  ]
}
```

### 🎨 **Data Transformation**

**API Response** → **UI Format**:

```javascript
// API Format
{
    "matchId": 1,
    "senderId": 3,
    "senderName": "Vu Duy le",
    "content": "Hello, test message",
    "sentAt": "2025-11-02T23:40:47.086672",
    "read": false
}

// Transformed to UI Format
{
    id: index + 1,                    // Sequential ID for UI
    matchId: msg.matchId,             // Keep original matchId
    senderId: msg.senderId,           // Keep senderId
    senderName: msg.senderName,       // Keep sender name
    message: msg.content,             // content → message
    timestamp: "23:40",               // Format sentAt to HH:MM
    isOwn: (senderId === currentUserId), // ⭐ KEY LOGIC
    read: msg.read,                   // Keep read status
    sentAt: msg.sentAt               // Keep original timestamp
}
```

### 🎯 **Key Logic: Sender Detection**

```javascript
// Get current user ID từ localStorage/token
const currentUserId = getCurrentUserId();

// Xác định ai là người gửi
const isCurrentUserSender = msg.senderId === parseInt(currentUserId);

// Set UI flag
isOwn: isCurrentUserSender;
// → true: Tin nhắn của mình (hiển thị bên phải)
// → false: Tin nhắn của đối phương (hiển thị bên trái)
```

### 💬 **UI Display Logic**

```jsx
// Trong chat interface
{
  messages.map((msg) => (
    <div key={msg.id} className={msg.isOwn ? "own-message" : "other-message"}>
      {/* Nếu isOwn = true → styling cho tin nhắn của mình */}
      {/* Nếu isOwn = false → styling cho tin nhắn của đối phương */}

      {!msg.isOwn && <span className="sender-name">{msg.senderName}</span>}
      <div className="message-content">{msg.message}</div>
      <span className="timestamp">{msg.timestamp}</span>
    </div>
  ));
}
```

### 🔧 **Files Modified**

#### 1. **`src/api/userService/matchUser.js`**

```javascript
// Added new method
getMessages: (matchId) => {
  console.log("🌐🌐🌐 API SERVICE: GET MESSAGES");
  console.log("📡 URL: GET /messages/" + matchId);
  console.log("📋 Params: matchId:", matchId);
  return apiClient.get(`/messages/${matchId}`);
};
```

#### 2. **`src/features/match/Match.js`**

- **Import**: Added `getCurrentUserId` from auth utils
- **Function**: Updated `loadMessages(matchId)` (line 179-250)
- **Features**:
  - ✅ Real API call thay vì mock data
  - ✅ Handle code 200 & 204 responses
  - ✅ Sender detection logic
  - ✅ Time formatting (ISO → HH:MM)
  - ✅ Error handling với notifications
  - ✅ Console logging để debug

### 🧪 **Testing Steps**

#### **Frontend Test:**

1. **Start app**: `npm start`
2. **Login**: Đảm bảo có token valid
3. **Open Messages**: Click Messages button → Load matches list
4. **Click Match**: Click vào một match item → API call triggered
5. **Check Console**: Xem logs để debug
6. **Check Network**: Verify `/api/messages/{matchId}` requests

#### **Backend Test Required:**

```bash
# Test API manually
curl -X GET "http://localhost:8080/api/messages/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 🎯 **Expected Behavior**

#### **Scenario 1: Match có messages**

1. Click match → Loading spinner
2. API returns code 200 với messages
3. Transform data với `isOwn` logic
4. Display chat interface với messages
5. Tin nhắn của mình bên phải, của đối phương bên trái

#### **Scenario 2: Match chưa có messages**

1. Click match → Loading spinner
2. API returns code 204
3. Display empty chat interface
4. Ready để send first message

#### **Scenario 3: Error cases**

- **404**: Match không exist → Warning notification
- **401**: Token expired → Error notification
- **Network**: Connection failed → Error notification

### 🐛 **Debug Commands**

```javascript
// Check current user ID
console.log("Current User:", getCurrentUserId());

// Check auth state
window.debugWS.checkAuth();

// Manual API test
fetch("/api/messages/1", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
  .then((r) => r.json())
  .then(console.log);
```

### 📱 **UI States**

#### **Loading State**

```jsx
{
  messagesLoading && <Spin />;
}
```

#### **Empty State (Code 204)**

```jsx
{
  messages.length === 0 && <Empty description="Chưa có tin nhắn nào" />;
}
```

#### **Messages Display (Code 200)**

```jsx
{
  messages.map((msg) => (
    <div className={`message ${msg.isOwn ? "own" : "other"}`}>
      {/* Message content với styling based on isOwn */}
    </div>
  ));
}
```

### 🔄 **Data Flow Summary**

```
1. User clicks match item
   ↓
2. handleMatchSelect(match) called
   ↓
3. loadMessages(match.id) triggered
   ↓
4. API GET /messages/{matchId}
   ↓
5. Check response code:
   • 204 → setMessages([])
   • 200 → Transform data with isOwn logic
   ↓
6. Update UI với new messages
   ↓
7. Display chat interface
```

### ✨ **Key Features**

- ✅ **Smart Sender Detection**: Automatically detect own vs other messages
- ✅ **Flexible Response Handling**: Support both empty (204) and populated (200) states
- ✅ **Time Formatting**: ISO timestamp → Human readable format
- ✅ **Error Resilience**: Graceful error handling với user feedback
- ✅ **Debug Friendly**: Comprehensive console logging
- ✅ **UI Consistency**: Maintains existing chat interface design

---

**🎉 Messages Integration Complete!**  
Giờ chat feature đã fully integrated với backend API `/api/messages/{matchId}`
