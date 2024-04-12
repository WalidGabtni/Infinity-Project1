import User from "../models/User.js";

// Controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users...");

    const users = await User.find();
    
    

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    // Display all fields of the error object for better understanding
    console.error("Error details:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message });
  }
};

// Controller to get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter

    // Find user by ID in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user is found, send user data in the response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message });
  }
};
