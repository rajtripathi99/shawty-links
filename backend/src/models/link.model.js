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

    lastVisited: Date,

    // Cached so GET /api/links/my doesn't regenerate a QR code on every request.
    qrCode: String
  },
  { timestamps: true }
);

linkSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Link", linkSchema);