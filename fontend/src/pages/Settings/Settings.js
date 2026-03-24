import React, { useState } from "react";
import {
  Button,
  Slider,
  Switch,
  Input,
  Select,
  Card,
  Divider,
  message,
  Avatar,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  CheckOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../utils/useSettings";
import matchUserService from "../../api/userService/matchUser";
import "./Settings.css";

const { Option } = Select;

const Settings = () => {
  const navigate = useNavigate();
  const {
    settings,
    updateSettings,
    updateNestedSetting,
    resetSettings,
    isLoaded,
  } = useSettings();

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [currentAddress, setCurrentAddress] = useState("Đang lấy vị trí...");

  // Update local settings
  const updateLocalSetting = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateLocalNestedSetting = (parentKey, childKey, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  // Load user address from database
  const loadUserSettings = async () => {
    try {
      setCurrentAddress("Đang tải cài đặt...");
      console.log("🔄 Loading user settings from database...");

      const response = await matchUserService.getSettingUser();

      if (response && response.data) {
        const settingsData = response.data.result;
        console.log("✅ User settings loaded:", settingsData);

        // Update distance range if available
        if (settingsData.distanceRange) {
          updateLocalSetting("maxDistance", settingsData.distanceRange);
          console.log(`📏 Distance range: ${settingsData.distanceRange}km`);
        }

        // Update age range if available
        if (settingsData.minAge) {
          updateLocalSetting("minAge", settingsData.minAge);
          console.log(`👶 Min age: ${settingsData.minAge}`);
        }
        if (settingsData.maxAge) {
          updateLocalSetting("maxAge", settingsData.maxAge);
          console.log(`👴 Max age: ${settingsData.maxAge}`);
        }

        // Update location if available
        if (settingsData.location) {
          console.log("📍 Location data:", settingsData.location);
          // Location is just a string address
          setCurrentAddress(settingsData.location);
        } else {
          setCurrentAddress(
            "Không tìm thấy vị trí. Nhấp vào 'Lấy vị trí hiện tại' để thiết lập vị trí của bạn."
          );
        }

        // Reset hasChanges since these are loaded from server
        setHasChanges(false);
      } else {
        console.log("No settings data found for user");
        setCurrentAddress(
          "Không tìm thấy vị trí. Nhấp vào 'Lấy vị trí hiện tại' để thiết lập vị trí của bạn."
        );
      }
    } catch (error) {
      console.error("❌ Error loading user settings:", error);
      setCurrentAddress(
        "Không thể tải cài đặt. Nhấp vào 'Lấy vị trí hiện tại' để thiết lập vị trí của bạn."
      );
    }
  };

  // Fetch address from coordinates
  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API (free reverse geocoding)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setCurrentAddress(data.display_name);
        return data.display_name;
      } else {
        setCurrentAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setCurrentAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      console.log("💾 Saving user settings...", localSettings);

      // Check if user is logged in
      const token = localStorage.getItem("token");
      console.log("🔑 Token status:", token ? "Present" : "Missing");

      // Prepare settings data for API
      const settingData = {
        distanceRange: parseFloat(localSettings.maxDistance),
        minAge: localSettings.minAge,
        maxAge: localSettings.maxAge,
        location: null,
      };

      console.log("📤 Sending settings to API:", settingData);

      // Call API to update settings
      const response = await matchUserService.updateSettingUser(settingData);

      if (response && response.data) {
        console.log("✅ Settings saved to database:", response.data);

        // Update global settings
        const success = updateSettings(localSettings);

        if (success) {
          message.success("Đã lưu cài đặt thành công!");
          setHasChanges(false);

          // Optional: Navigate back after save
          setTimeout(() => {
            navigate("/match");
          }, 1500);
        } else {
          throw new Error("Không thể cập nhật cài đặt cục bộ");
        }
      } else {
        throw new Error("Phản hồi từ API trống");
      }
    } catch (error) {
      console.error("❌ Error saving settings:", error);

      // Check for specific error types
      if (error.response) {
        // Server responded with error status
        console.error("API Error Response:", error.response.data);
        console.error("Status Code:", error.response.status);

        if (error.response.status === 401) {
          message.error("Vui lòng đăng nhập trước khi lưu cài đặt");
        } else {
          message.error(
            `Lỗi máy chủ (${error.response.status}): ${
              error.response.data?.message || "Lỗi không xác định"
            }`
          );
        }
      } else if (error.request) {
        // Network error
        console.error("Network Error:", error.request);
        message.error(
          "Lỗi mạng: Không thể kết nối với máy chủ. Vui lòng kiểm tra lại backend."
        );
      } else {
        // Other error
        message.error(
          "Lỗi khi lưu cài đặt: " + (error.message || "Lỗi không xác định")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset to defaults
  const handleResetSettings = () => {
    resetSettings();
    setLocalSettings(settings);
    message.info("Đã đặt lại về cài đặt mặc định");
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setCurrentAddress("Đang lấy vị trí...");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log("📍 Got GPS coordinates:", {
              lat: latitude,
              lon: longitude,
            });

            // Update coordinates in local settings
            updateLocalNestedSetting("currentLocation", "latitude", latitude);
            updateLocalNestedSetting("currentLocation", "longitude", longitude);

            // Call API to update user address in database
            console.log("🔄 Updating user address in database...");
            const updateResponse = await matchUserService.updateAddressUser(
              longitude,
              latitude
            );

            if (updateResponse && updateResponse.data) {
              console.log(
                "✅ Address updated in database:",
                updateResponse.data
              );
            }

            // Fetch and display address
            await fetchAddressFromCoordinates(latitude, longitude);

            message.success("Cập nhật vị trí thành công!");
            setLoading(false);
          } catch (apiError) {
            console.error("❌ Error updating address in database:", apiError);
            // Still show address even if API fails
            await fetchAddressFromCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );
            message.warning("Đã phát hiện vị trí nhưng không thể lưu vào cơ sở dữ liệu");
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          message.error("Không thể lấy vị trí hiện tại");
          setCurrentAddress("Vị trí không khả dụng");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      message.error("Trình duyệt này không hỗ trợ định vị");
    }
  };

  // Load user settings from database on component mount
  React.useEffect(() => {
    if (isLoaded) {
      loadUserSettings();
    }
  }, [isLoaded]);

  // Update localSettings when global settings change
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Check for changes when localSettings update
  React.useEffect(() => {
    // Compare localSettings with global settings to detect changes
    const hasSettingsChanged =
      localSettings.maxDistance !== settings.maxDistance ||
      localSettings.minAge !== settings.minAge ||
      localSettings.maxAge !== settings.maxAge;

    setHasChanges(hasSettingsChanged);
  }, [localSettings, settings]);

  // Show loading if settings not loaded yet
  if (!isLoaded) {
    return (
      <div className="settings-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>Đang tải cài đặt...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="header-left">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/match")}
            className="back-button"
          />
          <h1>Cài đặt khám phá</h1>
        </div>

        {hasChanges && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleSaveSettings}
            loading={loading}
            className="save-button"
          >
            Lưu thay đổi
          </Button>
        )}
      </div>

      <div className="settings-content">
        {/* Distance Settings */}
        <Card
          className="settings-card"
          title={
            <Space>
              <EnvironmentOutlined />
              <span>Khoảng cách</span>
            </Space>
          }
        >
          <div className="setting-item">
            <div className="setting-label">
              <span>Khoảng cách tối đa</span>
              <span className="setting-value">
                {localSettings.maxDistance} km
              </span>
            </div>
            <Slider
              min={1}
              max={100}
              value={localSettings.maxDistance}
              onChange={(value) => updateLocalSetting("maxDistance", value)}
              marks={{
                1: "1km",
                25: "25km",
                50: "50km",
                100: "100km+",
              }}
              className="distance-slider"
            />
          </div>

          <div className="setting-item">
            <div className="setting-row">
              <span>Hiển thị khoảng cách trên thẻ</span>
              <Switch
                checked={localSettings.showDistance}
                onChange={(checked) =>
                  updateLocalSetting("showDistance", checked)
                }
              />
            </div>
          </div>
        </Card>

        {/* Age Settings */}
        <Card
          className="settings-card"
          title={
            <Space>
              <CalendarOutlined />
              <span>Độ tuổi</span>
            </Space>
          }
        >
          <div className="setting-item">
            <div className="setting-label">
              <span>Phạm vi độ tuổi</span>
              <span className="setting-value">
                {localSettings.minAge} - {localSettings.maxAge} tuổi
              </span>
            </div>
            <div className="age-sliders">
              <div className="age-slider-item">
                <label>Tuổi tối thiểu: {localSettings.minAge}</label>
                <Slider
                  min={18}
                  max={50}
                  value={localSettings.minAge}
                  onChange={(value) =>
                    updateLocalSetting(
                      "minAge",
                      Math.min(value, localSettings.maxAge - 1)
                    )
                  }
                />
              </div>
              <div className="age-slider-item">
                <label>Tuổi tối đa: {localSettings.maxAge}</label>
                <Slider
                  min={18}
                  max={50}
                  value={localSettings.maxAge}
                  onChange={(value) =>
                    updateLocalSetting(
                      "maxAge",
                      Math.max(value, localSettings.minAge + 1)
                    )
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Location Settings */}
        <Card
          className="settings-card"
          title={
            <Space>
              <EnvironmentOutlined />
              <span>Vị trí</span>
            </Space>
          }
        >
          <div className="setting-item">
            <label>Vị trí hiện tại</label>
            <div className="current-address">
              <span className="address-text">{currentAddress}</span>
            </div>
          </div>

          <Button
            type="primary"
            icon={<EnvironmentOutlined />}
            onClick={handleGetCurrentLocation}
            loading={loading}
            className="get-location-button"
          >
            Lấy vị trí hiện tại
          </Button>
        </Card>

        {/* Action Buttons */}
        <div className="settings-actions">
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={handleResetSettings}
            className="reset-button"
          >
            Đặt lại mặc định
          </Button>

          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleSaveSettings}
            loading={loading}
            disabled={!hasChanges}
            className="save-main-button"
          >
            Lưu & Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
