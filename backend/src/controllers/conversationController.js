import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;
    if (
      !type ||
      (type === "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      return res
        .status(400)
        .json({
          message: "Group conversation require name and at least 1 member",
        });
    }
    let conversation;
    if (type === "direct") {
      const participantId = memberIds[0];
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });
    }
  } catch (error) {}
};
export const getConversation = async (req, res) => {};
export const getMessages = async (req, res) => {};
