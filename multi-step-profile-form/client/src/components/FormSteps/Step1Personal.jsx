// client/src/components/FormSteps/Step1Personal.jsx
import React, { useState, useEffect } from "react";
import ImagePreview from "../ImagePreview";
import PasswordStrength from "../PasswordStrength";
import { validateStep1 } from "../../utils/validation";
import { checkUsernameAvailability } from "../../services/api";

const Step1Personal = ({
  formData,
  errors,
  updateFormData,
  updateErrors,
  nextStep,
}) => {
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePhoto") {
      const file = files[0];
      if (file) {
        // Validate file
        if (!["image/jpeg", "image/png"].includes(file.type)) {
          updateErrors({ profilePhoto: "Only JPG and PNG files are allowed" });
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          // 2MB
          updateErrors({ profilePhoto: "File size must be less than 2MB" });
          return;
        }
        updateErrors({ profilePhoto: "" });
      }
      updateFormData({ [name]: file });
    } else {
      updateFormData({ [name]: value });

      // Clear specific error when user starts typing
      if (errors[name]) {
        updateErrors({ [name]: "" });
      }

      // Reset username availability when changing
      if (name === "username") {
        setUsernameAvailable(null);
      }
    }
  };

  const checkUsername = async (username) => {
    if (username.length < 4) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    try {
      const available = await checkUsernameAvailability(username);
      setUsernameAvailable(available);
      if (!available) {
        updateErrors({ username: "Username is already taken" });
      } else {
        // Clear username error if it becomes available
        if (errors.username === "Username is already taken") {
          updateErrors({ username: "" });
        }
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username && formData.username.length >= 4) {
        checkUsername(formData.username);
      } else {
        setUsernameAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleNext = () => {
    const stepErrors = validateStep1(formData);
    updateErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0 && usernameAvailable !== false) {
      nextStep();
    }
  };

  return (
    <div className="form-step">
      <h2>Personal Information</h2>

      <div className="form-group">
        <label>Profile Photo</label>
        <input
          type="file"
          name="profilePhoto"
          accept=".jpg,.jpeg,.png"
          onChange={handleInputChange}
          className={errors.profilePhoto ? "error" : ""}
        />
        {errors.profilePhoto && (
          <span className="error-text">{errors.profilePhoto}</span>
        )}
        <ImagePreview file={formData.profilePhoto} />
      </div>

      <div className="form-group">
        <label>Username *</label>
        <div className="username-input">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter username (4-20 characters, no spaces)"
            className={errors.username ? "error" : ""}
            maxLength={20}
          />
          {usernameChecking && <span className="checking">Checking...</span>}
          {usernameAvailable === true && (
            <span className="available">✓ Available</span>
          )}
          {usernameAvailable === false && (
            <span className="taken">✗ Taken</span>
          )}
        </div>
        {errors.username && !usernameChecking && (
          <span className="error-text">{errors.username}</span>
        )}
      </div>

      <div className="form-group">
        <label>Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          placeholder="Required only if updating password"
          className={errors.currentPassword ? "error" : ""}
        />
        {errors.currentPassword && (
          <span className="error-text">{errors.currentPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          placeholder="8+ chars, 1 special char, 1 number"
          className={errors.newPassword ? "error" : ""}
        />
        {formData.newPassword && (
          <PasswordStrength password={formData.newPassword} />
        )}
        {errors.newPassword && (
          <span className="error-text">{errors.newPassword}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={handleNext} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1Personal;
