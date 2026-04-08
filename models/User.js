import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "user" },
    profileImage: {
  type: String, // base64 or URL
  default: "",
},
  },
  
  { timestamps: true }
  
);

export default mongoose.model("User", userSchema);
