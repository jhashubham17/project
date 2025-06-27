// server/routes/users.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { validateUserUpdate } = require("../utils/validators");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/profiles";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG files are allowed"));
    }
  },
});

// Check username availability
router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Basic validation
    if (username.length < 4 || username.length > 20) {
      return res.json({
        available: false,
        message: "Username must be 4-20 characters",
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.json({
        available: false,
        message: "Username can only contain letters, numbers, and underscores",
      });
    }

    const existingUser = await User.findOne({ username });
    res.json({ available: !existingUser });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put("/profile/:id", upload.single("profilePhoto"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Add profile photo path if uploaded
    if (req.file) {
      updateData.profilePhoto = req.file.path;
    }

    // Validate update data
    const validation = validateUserUpdate(updateData);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Find and update user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields
    Object.keys(updateData).forEach((key) => {
      if (key !== "currentPassword" && updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    // Handle password update
    if (updateData.newPassword && updateData.currentPassword) {
      const isValidPassword = await user.comparePassword(
        updateData.currentPassword
      );
      if (!isValidPassword) {
        return res.status(400).json({
          errors: { currentPassword: "Current password is incorrect" },
        });
      }
      user.password = updateData.newPassword;
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ errors });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
