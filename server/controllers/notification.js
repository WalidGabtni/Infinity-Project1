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
    const userId = req.user.id; // Get the authenticated user's ID from the request object

    console.log('Accepting join request...');
    console.log('Notification ID:', notificationId);
    console.log('User ID:', userId);

    // Step 1: Verify Notification Existence
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      console.log('Notification not found.');
      return res.status(404).json({ message: 'Notification not found.' });
    }

    // Step 2: Ensure User Authorization
    if (notification.recipient.toString() !== userId) {
      console.log('Unauthorized: User is not the recipient of this notification.');
      return res.status(403).json({ message: 'Unauthorized: User is not the recipient of this notification.' });
    }

    // Step 3: Validate Project Ownership
    const project = await Project.findById(notification.project);

    if (!project) {
      console.log('Project not found.');
      return res.status(404).json({ message: 'Project not found.' });
    }

    console.log('Notification:', notification);
    console.log('Project:', project);

    // Check if the user is the owner of the project
    if (project.userId.toString() !== userId) {
      console.log('Unauthorized: User is not the owner of the project.');
      return res.status(403).json({ message: 'Unauthorized: User is not the owner of the project.' });
    }

    // Step 4: Add the user to the project's members array
    const newUser = {
      userId: notification.sender,
      firstName: 'Default', // Provide a default value for firstName
      lastName: 'User', // Provide a default value for lastName
      // You can modify these default values as per your requirements
    };

    project.members.push(newUser);

    // Step 5: Save the updated project
    await project.save();

    // Step 6: Proceed with accepting the join request...
    console.log('Join request accepted successfully.');
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

