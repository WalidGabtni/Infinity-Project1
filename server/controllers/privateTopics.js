import Project from '../models/Project.js';
import User from '../models/User.js';

// Create a new private topic within a project
export const createPrivateTopic = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, title, content } = req.body;

    // Find the project by ID
    const project = await Project.findById(projectId);

    // Ensure that the project exists
    if (!project) {
      console.error('Project not found:', projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Handle the case when userId is not provided in the request body
    if (!userId) {
      console.error('User ID is required');
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find the user based on the userId
    const user = await User.findById(userId);

    // Ensure that the user exists
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is a member of the project
    const isMember = project.members.some(member => member.userId === userId);

    if (!isMember) {
      console.error('User is not a member of the project:', userId);
      return res.status(403).json({ message: 'User is not a member of the project' });
    }

    // Create a new topic object with the required fields
    const newTopic = {
      userId: user._id, // Use the ObjectId of the user
      title,
      content,
      createdBy: user._id, // Use the ObjectId of the user for createdBy field
      createdAt: new Date(),
      // Add other properties as needed
    };

    console.log('New Private Topic:', newTopic);

    // Push the new topic into the 'privateTopics' array
    project.privateTopics.push(newTopic);

    // Save the updated project with the new topic
    await project.save();

    console.log('Private Topic created successfully');

    // Respond with the created topic
    res.status(201).json(newTopic);
  } catch (error) {
    // Handle errors
    console.error('Error creating private topic:', error);
    res.status(500).json({ message: 'Error creating private topic' });
  }
};


// Get the title and content of private topics within a project
export const getPrivateTopics = async (req, res) => {
  try {
    // Extract projectId from request parameters
    const { projectId } = req.params;
    console.log('Fetching private topics for project ID:', projectId); // Log project ID

    // Extract userId from authenticated user in the request object
    const { id: userId } = req.user;
    console.log('User ID:', userId); // Log the user ID

    // Find the project by ID
    const project = await Project.findById(projectId);

    // Ensure that the project exists
    if (!project) {
      console.error('Project not found:', projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is a member of the project
    const isMember = project.members.some(member => member.userId === userId);

    if (!isMember) {
      console.error('User is not a member of the project:', userId);
      return res.status(403).json({ message: 'Forbidden: User is not a member of the project' });
    }

    // Fetch user details for each topic's creator asynchronously
    const privateTopics = await Promise.all(project.privateTopics.map(async topic => {
      const createdByUser = await User.findById(topic.createdBy);
      return {
        _id: topic._id,
        title: topic.title,
        content: topic.content,
        createdAt: topic.createdAt,
        createdBy: {
          userId: topic.createdBy,
          firstName: createdByUser.firstName,
          lastName: createdByUser.lastName,
          picturePath: createdByUser.picturePath
        }
      };
    }));

    console.log('Private topics fetched successfully:', privateTopics);
    res.status(200).json(privateTopics);
  } catch (error) {
    // Handle errors
    console.error('Error getting private topics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






// Update a private topic within a project
export const updatePrivateTopic = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;
    const { title, content } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const privateTopic = project.privateTopics.id(topicId);
    if (!privateTopic) {
      return res.status(404).json({ message: 'Private topic not found' });
    }

    if (title) {
      privateTopic.title = title;
    }
    if (content) {
      privateTopic.content = content;
    }

    await project.save();

    res.status(200).json(privateTopic);
  } catch (error) {
    console.error('Error updating private topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a private topic within a project
export const deletePrivateTopic = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const privateTopic = project.privateTopics.id(topicId);
    if (!privateTopic) {
      return res.status(404).json({ message: 'Private topic not found' });
    }

    privateTopic.remove();
    await project.save();

    res.status(200).json({ message: 'Private topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting private topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


