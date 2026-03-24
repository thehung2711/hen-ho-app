import { useState, useEffect, createContext, useContext } from "react";

// Default settings
const defaultSettings = {
  maxDistance: 50, // km
  showDistance: true,
  minAge: 18,
  maxAge: 35,
  currentLocation: {
    city: "Ho Chi Minh City",
    district: "District 1",
    latitude: 10.8231,
    longitude: 106.6297,
  },
  autoLocation: true,
  showMe: "everyone", // men, women, everyone
  globalMode: false,
  recentlyActive: true,
};

// Create Context
const SettingsContext = createContext();

// Settings Provider Component
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("tinderSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage whenever settings change
  const updateSettings = (newSettings) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem("tinderSettings", JSON.stringify(updatedSettings));
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  };

  // Update nested setting
  const updateNestedSetting = (parentKey, childKey, value) => {
    const newSettings = {
      ...settings,
      [parentKey]: {
        ...settings[parentKey],
        [childKey]: value,
      },
    };
    return updateSettings(newSettings);
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("tinderSettings", JSON.stringify(defaultSettings));
  };

  // Get distance filter for API calls
  const getDistanceFilter = () => {
    return settings.globalMode ? null : settings.maxDistance;
  };

  // Get age filter for API calls
  const getAgeFilter = () => {
    return {
      minAge: settings.minAge,
      maxAge: settings.maxAge,
    };
  };

  // Get location filter for API calls
  const getLocationFilter = () => {
    return settings.currentLocation;
  };

  // Check if user meets current filters
  const matchesFilters = (user) => {
    // Age filter
    if (user.age < settings.minAge || user.age > settings.maxAge) {
      return false;
    }

    // Distance filter (if not global mode)
    if (!settings.globalMode && user.distance) {
      const distanceNum = parseFloat(user.distance.replace(/[^\d.]/g, ""));
      if (distanceNum > settings.maxDistance) {
        return false;
      }
    }

    // Gender filter
    if (settings.showMe !== "everyone") {
      if (settings.showMe === "men" && user.gender !== "male") {
        return false;
      }
      if (settings.showMe === "women" && user.gender !== "female") {
        return false;
      }
    }

    return true;
  };

  const value = {
    settings,
    isLoaded,
    updateSettings,
    updateNestedSetting,
    resetSettings,
    getDistanceFilter,
    getAgeFilter,
    getLocationFilter,
    matchesFilters,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook to use settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Hook for specific settings
export const useDistanceSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    maxDistance: settings.maxDistance,
    showDistance: settings.showDistance,
    globalMode: settings.globalMode,
    setMaxDistance: (distance) => updateSettings({ maxDistance: distance }),
    setShowDistance: (show) => updateSettings({ showDistance: show }),
    setGlobalMode: (global) => updateSettings({ globalMode: global }),
  };
};

export const useAgeSettings = () => {
  const { settings, updateSettings } = useSettings();
  return {
    minAge: settings.minAge,
    maxAge: settings.maxAge,
    setMinAge: (age) => updateSettings({ minAge: age }),
    setMaxAge: (age) => updateSettings({ maxAge: age }),
    setAgeRange: (min, max) => updateSettings({ minAge: min, maxAge: max }),
  };
};

export const useLocationSettings = () => {
  const { settings, updateNestedSetting, updateSettings } = useSettings();
  return {
    currentLocation: settings.currentLocation,
    autoLocation: settings.autoLocation,
    setCity: (city) => updateNestedSetting("currentLocation", "city", city),
    setDistrict: (district) =>
      updateNestedSetting("currentLocation", "district", district),
    setCoordinates: (lat, lng) => {
      updateNestedSetting("currentLocation", "latitude", lat);
      updateNestedSetting("currentLocation", "longitude", lng);
    },
    setAutoLocation: (auto) => updateSettings({ autoLocation: auto }),
  };
};

export default useSettings;
