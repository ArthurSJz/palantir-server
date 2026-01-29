const { Schema, model } = require("mongoose");

const hallSchema = new Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Hall name is required."],
      trim: true,
      maxlength: [50, "Hall name cannot exceed 50 characters."],
    },
    description: {
      type: String,
      default: "",
      maxlength: [200, "Description cannot exceed 200 characters."],
    },
    
    // Type
    type: {
      type: String,
      enum: ["text", "gandalf", "council", "archive"],
      default: "text",
    },
    icon: {
      type: String,
      default: "💬",
    },
    
    // Parent Realm
    realm: {
      type: Schema.Types.ObjectId,
      ref: "Realm",
      required: true,
    },
    
    // Settings
    isPrivate: {
      type: Boolean,
      default: false,
    },
    allowedMembers: [{
      type: Schema.Types.ObjectId,
      ref: "Traveler",
    }],
  },
  {
    timestamps: true,
  }
);

const Hall = model("Hall", hallSchema);

module.exports = Hall;