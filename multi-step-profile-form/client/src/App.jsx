// client/src/App.jsx
import React, { useState } from "react";
import ProgressBar from "./components/ProgressBar";
import Step1Personal from "./components/FormSteps/Step1Personal";
import Step2Professional from "./components/FormSteps/Step2Professional";
import Step3Preferences from "./components/FormSteps/Step3Preferences";
import StepSummary from "./components/FormSteps/StepSummary";
import "./App.css";

const STEPS = [
  { id: 1, title: "Personal Info", component: Step1Personal },
  { id: 2, title: "Professional Details", component: Step2Professional },
  { id: 3, title: "Preferences", component: Step3Preferences },
  { id: 4, title: "Summary", component: StepSummary },
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    profilePhoto: null,
    username: "",
    currentPassword: "",
    newPassword: "",

    // Step 2
    profession: "",
    companyName: "",
    addressLine1: "",

    // Step 3
    country: "",
    state: "",
    city: "",
    subscriptionPlan: "Basic",
    newsletter: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const updateErrors = (stepErrors) => {
    setErrors((prev) => ({ ...prev, ...stepErrors }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit logic will be implemented
      console.log("Submitting:", formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="app">
      <div className="form-container">
        <h1>Update Your Profile</h1>
        <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} />

        <div className="form-content">
          <CurrentStepComponent
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            updateErrors={updateErrors}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={currentStep}
            totalSteps={STEPS.length}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
