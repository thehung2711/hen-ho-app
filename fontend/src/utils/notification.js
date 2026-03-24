import { toast } from "react-toastify";

/**
 * Show success notification
 * @param {string} message - The main message to display
 * @param {string} description - Optional description text
 */
export const showSuccessNotification = (message, description = "") => {
  const displayMessage = description ? `${message}: ${description}` : message;
  toast.success(displayMessage, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show error notification
 * @param {string} message - The main message to display
 * @param {string} description - Optional description text
 */
export const showErrorNotification = (message, description = "") => {
  const displayMessage = description ? `${message}: ${description}` : message;
  toast.error(displayMessage, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show warning notification
 * @param {string} message - The main message to display
 * @param {string} description - Optional description text
 */
export const showWarningNotification = (message, description = "") => {
  const displayMessage = description ? `${message}: ${description}` : message;
  toast.warning(displayMessage, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show info notification
 * @param {string} message - The main message to display
 * @param {string} description - Optional description text
 */
export const showInfoNotification = (message, description = "") => {
  const displayMessage = description ? `${message}: ${description}` : message;
  toast.info(displayMessage, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show match notification with special styling
 * @param {object} data - Match notification data {userFromId, userFromUsername, userToId, userToUsername, type}
 */
export const showMatchNotification = (data) => {
  const message = `It's a Match!`;
  const toastId = `match-${data.userFromId}-${Date.now()}`; // Unique ID

  toast.success(message, {
    toastId: toastId, // ✅ Prevent duplicate toasts
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "match-toast",
    style: {
      background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
      color: "white",
      fontWeight: "600",
      borderRadius: "12px",
      boxShadow: "0 8px 25px rgba(255, 68, 88, 0.3)",
    },
    onClick: () => {
      // Navigate to messages when clicked
      window.location.href = "/messages";
    },
  });

  // Play match sound
  playNotificationSound("match");
};

/**
 * Show like notification
 * @param {object} data - Like notification data {userFromId, userFromUsername, type}
 */
export const showLikeNotification = (data) => {
  const message = `💖 ${data.fromUsername} liked your profile!`;
  const toastId = `like-${data.userFromId}-${Date.now()}`; // Unique ID

  toast.info(message, {
    toastId: toastId, // ✅ Prevent duplicate toasts
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "like-toast",
    style: {
      background: "linear-gradient(135deg, #fff 0%, #fef7f7 100%)",
      color: "#333",
      fontWeight: "500",
      borderLeft: "4px solid #1890ff",
      borderRadius: "8px",
      boxShadow: "0 4px 15px rgba(255, 68, 88, 0.15)",
    },
    onClick: () => {
      // Navigate to likes or show likes overlay
      console.log("Navigate to likes page");
    },
  });

  // Play like sound
  playNotificationSound("like");
};

/**
 * Play notification sound
 * @param {string} type - 'match' or 'like'
 */
const playNotificationSound = (type) => {
  try {
    // Create simple beep sounds using Web Audio API
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "match") {
      // Higher pitch for match
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else {
      // Softer sound for like
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  } catch (error) {
    console.log("Audio not supported:", error);
  }
};

// Simple notification methods for WebSocket
const showMatch = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "match-toast",
    style: {
      background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
      color: "white",
      fontWeight: "600",
      borderRadius: "12px",
      boxShadow: "0 8px 25px rgba(255, 68, 88, 0.3)",
    },
  });
  playNotificationSound("match");
};

const showLike = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "like-toast",
    style: {
      background: "linear-gradient(135deg, #fff 0%, #fef7f7 100%)",
      color: "#333",
      fontWeight: "500",
      borderLeft: "4px solid #1890ff",
      borderRadius: "8px",
      boxShadow: "0 4px 15px rgba(255, 68, 88, 0.15)",
    },
  });
  playNotificationSound("like");
};

const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export default {
  success: showSuccessNotification,
  error: showErrorNotification,
  warning: showWarningNotification,
  info: showInfoNotification,
  match: showMatchNotification,
  like: showLikeNotification,
  showMatch,
  showLike,
  showInfo,
};
