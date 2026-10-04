import Project from "../models/Project.js";
import Notification from '../models/Notification.js';
import User from "../models/User.js";
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

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

    // Handle the public/assets image upload for projectImage
    let projectImagePath = null;
    if (req.files && req.files['projectImage']) {
      projectImagePath = `/assets/${req.files['projectImage'][0].originalname}`;
      
    }

    // Handle the public/assets image upload for projectCover
    let projectCoverPath = null;
    if (req.files && req.files['projectCover']) {
      projectCoverPath = `/assets/${req.files['projectCover'][0].originalname}`;
      
    }

        // Define the role for the user creating the project
        const creatorRole = 'Project Owner';

    // Create the project
    const project = await Project.create({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
      name,
      description,
      startDate,
      endDate,
      projectImage: projectImagePath,
      projectCover: projectCoverPath,
      members: [{ 
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        picturePath: user.picturePath,
        role: creatorRole,
      }] 
      
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
    const { name, description, startDate, endDate, projectImage, projectCover } = req.body;

    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, description, startDate, endDate, projectImage, projectCover },
      { new: true }
    );

    // Check if the project was found and updated
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Respond with the updated project
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
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
    const { userId } = req.body;

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

    // Create a new notification for the project owner
    const notification = await Notification.create({
      sender: userId,
      recipient: project.userId, 
      project: projectId,
    });

    // Add the join request to the project's pendingRequests
    project.pendingRequests.push({
      userId: userId,
      notificationId: notification._id,
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
      userPicturePath: user.userPicturePath,
      occupation: user.occupation,
    });

    // Save the updated project
    await project.save();

    res.status(200).json({ message: 'Join request sent successfully.', notification });
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

    // Extract and return the members of the project with additional information including email
    const members = [];

    for (const member of project.members) {
      const user = await User.findById(member.userId);

      if (!user) {
        console.log(`User not found for userId: ${member.userId}`);
        continue; 
      }

      const memberWithEmail = {
        userId: member.userId,
        firstName: member.firstName,
        lastName: member.lastName,
        email: user.email, 
        picturePath: member.picturePath,
        userPicturePath: member.userPicturePath,
        occupation: member.occupation,
        role: member.role,
      };

      members.push(memberWithEmail);
    }

    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ message: 'Error fetching project members.' });
  }
};


/* MY PROJECTS */
export const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find projects where the user is a member
    const projects = await Project.find({
      'members.userId': userId,
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* GET PROJECT DESCRIPTION */
export const getProjectDescription = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project based on the projectId
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Respond with the project description
    res.status(200).json({ description: project.description });
  } catch (error) {
    console.error('Error fetching project description:', error);
    res.status(500).json({ message: 'Error fetching project description.' });
  }
};


/* LEAVE PROJECT */
export const leaveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    // Log the user ID for debugging
    console.log('User ID:', userId);

    // Find the project based on the projectId
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Log project member IDs for debugging
    console.log('Project members:', project.members.map(member => member.userId));

    // Check if the user is a member of the project
    const isMember = project.members.some((member) => member.userId === userId);
    if (!isMember) {
      return res.status(400).json({ message: 'You are not a member of this project.' });
    }

    // Remove the member who is leaving from the members array
    project.members = project.members.filter(member => member.userId !== userId);

    // Save the updated project
    await project.save();

    res.status(200).json({ message: 'Left the project successfully.' });
  } catch (error) {
    console.error('Error leaving project:', error);
    res.status(500).json({ message: 'Error leaving the project.' });
  }
};

// Controller to remove a member from a project
export const removeMemberFromProject = async (req, res) => {
  const { projectId, memberId } = req.params;

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if the member exists in the project
    const memberToRemove = project.members.find(member => member.userId.toString() === memberId);

    if (!memberToRemove) {
      return res.status(404).json({ message: 'Member not found in the project.' });
    }

    // Remove the member from the project's members array
    project.members = project.members.filter(member => member.userId.toString() !== memberId);
    await project.save();

    res.status(200).json({ message: 'Member removed successfully.' });
  } catch (error) {
    console.error('Error removing member from project:', error);
    res.status(500).json({ message: 'Failed to remove member from project.' });
  }
};


// Controller to update a member's role in a project by the project owner
export const updateMemberRoleInProject = async (req, res) => {
  const { projectId, memberId } = req.params;
  const { newRole } = req.body;

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if the user making the request is the project owner or an admin
    const userIdFromToken = req.user && req.user.id;

    if (!userIdFromToken) {
      return res.status(403).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const isAdmin = project.members.some(member => member.userId.toString() === userIdFromToken && member.role === 'Admin');
    const isOwner = String(project.userId) === String(userIdFromToken);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Unauthorized: Only the project owner or an admin can change member roles.' });
    }

    // Find the member in the project's members array
    const memberToUpdate = project.members.find(member => member.userId.toString() === memberId);

    if (!memberToUpdate) {
      return res.status(404).json({ message: 'Member not found in the project.' });
    }

    // Update the member's role
    memberToUpdate.role = newRole;
    await project.save();

    res.status(200).json({ message: 'Member role updated successfully.', updatedMember: memberToUpdate });
  } catch (error) {
    console.error('Error updating member role in project:', error);
    res.status(500).json({ message: 'Failed to update member role in project.' });
  }
};
