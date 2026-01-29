const { Schema, model } = require("mongoose");

const scrollSchema = new Schema(
  {
    // Content
    content: {
      type: String,
      required: [true, "Scroll content is required."],
      maxlength: [2000, "Scroll cannot exceed 2000 characters."],
    },
    
    // Author
    author: {
      type: Schema.Types.ObjectId,
      ref: "Traveler",
      required: true,
    },
    
    // Location
    hall: {
      type: Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    
    // Type & Metadata
    type: {
      type: String,
      enum: ["text", "gandalf_response", "system", "announcement"],
      default: "text",
    },
    isGandalfResponse: {
      type: Boolean,
      default: false,
    },
    
    // Edit tracking
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    
    // Reactions (optional, for future)
    reactions: [{
      emoji: String,
      travelers: [{
        type: Schema.Types.ObjectId,
        ref: "Traveler",
      }],
    }],
  },
  {
    timestamps: true,
  }
);

const Scroll = model("Scroll", scrollSchema);

module.exports = Scroll;