import Notification from "../models/Notification.js";
import Project from "../models/Project.js";
import User from '../models/User.js';

export const sendJoinRequest = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    // Find the project to get the owner's userId
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Create a new notification for the project owner
    const notification = await Notification.create({
      sender: userId,
      recipient: project.userId, // Use the owner's userId from the project
      project: projectId,
    });

    res.status(200).json({ message: 'Join request sent successfully.', notification });
  } catch (error) {
    console.error('Error sending join request:', error);
    res.status(500).json({ message: 'Error sending join request.' });
  }
};



export const acceptJoinRequest = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    // Step 1: Verify Notification Existence
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    // Step 2: Ensure User Authorization
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: User is not the recipient of this notification.' });
    }

    // Step 3: Validate Project Ownership
    const project = await Project.findById(notification.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if the user is the owner of the project
    if (project.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: User is not the owner of the project.' });
    }

    // Step 4: Update the status of the notification to 'accepted'
    notification.status = 'accepted';
    await notification.save();

    // Step 5: Delete the old notification
    await Notification.findByIdAndDelete(notificationId);

    // Step 6: Add the user to the project's members list
    const user = await User.findById(notification.sender);
    if (user) {
      project.members.push({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        picturePath: user.picturePath,
        // Add any other required user details
      });
      await project.save();
    } else {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Step 7: Remove the join request from pendingRequests
    project.pendingRequests = project.pendingRequests.filter(request => request.notificationId.toString() !== notificationId);

    // Step 8: Save the updated project
    await project.save();

    // Step 9: Create and send notification to the sender
    const sender = await User.findById(notification.sender);
    if (sender) {
      const senderNotification = await Notification.create({
        sender: notification.recipient,
        recipient: sender._id,
        project: project._id,
        status: 'accepted',
      });
      
      // Handle acceptance notification sending (optional)
    }

    return res.status(200).json({ message: 'Join request accepted successfully.' });
  } catch (error) {
    console.error('Error accepting join request:', error);
    return res.status(500).json({ message: 'Error accepting join request.' });
  }
};

export const refuseJoinRequest = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    // Step 1: Verify Notification Existence
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    // Step 2: Ensure User Authorization
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: User is not the recipient of this notification.' });
    }

    // Step 3: Validate Project Ownership
    const project = await Project.findById(notification.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if the user is the owner of the project
    if (project.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized: User is not the owner of the project.' });
    }

    // Step 4: Update the status of the notification to 'rejected'
    await Notification.findByIdAndUpdate(notificationId, { status: 'rejected' });

    // Step 5: Delete the old notification
    await Notification.findByIdAndDelete(notificationId);

    // Step 6: Remove the join request from pendingRequests
    project.pendingRequests = project.pendingRequests.filter(request => request.notificationId.toString() !== notificationId);

    // Step 7: Save the updated project
    await project.save();

    // Step 8: Create and send notification to the sender
    const sender = await User.findById(notification.sender);
    if (sender) {
      const senderNotification = await Notification.create({
        sender: req.user.id,
        recipient: sender._id,
        project: project._id,
        status: 'rejected',
      });
      
      // Handle refusal notification sending (optional)
    }

    return res.status(200).json({ message: 'Join request refused successfully.' });
  } catch (error) {
    console.error('Error refusing join request:', error);
    return res.status(500).json({ message: 'Error refusing join request.' });
  }
};






export const getNotifications = async (req, res) => {
  try {
    // Ensure that only notifications for the logged-in user are fetched
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate({
        path: 'sender', // Populate the sender's information
        model: 'User',
        select: 'firstName lastName picturePath', // Select the fields you want to populate
      })
      .populate('project'); // Populate the project information

    console.log('Notifications:', notifications); // Add this line to log notifications

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications.' });
  }
};

