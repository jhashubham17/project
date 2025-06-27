// client/src/components/ProgressBar.jsx
import React from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="step-indicators">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i + 1}
            className={`step-indicator ${i + 1 <= currentStep ? "active" : ""}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <p className="step-text">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
};

export default ProgressBar;
