import express from "express";
import {
    getUser,
    getUserfriends,
    addRemovefriend,
    addRemoveBookmark,
    getBookmarkedPosts,
} from "../controllers/users.js";
import {
    getAllUsers
} from "../controllers/adminDashboard.js";
import { verifyToken, adminAuth } from "../middleware/auth.js";


const router = express.Router();

// Fetch all users (for admin dashboard)
router.get("/getallusers", verifyToken, getAllUsers);

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserfriends);
router.get("/:id/bookmarks", verifyToken, getBookmarkedPosts);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemovefriend);
// Add or remove bookmark for the given user and post IDs
router.patch("/:id/bookmarks/:postId", verifyToken, addRemoveBookmark);


export default router;