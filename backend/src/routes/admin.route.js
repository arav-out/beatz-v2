import { Router } from "express";
import { createSong,createAlbum,checkAdmin,deleteAlbum,deleteSong, updateSong,updateAlbum } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute,requireAdmin);

router.get("/check",checkAdmin);

router.post('/songs',createSong);
router.delete('/songs/:id',deleteSong);

router.post('/albums',createAlbum);
router.delete('/albums/:id',deleteAlbum); 
router.put('/songs/:id', updateSong);
router.put('/albums/:id', updateAlbum)

export default router;