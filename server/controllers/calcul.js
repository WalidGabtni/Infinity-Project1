import Calcul from "../models/Calcul.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Post from "../models/Post.js";

const CalculController = {
  async updateCounts(userId) {
    try {
      // Get the user
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Calculate bookmarks count
      const bookmarksCount = user.bookmarks.length;

      // Calculate projects count
      const projectsCount = await Project.countDocuments({ userId });

      // Calculate posts count
      const postsCount = await Post.countDocuments({ userId });

      // Update or create Calcul entry
      const calculEntry = await Calcul.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          firstName: user.firstName, // Populate first name
          lastName: user.lastName, // Populate last name
          bookmarksCount,
          projectsCount,
          postsCount
        },
        { upsert: true, new: true } // Set new option to true to return the updated document
      );

      console.log("Counts updated successfully!");
    } catch (error) {
      console.error("Error updating counts:", error);
    }
  },
};

export default CalculController;