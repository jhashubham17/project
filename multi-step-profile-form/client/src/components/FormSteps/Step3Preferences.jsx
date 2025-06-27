// client/src/components/FormSteps/Step3Preferences.jsx
import React, { useState, useEffect } from "react";
import { getCountries, getStates, getCities } from "../../services/api";
import { validateStep3 } from "../../utils/validation";

const Step3Preferences = ({
  formData,
  errors,
  updateFormData,
  updateErrors,
  nextStep,
  prevStep,
}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetchStates(formData.country);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.country && formData.state) {
      fetchCities(formData.country, formData.state);
    } else {
      setCities([]);
    }
  }, [formData.country, formData.state]);

  const fetchCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (country) => {
    if (!country) return;
    setLoading(true);
    try {
      const data = await getStates(country);
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (country, state) => {
    if (!country || !state) return;
    setLoading(true);
    try {
      const data = await getCities(country, state);
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Handle country change - reset state and city
    if (name === "country") {
      updateFormData({
        [name]: newValue,
        state: "",
        city: "",
      });
    }
    // Handle state change - reset city
    else if (name === "state") {
      updateFormData({
        [name]: newValue,
        city: "",
      });
    }
    // Handle other fields normally
    else {
      updateFormData({ [name]: newValue });
    }

    // Clear specific error when user starts typing/selecting
    if (errors[name]) {
      updateErrors({ [name]: "" });
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep3(formData);
    updateErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="form-step">
      <h2>Preferences</h2>

      <div className="form-group">
        <label>Country *</label>
        <select
          name="country"
          value={formData.country || ""}
          onChange={handleInputChange}
          className={errors.country ? "error" : ""}
        >
          <option value="">Select your country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && <span className="error-text">{errors.country}</span>}
      </div>

      <div className="form-group">
        <label>State *</label>
        <select
          name="state"
          value={formData.state || ""}
          onChange={handleInputChange}
          disabled={!formData.country || loading}
          className={errors.state ? "error" : ""}
        >
          <option value="">Select your state</option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
        {errors.state && <span className="error-text">{errors.state}</span>}
        {loading && <div className="loading-text">Loading states...</div>}
      </div>

      <div className="form-group">
        <label>City *</label>
        <select
          name="city"
          value={formData.city || ""}
          onChange={handleInputChange}
          disabled={!formData.state || loading}
          className={errors.city ? "error" : ""}
        >
          <option value="">Select your city</option>
          {cities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.city && <span className="error-text">{errors.city}</span>}
        {loading && <div className="loading-text">Loading cities...</div>}
      </div>

      <div className="form-group">
        <label>Subscription Plan *</label>
        <div className="radio-group">
          {["Basic", "Pro", "Enterprise"].map((plan) => (
            <label key={plan} className="radio-label">
              <input
                type="radio"
                name="subscriptionPlan"
                value={plan}
                checked={formData.subscriptionPlan === plan}
                onChange={handleInputChange}
              />
              {plan}
            </label>
          ))}
        </div>
        {errors.subscriptionPlan && (
          <span className="error-text">{errors.subscriptionPlan}</span>
        )}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="newsletter"
            checked={formData.newsletter || false}
            onChange={handleInputChange}
          />
          Subscribe to newsletter
        </label>
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

export default Step3Preferences;
