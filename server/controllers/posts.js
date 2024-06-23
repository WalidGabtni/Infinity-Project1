import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";



/* CREATE */
export const createPost = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { userId, picturePath, title, description } = req.body;

    console.log("userId:", userId);
    console.log("title:", title);
    console.log("description:", description);

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
      const post = await Post.findById(postId); 
  
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

    // Find the index of the comment to delete
    const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Remove the comment from the comments array
    post.comments.splice(commentIndex, 1);

    // Save the updated post
    const updatedPost = await post.save();

    res.json(updatedPost); 
  } catch (error) {
    console.error("Error deleting comment:", error);
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

    // Find the comment by its ID
    const commentToUpdate = post.comments.id(commentId);

    if (!commentToUpdate) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Update the text of the comment
    commentToUpdate.text = text;

    // Save the updated post
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


/*SHARE POST*/
export const sharePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the post by ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    
    if (post.sharedBy.includes(userId)) {
      return res.status(400).json({ error: 'Post already shared by the user' });
    }

    
    console.log('Shared by:', user.firstName, user.lastName);

    
    post.sharedBy.push(userId);

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/* DELETE POST*/
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user is authorized to delete the post
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Extract user ID from the decoded token
    const userIdFromToken = req.user && req.user.id;

    // Ensure post.userId is a valid string before comparison
    if (userIdFromToken && String(post.userId) === String(userIdFromToken)) {
      console.log("Deleting post with ID:", id);
      console.log("User ID from token:", userIdFromToken);

      // Remove the post ID from the bookmark lists of all users
      await User.updateMany({}, { $pull: { bookmarks: id } });

      await Post.findByIdAndDelete(id);

      return res.status(200).json({ message: "Post deleted successfully" });
    }

    console.log("Unauthorized: You can only delete your own posts");
    return res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* SEARCH POSTS BY TITLE */
export const searchPosts = async (req, res) => {
  try {
    const { title } = req.query;

    // Perform a case-insensitive search on the title field
    const posts = await Post.find({ title: { $regex: new RegExp(title, 'i') } });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* UPDATE POST */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Check if the post ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Check if the post exists
    const existingPost = await Post.findById(id);

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure user is authorized to update the post
    const userIdFromToken = req.user && req.user.id;

    // Ensure post.userId is a valid string before comparison
    if (userIdFromToken && String(existingPost.userId) !== String(userIdFromToken)) {
      console.log("Unauthorized: You can only update your own posts");
      return res.status(403).json({ error: "Unauthorized: You can only update your own posts" });
    }

    // Update the post fields
    existingPost.title = title || existingPost.title;
    existingPost.description = description || existingPost.description;
    

    // Handle post image update
    if (req.file) {
      existingPost.postImage = `/assets/${req.file.originalname}`;
    }

    // Save the updated post
    const updatedPost = await existingPost.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
