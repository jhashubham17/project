// client/src/utils/validation.js
const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateStep1 = (data) => {
  const errors = {};

  if (!data.username) {
    errors.username = "Username is required";
  } else if (data.username.length < 4 || data.username.length > 20) {
    errors.username = "Username must be 4-20 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username =
      "Username can only contain letters, numbers, and underscores";
  }

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

  return errors;
};

export const validateStep2 = (data) => {
  const errors = {};

  if (!data.profession) {
    errors.profession = "Profession is required";
  }

  if (data.profession === "Entrepreneur" && !data.companyName) {
    errors.companyName = "Company name is required for entrepreneurs";
  }

  if (!data.addressLine1) {
    errors.addressLine1 = "Address is required";
  }

  return errors;
};

export const validateStep3 = (data) => {
  const errors = {};

  if (!data.country) errors.country = "Country is required";
  if (!data.state) errors.state = "State is required";
  if (!data.city) errors.city = "City is required";

  return errors;
};

export const getPasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  strength = Object.values(checks).filter(Boolean).length;

  if (strength < 3) return { level: "weak", color: "#ff4757", percentage: 20 };
  if (strength < 4)
    return { level: "medium", color: "#ffa502", percentage: 60 };
  return { level: "strong", color: "#2ed573", percentage: 100 };
};
