import express from "express";
import { sendFriendRequest } from "../controller/friendReq.controller.js";

const router = express.Router();

router.post("/", sendFriendRequest);

export default router;