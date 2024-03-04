import Project from "../models/Project.js";
import User from "../models/User.js";


/* CREATE */
export const createProject = async (req, res) => {
  console.log('Received a create project request');
  try {
    // Extract data from FormData
    const { userId, name, description, startDate, endDate } = req.body;

    // Find the user based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Handle the public/assets image upload
    let projectImagePath = null;
    if (req.file) {
      projectImagePath = `/assets/${req.file.originalname}`;
      // Save the public/assets image path to the project
    }

    // Create the project
    const project = await Project.create({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name,
      description,
      startDate,
      endDate,
      projectImage: projectImagePath, // Use the correct field name
      // Add other fields as needed
    });

    // Respond with the created project
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error saving the project.' });
  }
};


/* READ */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* UPDATE */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, currentStatus } = req.body;
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, startDate, endDate, currentStatus },
      { new: true }
    );
    res.status(200).json(project);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* DELETE */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* SEARCH PROJECTS BY NAME */
export const searchProjects = async (req, res) => {
  try {
    const { name } = req.query;

    // Perform a case-insensitive search on the name field
    const projects = await Project.find({ name: { $regex: new RegExp(name, 'i') } });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
