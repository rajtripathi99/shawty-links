import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true
    },

    shortCode: {
      type: String,
      required: true,
      unique: true
    },

    clicks: {
      type: Number,
      default: 0
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    lastVisited: Date
  },
  { timestamps: true }
);

export default mongoose.model("Link", linkSchema);