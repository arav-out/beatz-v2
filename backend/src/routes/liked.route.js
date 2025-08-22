import { Router } from "express";
import { getLikedSongs, addLikedSong, removeLikedSong } from '../controller/likedsongs.controller.js';

const router = Router();

// Route to get liked songs for a user
router.get('/:userId', getLikedSongs);

// Route to add a liked song for a user
router.post('/:userId/:songId', addLikedSong);

// Route to remove a liked song for a user
router.delete('/:userId/:songId', removeLikedSong);

export default router;