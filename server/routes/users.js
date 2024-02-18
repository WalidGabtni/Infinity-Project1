import express from "express";
import {
    getUser,
    getUserfriends,
    addRemovefriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserfriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemovefriend);

export default router;