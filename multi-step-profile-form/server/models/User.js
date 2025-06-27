// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4,
      maxlength: 20,
      match: /^[a-zA-Z0-9_]+$/, // No spaces allowed
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    profession: {
      type: String,
      required: true,
      enum: ["Student", "Developer", "Entrepreneur"],
    },
    companyName: {
      type: String,
      trim: true,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    subscriptionPlan: {
      type: String,
      required: true,
      enum: ["Basic", "Pro", "Enterprise"],
      default: "Basic",
    },
    newsletter: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Validation for entrepreneur company name
userSchema.pre("save", function (next) {
  if (this.profession === "Entrepreneur" && !this.companyName) {
    return next(new Error("Company name is required for entrepreneurs"));
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
