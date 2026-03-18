import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);
export const checkFriendShip = async (req, res, next) => {
  try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;

    if (!recipientId) {
      return res.status(400).json({ message: "Invalid recipientId" });
    }
    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);
      const isFriend = await Friend.findOne({ userA, userB });
      if (!isFriend) {
        return res.status(403).json({ message: "You are not friend" });
      }
      return next();
      //todo: groupchat
    }
  } catch (error) {
    console.error("Error when checkFriendShip", error);
    return res.status(500).json({ message: "Interal server error" });
  }
};
