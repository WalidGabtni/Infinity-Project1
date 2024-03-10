import Project from "../models/Project.js";
import User from "../models/User.js";
import mongoose from 'mongoose';

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
    const { name, description, startDate, endDate } = req.body;

    // Check if the project ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Check if the project exists
    const existingProject = await Project.findById(id);

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Ensure user is authorized to update the project
    const userIdFromToken = req.user && req.user.id;

    // Ensure project.userId is a valid string before comparison
    if (userIdFromToken && String(existingProject.userId) !== String(userIdFromToken)) {
      console.log("Unauthorized: You can only update your own projects");
      return res.status(403).json({ error: "Unauthorized: You can only update your own projects" });
    }

    // Update the project fields
    existingProject.name = name || existingProject.name;
    existingProject.description = description || existingProject.description;
    existingProject.startDate = startDate || existingProject.startDate;
    existingProject.endDate = endDate || existingProject.endDate;

    // Handle project image update
    if (req.file) {
      existingProject.projectImage = `/assets/${req.file.originalname}`;
    }

    // Save the updated project
    const updatedProject = await existingProject.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




/* DELETE */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user is authorized to delete the project
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Extract user ID from the decoded token
    const userIdFromToken = req.user && req.user.id;

    // Ensure project.userId is a valid string before comparison
    if (userIdFromToken && String(project.userId) === String(userIdFromToken)) {
      console.log("Deleting project with ID:", id);
      console.log("User ID from token:", userIdFromToken);

      await Project.findByIdAndDelete(id);

      return res.status(200).json({ message: "Project deleted successfully" });
    }

    console.log("Unauthorized: You can only delete your own projects");
    return res.status(403).json({ error: "Unauthorized: You can only delete your own projects" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
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


/* JOIN PROJECT */
export const joinProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, firstName, lastName } = req.body;

    // Find the user based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the project based on the projectId
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if the user is already a member of the project
    const isMember = project.members.some((member) => member.userId === userId);
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member of the project.' });
    }

    // Add the user to the members list
    project.members.push({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Save the updated project
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error('Error joining project:', error);
    res.status(500).json({ message: 'Error joining the project.' });
  }
};

/* GET PROJECT MEMBERS */
export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project based on the projectId
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Extract and return the members of the project
    const members = project.members;
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ message: 'Error fetching project members.' });
  }
};

