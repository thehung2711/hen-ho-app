import React, { useState, useEffect } from "react";
import {
  Button,
  Avatar,
  Card,
  Empty,
  Spin,
  Row,
  Col,
  Typography,
  Modal,
  Input,
  List,
  Badge,
} from "antd";
import {
  MessageOutlined,
  ProfileOutlined,
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
  EyeInvisibleOutlined,
  HeartFilled,
  CloseOutlined,
  StarFilled,
  HeartOutlined,
  UserOutlined,
  EyeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import TinderCard from "./TinderCard";
import { useNavigate } from "react-router-dom";
import matchUserService from "../../api/userService/matchUser";
import notification from "../../utils/notification";
import { getCurrentUserId } from "../../utils/auth";
import webSocketService from "../../services/webSocketService";
import "./Match.css";

const Match = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    try {
      console.log("🔒 Đang đăng xuất...");
      localStorage.clear();
    } catch (err) {
      console.warn("Lỗi khi xóa localStorage:", err);
    }
    navigate("/");
  };

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showNoUsersMessage, setShowNoUsersMessage] = useState(false);

  // Likes feature states
  const [showLikesOverlay, setShowLikesOverlay] = useState(false);
  const [usersWhoLikedMe, setUsersWhoLikedMe] = useState([]);
  const [likesLoading, setLikesLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Messages feature states
  const [showMessagesOverlay, setShowMessagesOverlay] = useState(false);
  const [matches, setMatches] = useState([]);
  const [matchesLoaded, setMatchesLoaded] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Transform API data
  const transformUserData = (apiUsers) => {
    return apiUsers.map((user) => ({
      id: user.userId,
      name: user.fullName,
      age: user.age || 25,
      distance: `${user.distanceKm.toFixed(1)} km`,
      images: user.imagesList || [],
      bio: user.bio || "Chưa có giới thiệu",
      company: user.company || "Không xác định",
      school: user.school || "Không xác định",
      interests: user.interestsList || [],
      tall: user.tall,
      location: user.location,
      finalScore: user.finalScore,
      verified: Math.random() > 0.5,
    }));
  };

  // Load users who liked me
  const loadUsersWhoLikedMe = async () => {
    setLikesLoading(true);
    try {
      const response = await matchUserService.getUsersWhoLikedMe();
      if (response && response.data.result && Array.isArray(response.data.result)) {
        setUsersWhoLikedMe(response.data.result);
      } else {
        setUsersWhoLikedMe([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người thích bạn:", error);
      setUsersWhoLikedMe([]);
    } finally {
      setLikesLoading(false);
    }
  };

  // Show user detail modal
  const handleShowUserDetail = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Handle like back action
  const handleLikeBack = async (user) => {
    try {
      await matchUserService.likeUser(user.userId);
      setUsersWhoLikedMe((prev) => prev.filter((u) => u.userId !== user.userId));
      setShowUserModal(false);
      console.log(`Đã thích lại ${user.fullName}`);
    } catch (error) {
      console.error("Lỗi khi thích lại:", error);
    }
  };

  // Load unread match count
  const loadUnreadMatchCount = async () => {
    try {
      const response = await matchUserService.getUnreadMatchCount();
      if (response && response.data && response.data.code === 200) {
        const unreadCount = response.data.result || 0;
        setTotalUnreadCount(unreadCount);
        if (unreadCount > 0) setHasNewMessage(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải số tin nhắn chưa đọc:", error);
    }
  };

  // Load matches
  const loadMatches = async () => {
    setMessagesLoading(true);
    try {
      const response = await matchUserService.getMatches();
      if (response && response.data && response.data.code === 200) {
        const apiMatches = response.data.result || [];
        const transformedMatches = apiMatches.map((match) => {
          let formattedLastMessageTime = null;
          if (match.lastMessageTime) {
            const date = new Date(match.lastMessageTime);
            formattedLastMessageTime = date.toLocaleString("vi-VN", {
              day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
            });
          }
          return {
            id: match.matchId,
            userId: match.userId,
            fullName: match.fullName,
            avatar: match.avatarUrl,
            lastMessage: match.lastMessage || "Chưa có tin nhắn",
            lastMessageTime: formattedLastMessageTime,
            unreadCount: match.numberOfMessDontSend || 0,
            isRead: match.isRead !== undefined ? match.isRead : true,
          };
        });
        setMatches(transformedMatches);
        setMatchesLoaded(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách ghép đôi:", error);
      setMatches([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Load messages
  const loadMessages = async (matchId) => {
    try {
      const response = await matchUserService.getMessages(matchId);
      if (response && response.data) {
        const { code, result } = response.data;
        if (code === 204) {
          setMessages([]);
          return;
        }
        if (code === 200 && result) {
          const currentUserId = getCurrentUserId();
          const transformedMessages = result.map((msg, index) => {
            const isCurrentUserSender = msg.senderId === parseInt(currentUserId);
            let formattedTime = "";
            if (msg.sentAt) {
              const date = new Date(msg.sentAt);
              formattedTime = date.toLocaleString("vi-VN", {
                day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
              });
            }
            return {
              id: index + 1,
              matchId: msg.matchId,
              senderId: msg.senderId,
              senderName: msg.senderName,
              message: msg.content,
              timestamp: formattedTime,
              isOwn: isCurrentUserSender,
              read: msg.read,
              sentAt: msg.sentAt,
            };
          });
          setMessages(transformedMessages);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải tin nhắn:", error);
      setMessages([]);
    }
  };

  // Handle match selection
  const handleMatchSelect = async (match) => {
    setSelectedMatch(match);
    loadMessages(match.id);
    if (match.unreadCount > 0 || !match.isRead) {
      try {
        await matchUserService.markMessagesAsRead(match.id);
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
      }
      setMatches((prev) => prev.map((m) => m.id === match.id ? { ...m, unreadCount: 0, isRead: true } : m));
      setTotalUnreadCount((prev) => Math.max(0, prev - 1));
      if (totalUnreadCount <= 1) setHasNewMessage(false);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;
    const messageContent = newMessage.trim();
    const currentUserId = getCurrentUserId();
    try {
      await matchUserService.sendMessage({
        matchId: selectedMatch.id,
        receiverId: selectedMatch.userId,
        content: messageContent,
      });
      const formattedTime = new Date().toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
      });
      const sentMessage = {
        id: Date.now(),
        matchId: selectedMatch.id,
        senderId: parseInt(currentUserId),
        senderName: "Bạn",
        message: messageContent,
        timestamp: formattedTime,
        isOwn: true,
        read: false,
        sentAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
      setMatches((prev) => prev.map((match) =>
        match.id === selectedMatch.id ? { ...match, lastMessage: messageContent, lastMessageTime: formattedTime, unreadCount: 0 } : match
      ));
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await matchUserService.getUserSuitable();
        if (response && response.data && response.data.result) {
          const transformedUsers = transformUserData(response.data.result);
          setUsers(transformedUsers);
          setTotalUsers(transformedUsers.length);
          if (transformedUsers.length === 0) setShowNoUsersMessage(true);
        } else {
          setUsers([]);
          setTotalUsers(0);
          setShowNoUsersMessage(true);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    loadUnreadMatchCount();
  }, []);

  // Handle incoming chat messages
  useEffect(() => {
    const handleChatNotification = (event) => {
      const notificationData = event.detail;
      if (notificationData.type === "CHAT") {
        const { senderId, senderName, content, matchId } = notificationData;
        const formattedTime = new Date().toLocaleString("vi-VN", {
          day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
        });
        const newChatMessage = {
          id: Date.now(), matchId, senderId, senderName, message: content, timestamp: formattedTime, isOwn: false, read: false, sentAt: new Date().toISOString(),
        };
        if (selectedMatch && selectedMatch.id === matchId) {
          setMessages((prev) => [...prev, newChatMessage]);
          matchUserService.markMessagesAsRead(matchId).then(() => {
            setMatches((prev) => prev.map((m) => m.id === matchId ? { ...m, lastMessage: content, lastMessageTime: formattedTime, unreadCount: 0, isRead: true } : m));
          }).catch(console.error);
        } else {
          if (matchesLoaded) {
            const targetMatch = matches.find((m) => m.id === matchId);
            const shouldIncrementCount = targetMatch && targetMatch.isRead && targetMatch.unreadCount === 0;
            setMatches((prev) => prev.map((match) => match.id === matchId ? { ...match, lastMessage: content, lastMessageTime: formattedTime, unreadCount: (match.unreadCount || 0) + 1, isRead: false } : match));
            if (shouldIncrementCount) setTotalUnreadCount((prev) => prev + 1);
          }
          setHasNewMessage(true);
          setTimeout(() => setHasNewMessage(false), 3000);
        }
      }
    };
    window.addEventListener("chatNotification", handleChatNotification);
    return () => window.removeEventListener("chatNotification", handleChatNotification);
  }, [selectedMatch, matches, matchesLoaded]);

  useEffect(() => {
    if (totalUnreadCount === 0) setHasNewMessage(false);
  }, [totalUnreadCount]);

  // Handlers
  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await matchUserService.likeUser(currentUser.id);
      removeCurrentUser("👍 Đã thích");
    } catch (error) {
      console.error("Lỗi khi thích người dùng:", error);
      removeCurrentUser("👍 Đã thích");
    }
  };

  const handleDislike = async () => {
    if (!currentUser) return;
    try {
      await matchUserService.dislikeUser(currentUser.id);
      removeCurrentUser("👎 Đã bỏ qua");
    } catch (error) {
      console.error("Lỗi khi bỏ qua người dùng:", error);
      removeCurrentUser("👎 Đã bỏ qua");
    }
  };

  const handleSuperLike = async () => {
    if (!currentUser) return;
    try {
      await matchUserService.likeUser(currentUser.id);
      removeCurrentUser("⭐ Siêu thích");
    } catch (error) {
      console.error("Lỗi khi siêu thích:", error);
      removeCurrentUser("⭐ Siêu thích");
    }
  };

  const removeCurrentUser = (action) => {
    const updatedUsers = users.filter((_, index) => index !== currentCardIndex);
    setUsers(updatedUsers);
    if (currentCardIndex >= updatedUsers.length && updatedUsers.length > 0) {
      setCurrentCardIndex(updatedUsers.length - 1);
    }
    setShowDetail(false);
    if (updatedUsers.length === 0) setShowNoUsersMessage(true);
  };

  const currentUser = users[currentCardIndex];

  return (
    <div className="match-container">
      {loading && (
        <div className="overlay-backdrop">
          <div className="overlay-content">
            <div className="loading-spinner"></div>
            <h2>Đang tìm kiếm...</h2>
            <p>Chúng tôi đang tìm những người phù hợp với bạn trong khu vực</p>
          </div>
        </div>
      )}

      {showDetail && <div className="detail-backdrop" onClick={() => setShowDetail(false)} />}

      <div className="match-content">
        {/* Task Bar Left */}
        <div className="task-bar-left">
          <div className="task-bar-items">
            <div className="task-item active" title="Khám phá">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4458">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            <div
              className={`task-item ${showMessagesOverlay ? "active" : ""} ${hasNewMessage ? "new-message-pulse" : ""} ${totalUnreadCount > 0 ? "has-unread-messages" : ""}`}
              title="Tin nhắn"
              onClick={() => {
                setShowMessagesOverlay(!showMessagesOverlay);
                setHasNewMessage(false);
                if (!showMessagesOverlay) loadMatches();
              }}
              style={{ position: "relative" }}
            >
              {hasNewMessage && <div className="message-ring-effect"></div>}
              <svg
                width="24" height="24" viewBox="0 0 24 24"
                fill={showMessagesOverlay ? "#ff4458" : totalUnreadCount > 0 ? "#ff6b7a" : "#ccc"}
                className={hasNewMessage ? "message-icon-bounce" : ""}
              >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              {totalUnreadCount > 0 && <Badge count={totalUnreadCount} size="small" className={hasNewMessage ? "badge-bounce" : ""} style={{ position: "absolute", top: "-5px", right: "-5px" }} />}
            </div>

            <div
              className={`task-item ${showLikesOverlay ? "active" : ""}`}
              title="Lượt thích"
              onClick={() => {
                setShowLikesOverlay(!showLikesOverlay);
                if (!showLikesOverlay) loadUsersWhoLikedMe();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={showLikesOverlay ? "#ff4458" : "#ccc"}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          <div className="task-bar-bottom">
            <div className="task-item" title="Cài đặt" onClick={() => navigate("/settings")}>
              <SettingOutlined style={{ fontSize: "24px", color: "#ccc" }} />
            </div>
            <div className="task-item" title="Đăng xuất" onClick={handleLogout}>
              <CloseOutlined style={{ fontSize: "20px", color: "#ccc" }} />
            </div>
            <div className="task-item" title="Hồ sơ" onClick={() => navigate("/profile")}>
              <Avatar size={32} icon={<UserOutlined />} />
            </div>
          </div>
        </div>

        <div className="card-stack">
          {currentCardIndex + 1 < users.length && (
            <div className="background-card card-1">
              <TinderCard user={users[currentCardIndex + 1]} onLike={() => {}} onDislike={() => {}} onSuperLike={() => {}} onShowDetails={() => {}} />
            </div>
          )}
          {currentCardIndex + 2 < users.length && (
            <div className="background-card card-2">
              <TinderCard user={users[currentCardIndex + 2]} onLike={() => {}} onDislike={() => {}} onSuperLike={() => {}} onShowDetails={() => {}} />
            </div>
          )}
          <div className={`main-card ${showDetail ? "detail-mode" : ""}`}>
            {currentUser ? (
              <TinderCard user={currentUser} onLike={handleLike} onDislike={handleDislike} onSuperLike={handleSuperLike} onShowDetails={() => setShowDetail(true)} scrollMode={showDetail} />
            ) : (
              <div className="empty-card">
                <div className="empty-card-content">
                  <div className="empty-icon">💫</div>
                  <h3>Đang chờ...</h3>
                  <p>Sẵn sàng khám phá những người mới</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="nav-items">
          <div className="nav-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4458">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Khám phá</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/messages")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ccc">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span>Tin nhắn</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/profile")}>
            <RightOutlined style={{ fontSize: "24px", color: "#ccc" }} />
            <span>Hồ sơ</span>
          </div>
        </div>
      </div>

      {showLikesOverlay && (
        <div className="likes-overlay">
          <div className="likes-container">
            <div className="likes-header">
              <Button type="text" icon={<LeftOutlined />} onClick={() => setShowLikesOverlay(false)} className="likes-back-btn" />
              <Typography.Title level={4} className="likes-title">Người đã thích bạn</Typography.Title>
              <div style={{ width: 32 }} />
            </div>
            <div className="likes-content">
              {likesLoading ? (
                <div className="likes-loading"><Spin size="large" /><Typography.Text>Đang tải...</Typography.Text></div>
              ) : usersWhoLikedMe.length === 0 ? (
                <div className="likes-empty"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có ai thích bạn" /></div>
              ) : (
                <Row gutter={[16, 16]} className="likes-grid">
                  {usersWhoLikedMe.map((user, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={user.userId || index}>
                      <Card
                        hoverable className="like-card"
                        cover={<div className="like-card-image"><img alt={user.fullName} src={user.imagesList?.[0] || "data:image/svg+xml;..."} /><div className="like-card-overlay"><Button type="primary" shape="round" onClick={(e) => { e.stopPropagation(); handleShowUserDetail(user); }} className="view-detail-btn">Xem chi tiết</Button></div></div>}
                        onClick={() => handleShowUserDetail(user)}
                      >
                        <Card.Meta title={<div className="like-card-title"><span>{user.fullName}</span><span className="like-card-age">{user.age}</span></div>} description={<div className="like-card-description"><Typography.Text type="secondary">📍 {user.distanceKm ? `${user.distanceKm.toFixed(1)} km` : "Không xác định"}</Typography.Text></div>} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </div>
        </div>
      )}

      {showNoUsersMessage && !loading && (
        <div className="no-users-overlay">
          <div className="no-users-content">
            <div className="no-users-icon">📍</div>
            <h2>Hết người trong khu vực!</h2>
            <p>Hãy điều chỉnh lại khoảng cách hoặc độ tuổi để tìm thêm người mới.</p>
            <div className="overlay-buttons">
              <Button type="primary" onClick={() => navigate("/settings")} style={{ background: "linear-gradient(135deg, #ff4458 0%, #ff6b7a 100%)", border: "none", marginRight: "12px" }}>Cài đặt khám phá</Button>
              <Button type="default" onClick={() => window.location.reload()}>Tải lại</Button>
            </div>
          </div>
        </div>
      )}

      {showMessagesOverlay && (
        <div className="messages-overlay">
          <div className="messages-container">
            <div className="messages-header">
              <Button type="text" icon={<LeftOutlined />} onClick={() => { setShowMessagesOverlay(false); setSelectedMatch(null); }} className="messages-back-btn" />
              <Typography.Title level={4} className="messages-title">Tin nhắn</Typography.Title>
              <div style={{ width: 32 }} />
            </div>
            <div className="messages-content">
              {messagesLoading ? (
                <div className="messages-loading"><Spin size="large" /><Typography.Text>Đang tải...</Typography.Text></div>
              ) : (
                <div className="messages-layout">
                  <div className={`matches-list ${selectedMatch ? "with-chat" : ""}`}>
                    {matches.length === 0 ? (
                      <div className="matches-empty"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có ghép đôi nào" /></div>
                    ) : (
                      <List dataSource={matches} renderItem={(match) => (
                        <List.Item className={`match-item ${selectedMatch?.id === match.id ? "selected" : ""} ${match.unreadCount > 0 ? "has-unread" : ""}`} onClick={() => handleMatchSelect(match)}>
                          <List.Item.Meta avatar={<Badge count={match.unreadCount} size="small"><Avatar size={50} src={match.avatar} /></Badge>} title={<span className="match-name">{match.fullName}</span>} description={<div className="match-message"><span className="last-message">{match.lastMessage}</span><span className="message-time">{match.lastMessageTime}</span></div>} />
                        </List.Item>
                      )} />
                    )}
                  </div>
                  {selectedMatch && (
                    <div className="chat-area">
                      <div className="chat-header"><Avatar size={40} src={selectedMatch.avatar} /><div className="chat-user-info"><Typography.Text strong>{selectedMatch.fullName}</Typography.Text><Typography.Text type="secondary" className="chat-status">Đang hoạt động</Typography.Text></div></div>
                      <div className="chat-messages">{messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.isOwn ? "own" : "other"}`}><div className="message-bubble"><span className="message-text">{msg.message}</span><span className="message-timestamp">{msg.timestamp}</span></div></div>
                      ))}</div>
                      <div className="chat-input"><Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Nhập tin nhắn..." onPressEnter={handleSendMessage} suffix={<Button type="text" icon={<SendOutlined />} onClick={handleSendMessage} disabled={!newMessage.trim()} />} /></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal title={null} open={showUserModal} onCancel={() => setShowUserModal(false)} footer={null} width={400} className="user-detail-modal" centered getContainer={false} zIndex={3000}>
        {selectedUser && (
          <div className="user-detail-content">
            <div className="user-detail-images">
              {selectedUser.imagesList?.length > 0 ? (
                <div className="image-carousel"><img src={selectedUser.imagesList[0]} alt={selectedUser.fullName} className="main-image" /></div>
              ) : (
                <div className="no-image-placeholder"><div className="placeholder-icon">👤</div><span>Không có ảnh</span></div>
              )}
            </div>
            <div className="user-detail-info">
              <div className="user-basic-info"><Typography.Title level={3} className="user-name">{selectedUser.fullName}<span className="user-age">, {selectedUser.age}</span></Typography.Title><div className="user-location"><Typography.Text type="secondary">📍 {selectedUser.distanceKm ? `${selectedUser.distanceKm.toFixed(1)} km` : "Không xác định"}</Typography.Text></div></div>
              {selectedUser.bio && <div className="user-bio"><Typography.Paragraph>{selectedUser.bio}</Typography.Paragraph></div>}
              <div className="user-additional-info">
                {selectedUser.company && <div className="info-item"><Typography.Text strong>🏢 Công ty: </Typography.Text><Typography.Text>{selectedUser.company}</Typography.Text></div>}
                {selectedUser.school && <div className="info-item"><Typography.Text strong>🎓 Trường học: </Typography.Text><Typography.Text>{selectedUser.school}</Typography.Text></div>}
                {selectedUser.tall && <div className="info-item"><Typography.Text strong>📏 Chiều cao: </Typography.Text><Typography.Text>{selectedUser.tall} cm</Typography.Text></div>}
              </div>
              <div className="user-detail-actions">
                <Button type="default" size="large" onClick={() => setShowUserModal(false)}>Bỏ qua</Button>
                <Button type="primary" size="large" onClick={() => handleLikeBack(selectedUser)}>Thích lại</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Match;
