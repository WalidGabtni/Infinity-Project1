import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";



/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, picturePath, title, description } = req.body;

    // Validate if title is present
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      title,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();

    const posts = await Post.find();

    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId, text } = req.body;
      const post = await Post.findById(postId); // Use the Post model
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      const newComment = { userId, text };
      post.comments.push(newComment);
      const updatedPost = await post.save();
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
};
  
/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      // Check if commentId is a valid index (non-negative integer)
      const commentIndex = parseInt(commentId, 10);
      if (isNaN(commentIndex) || commentIndex < 0 || commentIndex >= post.comments.length) {
        console.error("Invalid commentId:", commentId);
        return res.status(400).json({ error: 'Invalid commentId' });
      }
  
      // Remove the comment at the specified index
      post.comments.splice(commentIndex, 1);
  
      const updatedPost = await post.save();
  
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

/* UPDATE COMMENT */
export const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if commentId is a valid index (non-negative integer)
    const commentIndex = parseInt(commentId, 10);
    if (isNaN(commentIndex) || commentIndex < 0 || commentIndex >= post.comments.length) {
      console.error("Invalid commentId:", commentId);
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    // Update the text of the comment at the specified index
    post.comments[commentIndex].text = text;

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};





