import mongoose from "mongoose";

const likedSongSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }]
}, { timestamps: true });

// Ensure a user can have only one liked songs document
likedSongSchema.index({ userId: 1 }, { unique: true });

export const LikedSong = mongoose.model("LikedSong", likedSongSchema);
