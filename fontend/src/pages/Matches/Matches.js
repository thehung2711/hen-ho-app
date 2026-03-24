import React, { useState } from "react";
import { Card, Avatar, List, Badge, Button, Empty } from "antd";
import {
  MessageOutlined,
  FireOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Matches.css";

const Matches = () => {
  const navigate = useNavigate();

  const [matches] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 24,
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      matchedAt: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      name: "Emma Wilson",
      age: 26,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      matchedAt: "1 day ago",
      unread: false,
    },
    {
      id: 3,
      name: "Olivia Brown",
      age: 23,
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      matchedAt: "3 days ago",
      unread: true,
    },
    {
      id: 4,
      name: "Sophia Davis",
      age: 25,
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      matchedAt: "1 week ago",
      unread: false,
    },
    {
      id: 5,
      name: "Isabella Martinez",
      age: 27,
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      matchedAt: "2 weeks ago",
      unread: false,
    },
  ]);

  return (
    <div className="matches-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <FireOutlined className="logo-icon" />
            <h2>TinderApp</h2>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate("/")}>
            <FireOutlined className="menu-icon" />
            <span>Discover</span>
          </div>

          <div className="menu-item active">
            <TeamOutlined className="menu-icon" />
            <Badge count={matches.length} offset={[10, 0]}>
              <span>Matches</span>
            </Badge>
          </div>

          <div className="menu-item" onClick={() => navigate("/messages")}>
            <MessageOutlined className="menu-icon" />
            <Badge count={3} offset={[10, 0]}>
              <span>Messages</span>
            </Badge>
          </div>

          <div className="menu-item" onClick={() => navigate("/profile")}>
            <UserOutlined className="menu-icon" />
            <span>Profile</span>
          </div>

          <div className="menu-item" onClick={() => navigate("/settings")}>
            <SettingOutlined className="menu-icon" />
            <span>Settings</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => navigate("/profile")}
            className="profile-btn"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="matches-content">
        <div className="matches-header">
          <h1>Your Matches</h1>
          <p>{matches.length} people liked you back!</p>
        </div>

        <div className="matches-grid">
          {matches.map((match) => (
            <Card
              key={match.id}
              className="match-card"
              hoverable
              onClick={() => navigate(`/messages/${match.id}`)}
            >
              <div className="match-image-wrapper">
                <img
                  src={match.image}
                  alt={match.name}
                  className="match-image"
                />
                {match.unread && (
                  <Badge status="success" className="online-badge" />
                )}
              </div>
              <div className="match-info">
                <h3>
                  {match.name}, {match.age}
                </h3>
                <p className="match-time">{match.matchedAt}</p>
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  className="message-btn"
                  block
                >
                  Send Message
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
