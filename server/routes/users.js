import express from "express";
import {
    getUser,
    getUserfriends,
    addRemovefriend,
    addRemoveBookmark,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserfriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemovefriend);
// Add or remove bookmark for the given user and post IDs
router.patch("/:id/bookmarks/:postId", verifyToken, addRemoveBookmark);

export default router;