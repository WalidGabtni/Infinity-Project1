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

// Controller function to fetch details of a specific private topic within a project
export const getPrivateTopicDetails = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the private topic within the project based on the topicId
    const privateTopic = project.privateTopics.id(topicId);
    if (!privateTopic) {
      return res.status(404).json({ message: 'Private topic not found' });
    }

    // Fetch the user who created the topic
    const createdByUser = await User.findById(privateTopic.createdBy);

    // Construct the response object with populated createdBy details, createdAt, and userId
    const privateTopicDetails = {
      _id: privateTopic._id,
      title: privateTopic.title,
      content: privateTopic.content,
      createdAt: privateTopic.createdAt, // Add createdAt field
      createdBy: {
        userId: privateTopic.createdBy, // Add userId field
        firstName: createdByUser.firstName,
        lastName: createdByUser.lastName,
        picturePath: createdByUser.picturePath
      }
    };

    // Send the response
    res.status(200).json(privateTopicDetails);
  } catch (error) {
    console.error('Error getting private topic details:', error);
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

    // Find the project by ID and update it to remove the specified topic from privateTopics array
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { privateTopics: { _id: topicId } } },
      { new: true } // To return the updated project
    );

    // Check if the project was found and updated successfully
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found or topic not deleted' });
    }

    res.status(200).json({ message: 'Private topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting private topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a comment to a specific private topic within a project
export const addCommentToPrivateTopic = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;
    const { comment, userId } = req.body;

    console.log('Adding comment to private topic:', { projectId, topicId, comment, userId });

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found:', projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the private topic within the project based on the topicId
    const privateTopic = project.privateTopics.id(topicId);
    if (!privateTopic) {
      console.log('Private topic not found:', topicId);
      return res.status(404).json({ message: 'Private topic not found' });
    }

    // Ensure that the comment and userId are provided
    if (!comment || !userId) {
      console.log('Comment or userId is missing');
      return res.status(400).json({ message: 'Comment and userId are required' });
    }

    // Find the user based on the userId and populate firstName, lastName, and picturePath
    const user = await User.findById(userId).select('firstName lastName picturePath');
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new comment object
    const newComment = {
      comment,
      createdBy: user._id, // Use the ObjectId of the user for createdBy field
      firstName: user.firstName,
      lastName: user.lastName,
      picturePath: user.picturePath,
    };

    // Push the new comment into the 'comments' array of the private topic
    privateTopic.comments.push(newComment);

    // Save the updated project with the new comment
    await project.save();

    console.log('Comment added successfully:', newComment);

    // Respond with the created comment
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment to private topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get comments for a specific private topic
export const getPrivateTopicComments = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;
    
    console.log(`Fetching comments for projectId: ${projectId}, private topicId: ${topicId}`);

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('Project found:', project);

    // Find the private topic within the project based on the topicId
    const privateTopic = project.privateTopics.id(topicId);
    if (!privateTopic) {
      console.log('Private topic not found');
      return res.status(404).json({ message: 'Private topic not found' });
    }

    console.log('Private topic found:', privateTopic);

    // Extract comments from the private topic
    const comments = privateTopic.comments;

    console.log('Comments:', comments);

    // Extract user IDs from comments
    const userIds = comments.map(comment => comment.createdBy);

    console.log('User IDs from comments:', userIds);

    // Populate users for comments
    console.log('Fetching users for comments...');
    const users = await User.find({ _id: { $in: userIds } });

    console.log('Fetched users:', users);

    // Map users to comments
    console.log('Mapping users to comments...');
    comments.forEach(comment => {
      const user = users.find(user => user._id.equals(comment.createdBy));
      if (user) {
        comment.createdBy = user; // Update createdBy with user details
      }
    });

    console.log('Comments with populated createdBy:', comments);

    // Return comments for the private topic with createdBy populated
    console.log('Returning comments for the private topic with createdBy populated');
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments for private topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


