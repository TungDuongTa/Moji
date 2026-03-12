import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, //link CDN to show img
    },
    avatarId: {
      type: String, //cloudinary public_id to manage img
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    phone: {
      type: String,
      sparse: true, // allow null but unique when provided
    },
  },
  {
    timestamps: true, //add createdAt and updatedAt fields automatically
  },
);

const User = mongoose.model("User", userSchema);

export default User;
