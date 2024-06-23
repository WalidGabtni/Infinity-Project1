import User from "../models/User.js";

// Controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users...");

    const users = await User.find();
    
    

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message });
  }
};

// Controller to get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id; 

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


// Controller to delete a user by ID
export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find user by ID and delete it from the database
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};



// Controller to update the role of a user by ID
export const updateUserRoleById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body; 

    // Validate if the role is either "admin" or "user"
    if (role !== 'moderator' && role !== 'user') {
      return res.status(400).json({ error: "Invalid role. Role must be either 'admin' or 'user'." });
    }

    // Find user by ID and update its role in the database
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: error.message });
  }
};



