import React, { useState } from "react";
import { Button, Badge } from "antd";
import {
  HeartOutlined,
  CloseOutlined,
  StarOutlined,
  MessageOutlined,
  FireOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  BookOutlined,
  ManOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TinderCard from "./TinderCard";
import "./Match.css";

const Match = () => {
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data - sẽ thay bằng API sau
  const [users] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 24,
      distance: 2,
      bio: "Love traveling and exploring new cultures. Coffee addict ☕️ Always up for an adventure!",
      images: [
        "https://randomuser.me/api/portraits/women/1.jpg",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      ],
      interests: ["Travel", "Coffee", "Photography", "Hiking", "Art"],
      height: 165,
      university: "Harvard University",
      job: "Marketing Manager",
    },
    {
      id: 2,
      name: "Emma Wilson",
      age: 26,
      distance: 5,
      bio: "Fitness enthusiast 💪 | Dog lover 🐕 Living my best life one workout at a time!",
      images: [
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
      ],
      interests: ["Fitness", "Animals", "Nature", "Yoga", "Running"],
      height: 170,
      university: "Stanford University",
      job: "Personal Trainer",
    },
    {
      id: 3,
      name: "Olivia Brown",
      age: 23,
      distance: 3,
      bio: "Artist | Music lover 🎵 Creating art and spreading good vibes",
      images: [
        "https://randomuser.me/api/portraits/women/3.jpg",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400",
      ],
      interests: ["Art", "Music", "Dancing", "Painting", "Guitar"],
      height: 162,
      university: "NYU",
      job: "Graphic Designer",
    },
  ]);

  const currentUser = users[currentCardIndex];

  const handleLike = () => {
    setSwipeDirection("right");
    setTimeout(() => {
      if (currentCardIndex < users.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentCardIndex(0);
      }
      setSwipeDirection(null);
    }, 300);
  };

  const handleDislike = () => {
    setSwipeDirection("left");
    setTimeout(() => {
      if (currentCardIndex < users.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentCardIndex(0);
      }
      setSwipeDirection(null);
    }, 300);
  };

  const handleSuperLike = () => {
    setSwipeDirection("up");
    setTimeout(() => {
      if (currentCardIndex < users.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentCardIndex(0);
      }
      setSwipeDirection(null);
    }, 300);
  };

  return (
    <div className="match-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <FireOutlined className="logo-icon" />
            <h2>Tinder</h2>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item active">
            <FireOutlined className="menu-icon" />
            <span>Discover</span>
          </div>

          <div className="menu-item" onClick={() => navigate("/matches")}>
            <TeamOutlined className="menu-icon" />
            <Badge count={5} offset={[10, 0]}>
              <span>Likes</span>
            </Badge>
          </div>

          <div className="menu-item" onClick={() => navigate("/messages")}>
            <MessageOutlined className="menu-icon" />
            <Badge count={3} offset={[10, 0]}>
              <span>Messages</span>
            </Badge>
          </div>

          <div className="menu-item" onClick={() => navigate("/register-info")}>
            <UserOutlined className="menu-icon" />
            <span>Profile</span>
          </div>

          <div className="menu-item" onClick={() => navigate("/settings")}>
            <SettingOutlined className="menu-icon" />
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="tinder-cards-container">
          {currentUser && (
            <div
              className={`tinder-card-stack ${
                swipeDirection ? `swipe-${swipeDirection}` : ""
              }`}
            >
              <TinderCard
                user={currentUser}
                onLike={handleLike}
                onDislike={handleDislike}
                onSuperLike={handleSuperLike}
                onShowDetails={() => setShowDetails(true)}
              />
            </div>
          )}

          {/* Background Cards for Stack Effect */}
          {currentCardIndex + 1 < users.length && (
            <div className="background-card card-1">
              <TinderCard
                user={users[currentCardIndex + 1]}
                onLike={() => {}}
                onDislike={() => {}}
                onSuperLike={() => {}}
                onShowDetails={() => {}}
              />
            </div>
          )}
          {currentCardIndex + 2 < users.length && (
            <div className="background-card card-2">
              <TinderCard
                user={users[currentCardIndex + 2]}
                onLike={() => {}}
                onDislike={() => {}}
                onSuperLike={() => {}}
                onShowDetails={() => {}}
              />
            </div>
          )}
        </div>
      </div>

      {/* Detail Overlay - Full Screen */}
      {showDetails && (
        <div className="detail-overlay show">
          <div className="detail-content">
            <div className="detail-header">
              <h2>
                {currentUser.name}, {currentUser.age}
              </h2>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setShowDetails(false)}
                className="close-detail-btn"
              />
            </div>

            {/* Image Gallery */}
            <div className="detail-image-section">
              <div className="detail-images">
                {currentUser.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${currentUser.name} ${index + 1}`}
                    className="detail-image"
                  />
                ))}
              </div>
            </div>

            {/* Bio Section */}
            <div className="detail-section">
              <h3>
                <HeartOutlined /> About {currentUser.name}
              </h3>
              <p className="bio-text">{currentUser.bio}</p>
            </div>

            {/* Basic Info */}
            <div className="detail-section">
              <h3>
                <UserOutlined /> Basic Info
              </h3>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-label">Height</span>
                  <span className="info-value">{currentUser.height} cm</span>
                </div>
                <div className="info-row">
                  <span className="info-label">University</span>
                  <span className="info-value">{currentUser.university}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Job</span>
                  <span className="info-value">{currentUser.job}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Distance</span>
                  <span className="info-value">
                    {currentUser.distance} km away
                  </span>
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="detail-section">
              <h3>
                <FireOutlined /> Interests
              </h3>
              <div className="interests-list">
                {currentUser.interests.map((interest, index) => (
                  <div key={index} className="interest-item">
                    {interest}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Match;
