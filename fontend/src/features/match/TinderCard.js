import React, { useState, useRef } from "react";
import {
  HeartFilled,
  CloseOutlined,
  StarFilled,
  UndoOutlined,
  ThunderboltFilled,
  InfoCircleOutlined,
  EnvironmentOutlined,
  BookOutlined,
  ManOutlined,
  BulbOutlined,
  UserOutlined,
  FireOutlined,
} from "@ant-design/icons";
import "./TinderCard.css";

const TinderCard = ({
  user,
  onLike,
  onDislike,
  onSuperLike,
  onShowDetails,
  scrollMode = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardRef = useRef(null);

  const handleTapLeft = (e) => {
    e.stopPropagation();
    if (isDragging || scrollMode) return;
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleTapRight = (e) => {
    e.stopPropagation();
    if (isDragging || scrollMode) return;
    if (currentImageIndex < user.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Swipe handling functions
  const handleMouseDown = (e) => {
    if (scrollMode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scrollMode) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setDragPosition({ x: deltaX, y: deltaY });

    // Calculate rotation based on horizontal movement
    const rotation = deltaX * 0.1;

    // Update CSS variables
    if (cardRef.current) {
      cardRef.current.style.setProperty("--drag-x", `${deltaX}px`);
      cardRef.current.style.setProperty("--drag-rotation", `${rotation}deg`);

      // Calculate opacity for overlays
      const opacity = Math.min(Math.abs(deltaX) / 100, 1);
      cardRef.current.style.setProperty("--swipe-opacity", opacity);

      // Determine swipe direction
      if (Math.abs(deltaY) > 50 && deltaY < 0) {
        setSwipeDirection("up");
      } else if (deltaX > 30) {
        setSwipeDirection("right");
      } else if (deltaX < -30) {
        setSwipeDirection("left");
      } else {
        setSwipeDirection(null);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || scrollMode) return;

    setIsDragging(false);

    const deltaX = dragPosition.x;
    const deltaY = dragPosition.y;

    // Determine if swipe was strong enough
    if (Math.abs(deltaX) > 100) {
      if (deltaX > 0) {
        // Swipe right - Like
        if (cardRef.current && cardRef.current.classList) {
          cardRef.current.classList.add("swipe-right");
          setTimeout(() => onLike(), 300);
        }
      } else {
        // Swipe left - Dislike
        if (cardRef.current && cardRef.current.classList) {
          cardRef.current.classList.add("swipe-left");
          setTimeout(() => onDislike(), 300);
        }
      }
    } else if (Math.abs(deltaY) > 100 && deltaY < 0) {
      // Swipe up - Super Like
      if (cardRef.current && cardRef.current.classList) {
        cardRef.current.classList.add("swipe-up");
        setTimeout(() => onSuperLike(), 300);
      }
    } else {
      // Bounce back
      if (cardRef.current && cardRef.current.classList) {
        const cardElement = cardRef.current; // Store reference
        cardElement.classList.add("bounce-back");
        setTimeout(() => {
          if (cardElement && cardElement.classList) {
            cardElement.classList.remove("bounce-back");
          }
        }, 300);
      }
    }

    // Reset states
    setDragPosition({ x: 0, y: 0 });
    setSwipeDirection(null);

    // Reset CSS variables
    if (cardRef.current) {
      cardRef.current.style.setProperty("--drag-x", "0px");
      cardRef.current.style.setProperty("--drag-rotation", "0deg");
      cardRef.current.style.setProperty("--swipe-opacity", "0");
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    if (scrollMode) return;
    const touch = e.touches[0];
    handleMouseDown({
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => {},
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || scrollMode) return;
    const touch = e.touches[0];
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Get dynamic class names
  const getCardClassName = () => {
    let className = `tinder-card ${scrollMode ? "scroll-mode" : ""}`;

    if (isDragging) {
      className += " swiping";
      if (swipeDirection === "right") className += " swipe-right-preview";
      if (swipeDirection === "left") className += " swipe-left-preview";
      if (swipeDirection === "up") className += " swipe-up-preview";
    }

    return className;
  };

  return (
    <div
      ref={cardRef}
      className={getCardClassName()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main card image */}
      <div className="tinder-card-image-container">
        <img
          src={user.images[currentImageIndex]}
          alt={user.name}
          className="tinder-card-image"
        />

        {/* Swipe Overlays */}
        <div className="swipe-overlay like-overlay">THÍCH</div>
        <div className="swipe-overlay nope-overlay">BỎ QUA</div>
        <div className="swipe-overlay super-like-overlay">SIÊU THÍCH</div>

        {/* Tap zones for navigation */}
        <div className="tap-zone tap-left" onClick={handleTapLeft} />
        <div className="tap-zone tap-right" onClick={handleTapRight} />

        {/* Photo progress bars */}
        <div className="photo-progress-bars">
          {user.images.map((_, index) => (
            <div
              key={index}
              className={`progress-bar ${
                index === currentImageIndex
                  ? "active"
                  : index < currentImageIndex
                  ? "completed"
                  : ""
              }`}
            />
          ))}
        </div>

        {/* Profile info button */}
        <button
          className="profile-info-button"
          onClick={(e) => {
            e.stopPropagation();
            onShowDetails();
          }}
        >
          <InfoCircleOutlined />
        </button>

        {/* User info overlay */}
        <div className="user-info-overlay">
          <div className="user-basic-info">
            <div className="user-name-age">
              <span className="user-name">{user.name}</span>
              <span className="user-age">{user.age}</span>
            </div>
            <div className="user-distance">
              <EnvironmentOutlined />
              <span>{user.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content for detail view - giống y hệt modal user-detail */}
      {scrollMode && (
        <div className="scroll-content">
          {/* Main Image - có thể scroll */}
          <div className="scroll-image-container">
            <img
              src={user.images[0]}
              alt={user.name}
              className="scroll-main-image"
            />
          </div>

          {/* User Info - giống user-detail-info */}
          <div className="user-detail-info">
            <div className="user-basic-info">
              <h3 className="user-name">
                {user.name}
                <span className="user-age">, {user.age}</span>
              </h3>

              <div className="user-location">
                <span>📍 {user.distance}</span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="user-bio">
                <p>{user.bio}</p>
              </div>
            )}

            {/* Additional Info */}
            <div className="user-additional-info">
              {user.company && (
                <div className="info-item">
                  <span>
                    <strong>🏢 Công ty: </strong>
                  </span>
                  <span>{user.company}</span>
                </div>
              )}

              {user.school && (
                <div className="info-item">
                  <span>
                    <strong>🎓 Trường học: </strong>
                  </span>
                  <span>{user.school}</span>
                </div>
              )}

              {user.tall && (
                <div className="info-item">
                  <span>
                    <strong>📏 Chiều cao: </strong>
                  </span>
                  <span>{user.tall} cm</span>
                </div>
              )}

              {user.location && (
                <div className="info-item">
                  <span>
                    <strong>🏠 Vị trí: </strong>
                  </span>
                  <span>{user.location}</span>
                </div>
              )}
            </div>

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div className="user-interests">
                <span>
                  <strong>💫 Sở thích:</strong>
                </span>
                <div className="interests-tags">
                  {user.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {user.images && user.images.length > 0 && (
              <div className="user-photos">
                <span>
                  <strong>📷 Tất cả ảnh ({user.images.length}):</strong>
                </span>
                <div className="photo-grid">
                  {user.images.map((image, index) => (
                    <div key={index} className="photo-item">
                      <img src={image} alt={`${user.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Debug: Show if no images */}
            {(!user.images || user.images.length === 0) && (
              <div
                style={{
                  padding: "12px",
                  background: "#f0f0f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                ℹ️ Không có ảnh
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons - Always at bottom */}
      <div className="tinder-action-buttons">
        <button
          className="action-button pass-button"
          onClick={(e) => {
            e.stopPropagation();
            onDislike();
          }}
        >
          <CloseOutlined />
        </button>

        <button
          className="action-button super-like-button"
          onClick={(e) => {
            e.stopPropagation();
            onSuperLike();
          }}
        >
          <StarFilled />
        </button>

        <button
          className="action-button like-button"
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
        >
          <HeartFilled />
        </button>

        <button className="action-button boost-button">
          <ThunderboltFilled />
        </button>
      </div>
    </div>
  );
};

export default TinderCard;
