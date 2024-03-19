import Notification from "../models/Notification.js";
import Project from "../models/Project.js";

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

    // Find the notification by ID
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    // Update the notification status to 'accepted'
    notification.status = 'accepted';
    await notification.save();

    res.status(200).json({ message: 'Join request accepted successfully.' });
  } catch (error) {
    console.error('Error accepting join request:', error);
    res.status(500).json({ message: 'Error accepting join request.' });
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

