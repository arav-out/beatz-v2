import mongoose from 'mongoose';
import { User } from '../models/user.model.js'; // Ensure the path is correct

export const getLikedSongs = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ clerkId: userId }).populate('likedSongs'); // Find user by clerkId

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ songs: user.likedSongs });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addLikedSong = async (req, res, next) => {
  try {
    const { userId, songId } = req.params;
    console.log(`Adding liked song: userId=${userId}, songId=${songId}`);

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      console.error(`User not found: clerkId=${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate songId as an ObjectId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      console.error(`Invalid song ID format: songId=${songId}`);
      return res.status(400).json({ message: 'Invalid song ID format' });
    }

    const songObjectId = new mongoose.Types.ObjectId(songId);

    // Ensure the song isn't already liked
    if (!user.likedSongs.some(id => id.toString() === songObjectId.toString())) {
      user.likedSongs.push(songObjectId);
      await user.save();
      console.log(`Song added to liked songs: userId=${userId}, songId=${songId}`);
      const updatedUser = await User.findOne({ clerkId: userId });
      console.log("Updated user from DB:", updatedUser);
    } else {
      console.log(`Song already liked: userId=${userId}, songId=${songId}`);
    }

    res.status(200).json({ message: 'Song added to liked songs' });
  } catch (error) {
    console.error('Error adding liked song:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeLikedSong = async (req, res) => {
  try {
    const { userId, songId } = req.params;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      console.error(`User not found: clerkId=${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate songId as an ObjectId
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      console.error(`Invalid song ID format: songId=${songId}`);
      return res.status(400).json({ message: 'Invalid song ID format' });
    }

    const songObjectId = new mongoose.Types.ObjectId(songId);

    user.likedSongs = user.likedSongs.filter(id => id.toString() !== songObjectId.toString());

    await user.save();
    console.log(`Song removed from liked songs: userId=${userId}, songId=${songId}`);
    res.status(200).json({ message: 'Song removed from liked songs' });
  } catch (error) {
    console.error("Error removing liked song:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};
