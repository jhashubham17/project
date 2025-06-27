// server/utils/validators.js
const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateUserUpdate = (data) => {
  const errors = {};

  // Username validation
  if (!data.username) {
    errors.username = "Username is required";
  } else if (data.username.length < 4 || data.username.length > 20) {
    errors.username = "Username must be 4-20 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username =
      "Username can only contain letters, numbers, and underscores";
  }

  // Password validation
  if (data.newPassword) {
    if (!data.currentPassword) {
      errors.currentPassword =
        "Current password is required to update password";
    }
    if (!passwordRegex.test(data.newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters with 1 number and 1 special character";
    }
  }

  // Profession validation
  if (!data.profession) {
    errors.profession = "Profession is required";
  } else if (
    !["Student", "Developer", "Entrepreneur"].includes(data.profession)
  ) {
    errors.profession = "Invalid profession selected";
  }

  // Company name validation for entrepreneurs
  if (data.profession === "Entrepreneur" && !data.companyName) {
    errors.companyName = "Company name is required for entrepreneurs";
  }

  // Address validation
  if (!data.addressLine1) {
    errors.addressLine1 = "Address is required";
  }

  // Location validation
  if (!data.country) errors.country = "Country is required";
  if (!data.state) errors.state = "State is required";
  if (!data.city) errors.city = "City is required";

  // Subscription plan validation
  if (!data.subscriptionPlan) {
    errors.subscriptionPlan = "Subscription plan is required";
  } else if (!["Basic", "Pro", "Enterprise"].includes(data.subscriptionPlan)) {
    errors.subscriptionPlan = "Invalid subscription plan selected";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateUserUpdate,
  passwordRegex,
};
