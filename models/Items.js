import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    // 🔗 User who reported the item
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // LOST or FOUND
    type: {
      type: String,
      enum: ["LOST", "FOUND"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    date: {
      type: String, // keep string for simplicity (college demo)
      required: true,
    },

    color: {
      type: String,
      default: "",
    },

    image: {
      type: String, // image URL
      default: "",
    },

    // 🟡 Admin workflow
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "RETURNED", "REJECTED"],
      default: "PENDING",
    },

    // 🔐 Claim system
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    claimNote: {
      type: String,
      default: "",
    },

    claimedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Item", ItemSchema);
