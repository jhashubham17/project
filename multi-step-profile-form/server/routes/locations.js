// server/routes/locations.js
const express = require("express");
const Location = require("../models/Location");

const router = express.Router();

// Get all countries
router.get("/countries", async (req, res) => {
  try {
    const countries = await Location.find({ type: "country" }).sort({
      name: 1,
    });
    res.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get states by country
router.get("/states/:countryCode", async (req, res) => {
  try {
    const { countryCode } = req.params;
    const states = await Location.find({
      type: "state",
      parentCode: countryCode,
    }).sort({ name: 1 });
    res.json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get cities by state
router.get("/cities/:countryCode/:stateCode", async (req, res) => {
  try {
    const { countryCode, stateCode } = req.params;
    const cities = await Location.find({
      type: "city",
      parentCode: stateCode,
      countryCode: countryCode,
    }).sort({ name: 1 });
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
