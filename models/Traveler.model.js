const { Schema, model } = require("mongoose");

const travelerSchema = new Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    // Profile
    avatar: {
      type: String,
      default: "https://i.imgur.com/8Q1ZqQM.png",
    },
    title: {
      type: String,
      default: "Wanderer",
    },
    // Role & Status
    role: {
      type: String,
      enum: ["fellowship_member", "warden", "wizard"],
      default: "fellowship_member",
    },
    journeyStatus: {
      type: String,
      enum: ["online", "offline", "away", "in_journey"],
      default: "offline",
    },
    // Realms the traveler belongs to
    realms: [{
      type: Schema.Types.ObjectId,
      ref: "Realm",
    }],
  },
  {
    timestamps: true,
  }
);

const Traveler = model("Traveler", travelerSchema);

module.exports = Traveler;