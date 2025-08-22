import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import bcrypt from "bcrypt";
import { getAuthUser } from "../lib/utils.js";
import dotenv from "dotenv";

dotenv.config();

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const handleSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const getFriend = async(req, res) => {
  const userField = req.params.name;
  console.log("userField = ",userField);
  
  const users = await User.find( 
    {
      fullName: { $regex: userField, $options: 'i' },
      clerkId: { $ne: req.auth.userId }, 
    },{ _id: 1, fullName: 1 , imageUrl:1} 
  );

  console.log("results = ",users);

  
    res.status(200).json({ message: "success" ,users:users});
};


export const addFriendRequest = async (req, res) => {
console.log('Adding friend request...');
const userId = req.params.id;

console.log(userId);
try{
    
  const reqUser = await User.findById(userId);
  const user = await getAuthUser(req.auth.userId);
  console.log("reqUser = ",reqUser);
  
  
  if(reqUser && user){
    if(reqUser.friendRequests.includes(user._id)){ 
      return res.status(400).json({ message: "Already sent friend request" });
    }
    if(reqUser.FriendsList.includes(user._id)){ 
      return res.status(400).json({ message: "Already Friends" });
    }
    const result = await User.updateOne({_id: reqUser._id}, {$addToSet: {friendRequests: user._id},notifications: `FRIEND_REQUEST__${user.fullName}`, });
    console.log("result = ",result); 
    if(result.modifiedCount > 0){
      return res.status(200).json({ message: "Friend request added" });
    }
  }
}catch(err){
  console.log("error = ",err);
  return res.status(500).json({ message: "error" });
}
return res.status(404).json({ message: "error" });


};


export const showRequests = async (req, res) => {
  return res.status(200).json({ message: "success" });
};





// backend/src/controllers/user.controller.js
export const getFriendRequests = async (req, res) => {
  console.log("Fetching friend requests...");
  try {
    const user = await User.findOne({clerkId: req.auth.userId}).populate("friendRequests", "fullName imageUrl");
    //console.log("Request user =====", user.fullName, "id ",req.auth.userId);
    
    //console.log("user = ",user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.friendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};








export const acceptFriendRequest = async (req, res) => {
  console.log("Accepting friend request...");
  try {
    const userId = req.auth.userId;
    const requestId = req.params.id;

    const user = await User.findOne({clerkId: req.auth.userId});
    const requestUser = await User.findById(requestId);

    if (!user || !requestUser) {
      return res.status(404).json({ message: "User not found",status:'error' });
    }

    // Add the request user to the friends list
    user.FriendsList.push(requestUser._id);
    user.notifications.push(`FRIEND_ACCEPTED__${user.fullName}`);
    requestUser.FriendsList.push(user._id);
    requestUser.notifications.push(`FRIEND_ACCEPTED__${user.fullName}`);

    // Remove the request from the friendRequests array
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestId);

    await user.save();
    await requestUser.save();

    res.status(200).json({ message: "Friend request accepted!",status:'success' });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







export const rejectFriendRequest = async (req, res) => {
  console.log("Rejecting friend request...");
  
  try {
    const userId = req.auth.userId;
    const requestId = req.params.id;

    const user = await User.findOne({clerkId: req.auth.userId});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the request from the friendRequests array
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestId);

    await user.save();

    res.status(200).json({ message: "Friend request rejected!" ,status:'success' });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNotifications = async (req, res) => {
  const action = req.params.action;
  
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if(action == "CLEAR"){
      user.notifications = [];
      await user.save();
      return res.status(200).json({ message: "Notifications cleared!", status:'success' });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(action == "COUNT"){
      console.log("user.notifications.length = ",user.friendRequests.length);
      
      return res.status(200).json(user.friendRequests.length);
    }
    res.status(200).json(user.notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getFriends = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId }).populate("FriendsList", "fullName imageUrl clerkId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.FriendsList);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const removeFriend = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const friendId = req.params.id;

    const user = await User.findOne({clerkId: userId});
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    // Remove each other from friendsList
    //user.FriendsList = user.FriendList.filter((id) => id.toString() !== friendId);
    //friend.FriendsList = friend.FriendList.filter((id) => id.toString() !== userId);

    // const result = await User.updateOne(
    //   { _id: user._id },
    //   { $pull: { friendRequests: new mongoose.Types.ObjectId(friend._id) } }
    // );
    const result2 = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: user._id },
          update: { $pull: { FriendsList: friend._id } },
        },
      },
      {
        updateOne: {
          filter: { _id: friend._id },
          update: {
            $pull: { FriendsList: user._id } ,
          },
        },
      },
    ]);
    console.log("result = ",result2);
    

    //await user.save();
    //await friend.save();

    res.status(200).json({ message: "Friend removed successfully!" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};