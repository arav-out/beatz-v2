
import FriendRequest from "../models/friendReq.model.js";
import User from "../models/user.model.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    // Create a new friend request
    const friendRequest = new FriendRequest({ senderId, recipientId });
    await friendRequest.save();

    // Add the friend request to the recipient's request array
    await User.findByIdAndUpdate(recipientId, {
      $push: { friendRequests: friendRequest._id },
    });

    res.status(201).json({ message: "Friend request sent!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};