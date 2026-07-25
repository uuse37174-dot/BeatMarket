import React, { createContext, useContext, useState, useEffect } from "react";
import { StoreLocation } from "../types";

interface LocationContextType {
  userLocation: StoreLocation | null;
  locationName: string;
  isDetecting: boolean;
  detectLocation: () => void;
  setUserLocationManually: (city: string, lat: number, lng: number) => void;
  calculateDistanceKm: (lat2: number, lng2: number) => number | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Default NYC center coordinates for initial showcase
const DEFAULT_LOCATION: StoreLocation = {
  address: "Central Manhattan",
  city: "New York, NY",
  lat: 40.7128,
  lng: -74.0060
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<StoreLocation | null>(DEFAULT_LOCATION);
  const [locationName, setLocationName] = useState<string>("New York, NY (Default)");
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc: StoreLocation = {
          address: "Current GPS Location",
          city: "Near You",
          lat: latitude,
          lng: longitude
        };
        setUserLocation(newLoc);
        setLocationName(`GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
        setIsDetecting(false);
      },
      (error) => {
        console.warn("Geolocation permission error or unavailable:", error.message);
        setIsDetecting(false);
        // Fallback remains NYC
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const setUserLocationManually = (city: string, lat: number, lng: number) => {
    const newLoc: StoreLocation = {
      address: city,
      city,
      lat,
      lng
    };
    setUserLocation(newLoc);
    setLocationName(city);
  };

  // Haversine formula to calculate distance in km
  const calculateDistanceKm = (lat2: number, lng2: number): number | null => {
    if (!userLocation) return null;
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - userLocation.lat) * Math.PI) / 180;
    const dLng = ((lng2 - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10; // round to 1 decimal
  };

  useEffect(() => {
    // Attempt location auto-detection gently on load if available
    detectLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        locationName,
        isDetecting,
        detectLocation,
        setUserLocationManually,
        calculateDistanceKm
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within LocationProvider");
  }
  return context;
};
