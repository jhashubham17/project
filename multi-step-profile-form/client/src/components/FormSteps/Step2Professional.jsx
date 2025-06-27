// client/src/components/FormSteps/Step2Professional.jsx
import React from "react";
import { validateStep2 } from "../../utils/validation";

const Step2Professional = ({
  formData,
  errors,
  updateFormData,
  updateErrors,
  nextStep,
  prevStep,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });

    // Clear company name if profession changes from Entrepreneur
    if (name === "profession" && value !== "Entrepreneur") {
      updateFormData({ companyName: "" });
    }

    // Clear specific error when user starts typing
    if (errors[name]) {
      updateErrors({ [name]: "" });
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep2(formData);
    updateErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="form-step">
      <h2>Professional Details</h2>

      <div className="form-group">
        <label>Profession *</label>
        <select
          name="profession"
          value={formData.profession}
          onChange={handleInputChange}
          className={errors.profession ? "error" : ""}
        >
          <option value="">Select your profession</option>
          <option value="Student">Student</option>
          <option value="Developer">Developer</option>
          <option value="Entrepreneur">Entrepreneur</option>
        </select>
        {errors.profession && (
          <span className="error-text">{errors.profession}</span>
        )}
      </div>

      {formData.profession === "Entrepreneur" && (
        <div className="form-group">
          <label>Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter your company name"
            className={errors.companyName ? "error" : ""}
          />
          {errors.companyName && (
            <span className="error-text">{errors.companyName}</span>
          )}
        </div>
      )}

      <div className="form-group">
        <label>Address Line 1 *</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleInputChange}
          placeholder="Enter your address"
          className={errors.addressLine1 ? "error" : ""}
        />
        {errors.addressLine1 && (
          <span className="error-text">{errors.addressLine1}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={prevStep} className="btn-secondary">
          Previous
        </button>
        <button type="button" onClick={handleNext} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2Professional;
