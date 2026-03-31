import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);
export const checkFriendShip = async (req, res, next) => {
  try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? [];
    if (!recipientId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid recipientId or memberIds" });
    }
    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);
      const isFriend = await Friend.findOne({ userA, userB });
      if (!isFriend) {
        return res.status(403).json({ message: "You are not friend" });
      }
      return next();
    }
    // groupchat
    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(me, memberId);
      const isFriend = await Friend.findOne({ userA, userB });
      return isFriend ? null : memberId;
    });
    const result = await Promise.all(friendChecks);
    const notFriends = result.filter(Boolean);
    if (notFriends.length > 0) {
      return res.status(403).json({
        message: `You are not friend with ${notFriends.join(", ")}`,
      });
    }
    next();
  } catch (error) {
    console.error("Error when checkFriendShip", error);
    return res.status(500).json({ message: "Interal server error" });
  }
};
