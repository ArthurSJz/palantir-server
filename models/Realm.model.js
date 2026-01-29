const { Schema, model } = require("mongoose");

const realmSchema = new Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Realm name is required."],
      trim: true,
      maxlength: [50, "Realm name cannot exceed 50 characters."],
    },
    description: {
      type: String,
      default: "A new realm in Middle-earth awaits...",
      maxlength: [500, "Description cannot exceed 500 characters."],
    },
    icon: {
      type: String,
      default: "🏰",
    },
    banner: {
      type: String,
      default: "",
    },
    
    // Ownership & Members
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Traveler",
      required: true,
    },
    wardens: [{
      type: Schema.Types.ObjectId,
      ref: "Traveler",
    }],
    members: [{
      type: Schema.Types.ObjectId,
      ref: "Traveler",
    }],
    
    // Access
    gatePassword: {
      type: String,
      unique: true,
      default: function() {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
      }
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Realm = model("Realm", realmSchema);

module.exports = Realm;