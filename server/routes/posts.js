import express from "express";
import { getFeedPosts, getUserPosts, likePost, deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { addComment, deleteComment, updateComment } from "../controllers/posts.js";
import { searchPosts } from "../controllers/posts.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

// Add comment to a post
router.post("/:postId/comments", verifyToken, addComment);

// Delete comment from a post
router.delete("/:postId/comments/:commentId", verifyToken, deleteComment);

// Update comment in a post
router.patch("/:postId/comments/:commentId", verifyToken, updateComment);

// Delete post
router.delete("/:id", verifyToken, deletePost);

// search
router.get("/search", verifyToken, searchPosts);

export default router;