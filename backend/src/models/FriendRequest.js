import mongoose, { mongo } from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      maxLength: 300,
    },
  },
  { timestamps: true },
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

friendRequestSchema.index({ from: 1 }); // friend request sent
friendRequestSchema.index({ to: 1 }); //received friend request

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
