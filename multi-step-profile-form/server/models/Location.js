// server/models/Location.js
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["country", "state", "city"],
    },
    parentCode: {
      type: String,
      default: null,
    },
    countryCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
locationSchema.index({ type: 1, parentCode: 1 });
locationSchema.index({ code: 1 });

module.exports = mongoose.model("Location", locationSchema);
