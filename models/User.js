import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img_url: { type: String, default: null },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
