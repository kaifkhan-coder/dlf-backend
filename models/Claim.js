import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // allow null for unauthenticated claims (college demo)
  },
  userName: String,
  studentId: String,
  proofText: String,
  proofImage: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Claim", claimSchema);