// client/src/components/PasswordStrength.jsx
import React from "react";
import { getPasswordStrength } from "../utils/validation";

const PasswordStrength = ({ password }) => {
  const strength = getPasswordStrength(password);

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div
          className="strength-fill"
          style={{
            width: `${strength.percentage}%`,
            backgroundColor: strength.color,
          }}
        ></div>
      </div>
      <span className="strength-text" style={{ color: strength.color }}>
        {strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}
      </span>
    </div>
  );
};

export default PasswordStrength;
