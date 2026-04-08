import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  name: String,
  email: String,

  color: String,
  description: String,

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
}, { timestamps: true });

export default mongoose.model("Claim", claimSchema);