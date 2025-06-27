// client/src/components/FormSteps/StepSummary.jsx
import React from "react";

const StepSummary = ({ formData, prevStep, handleSubmit, isSubmitting }) => {
  return (
    <div className="form-step">
      <h2>Summary</h2>

      <div className="summary-section">
        <h3>Personal Information</h3>
        <div className="summary-item">
          <span>Profile Photo:</span>
          <span>
            {formData.profilePhoto
              ? formData.profilePhoto.name
              : "Not uploaded"}
          </span>
        </div>
        <div className="summary-item">
          <span>Username:</span>
          <span>{formData.username}</span>
        </div>
        <div className="summary-item">
          <span>Password:</span>
          <span>{formData.newPassword ? "Will be updated" : "No changes"}</span>
        </div>
      </div>

      <div className="summary-section">
        <h3>Professional Details</h3>
        <div className="summary-item">
          <span>Profession:</span>
          <span>{formData.profession}</span>
        </div>
        {formData.companyName && (
          <div className="summary-item">
            <span>Company:</span>
            <span>{formData.companyName}</span>
          </div>
        )}
        <div className="summary-item">
          <span>Address:</span>
          <span>{formData.addressLine1}</span>
        </div>
      </div>

      <div className="summary-section">
        <h3>Preferences</h3>
        <div className="summary-item">
          <span>Location:</span>
          <span>
            {formData.city}, {formData.state}, {formData.country}
          </span>
        </div>
        <div className="summary-item">
          <span>Subscription:</span>
          <span>{formData.subscriptionPlan}</span>
        </div>
        <div className="summary-item">
          <span>Newsletter:</span>
          <span>{formData.newsletter ? "Subscribed" : "Not subscribed"}</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={prevStep} className="btn-secondary">
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default StepSummary;
