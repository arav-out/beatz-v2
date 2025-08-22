
import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages,  getUserDetails, getFriend,addFriendRequest,getFriendRequests,
  acceptFriendRequest, rejectFriendRequest, getNotifications, getFriends, removeFriend} from "../controller/user.controller.js";


const router = Router();


router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);

router.get('/:id',protectRoute, getUserDetails);

router.get('/search/:name',protectRoute, getFriend );

router.get('/add-friend/:id', protectRoute, addFriendRequest);

//router.get('/request', protectRoute, showRequests);
router.get("/friend/requests", protectRoute, getFriendRequests);
router.post("/friend/accept/:id", protectRoute, acceptFriendRequest);
router.delete("/friend/reject/:id", protectRoute, rejectFriendRequest);

router.get('/notifications/get/:action', protectRoute, getNotifications);

router.get("/FriendList/get/", protectRoute, getFriends);
router.get("/remove-friend/:id", protectRoute, removeFriend);



export default router;
