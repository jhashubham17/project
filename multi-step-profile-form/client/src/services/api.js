// client/src/services/api.js - MOCK VERSION FOR TESTING
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Mock data for testing
const mockCountries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
];

const mockStates = {
  US: [
    { code: "CA", name: "California" },
    { code: "NY", name: "New York" },
    { code: "TX", name: "Texas" },
    { code: "FL", name: "Florida" },
  ],
  CA: [
    { code: "ON", name: "Ontario" },
    { code: "BC", name: "British Columbia" },
    { code: "QC", name: "Quebec" },
  ],
  IN: [
    { code: "MH", name: "Maharashtra" },
    { code: "DL", name: "Delhi" },
    { code: "KA", name: "Karnataka" },
  ],
};

const mockCities = {
  "US-CA": [
    { code: "LA", name: "Los Angeles" },
    { code: "SF", name: "San Francisco" },
    { code: "SD", name: "San Diego" },
  ],
  "US-NY": [
    { code: "NYC", name: "New York City" },
    { code: "BUF", name: "Buffalo" },
    { code: "ALB", name: "Albany" },
  ],
  "IN-MH": [
    { code: "MUM", name: "Mumbai" },
    { code: "PUN", name: "Pune" },
    { code: "NAG", name: "Nagpur" },
  ],
  "IN-DL": [
    { code: "DEL", name: "New Delhi" },
    { code: "GUR", name: "Gurgaon" },
  ],
};

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const checkUsernameAvailability = async (username) => {
  try {
    // Mock implementation - you can replace this when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    // Mock logic: usernames starting with 'test' are unavailable
    const available = !username.toLowerCase().startsWith("test");
    return available;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw error;
  }
};

export const getCountries = async () => {
  try {
    // Try real API first, fall back to mock data
    return await apiCall("/locations/countries");
  } catch (error) {
    console.warn("Backend not available, using mock countries data");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCountries;
  }
};

export const getStates = async (countryCode) => {
  try {
    return await apiCall(`/locations/states/${countryCode}`);
  } catch (error) {
    console.warn("Backend not available, using mock states data");
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockStates[countryCode] || [];
  }
};

export const getCities = async (countryCode, stateCode) => {
  try {
    return await apiCall(`/locations/cities/${countryCode}/${stateCode}`);
  } catch (error) {
    console.warn("Backend not available, using mock cities data");
    await new Promise((resolve) => setTimeout(resolve, 300));
    const key = `${countryCode}-${stateCode}`;
    return mockCities[key] || [];
  }
};

export const updateUserProfile = async (userId, formData) => {
  try {
    const formDataObj = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === "profilePhoto" && formData[key] instanceof File) {
          formDataObj.append(key, formData[key]);
        } else {
          formDataObj.append(key, formData[key]);
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
      method: "PUT",
      body: formDataObj,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
