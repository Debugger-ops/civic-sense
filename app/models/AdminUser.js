import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  aadhar:   { type: String, required: true, unique: true }, // store hashed ideally
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
}, { timestamps: true });

export default mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
