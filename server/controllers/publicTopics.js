import Project from '../models/Project.js';
import User from '../models/User.js';



// Create a new public topic within a project
export const createPublicTopic = async (req, res) => {
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

    // Create a new topic object with the required fields
    const newTopic = {
      userId: user._id, // Use the ObjectId of the user
      title,
      content,
      createdBy: user._id, // Use the ObjectId of the user for createdBy field
      createdAt: new Date(),
      // Add other properties as needed
    };

    console.log('New Topic:', newTopic);

    // Push the new topic into the 'topics' array
    project.topics.push(newTopic);

    // Save the updated project with the new topic
    await project.save();

    console.log('Topic created successfully');

    // Respond with the created topic
    res.status(201).json(newTopic);
  } catch (error) {
    // Handle errors
    console.error('Error creating public topic:', error);
    res.status(500).json({ message: 'Error creating public topic' });
  }
};



// Get the title and content of public topics within a project
export const getPublicTopics = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const publicTopics = project.topics.map(topic => ({
      _id: topic._id, // Ensure each topic has a unique identifier
      title: topic.title,
      content: topic.content,
      createdBy: topic.createdBy // Include createdBy details
    }));
    res.status(200).json(publicTopics);
  } catch (error) {
    console.error('Error getting public topics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Update a public topic within a project
export const updatePublicTopic = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;
    const { title, content } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const publicTopic = project.publicTopics.id(topicId);
    if (!publicTopic) {
      return res.status(404).json({ message: 'Public topic not found' });
    }

    if (title) {
      publicTopic.title = title;
    }
    if (content) {
      publicTopic.content = content;
    }

    await project.save();

    res.status(200).json(publicTopic);
  } catch (error) {
    console.error('Error updating public topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a public topic within a project
export const deletePublicTopic = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const publicTopic = project.publicTopics.id(topicId);
    if (!publicTopic) {
      return res.status(404).json({ message: 'Public topic not found' });
    }

    publicTopic.remove();
    await project.save();

    res.status(200).json({ message: 'Public topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting public topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller function to fetch details of a specific public topic within a project
export const getPublicTopicDetails = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the public topic within the project based on the topicId
    const publicTopic = project.topics.id(topicId);
    if (!publicTopic) {
      return res.status(404).json({ message: 'Public topic not found' });
    }

    // Fetch the user who created the topic
    const createdByUser = await User.findById(publicTopic.createdBy);

    // Construct the response object with populated createdBy details, createdAt, and userId
    const publicTopicDetails = {
      _id: publicTopic._id,
      title: publicTopic.title,
      content: publicTopic.content,
      createdAt: publicTopic.createdAt, // Add createdAt field
      createdBy: {
        userId: publicTopic.createdBy, // Add userId field
        firstName: createdByUser.firstName,
        lastName: createdByUser.lastName,
        picturePath: createdByUser.picturePath
      }
    };

    // Send the response
    res.status(200).json(publicTopicDetails);
  } catch (error) {
    console.error('Error getting public topic details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a comment to a specific topic within a project
export const addCommentToTopic = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;
    const { comment, userId } = req.body;

    console.log('Adding comment to topic:', { projectId, topicId, comment, userId });

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found:', projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the topic within the project based on the topicId
    const topic = project.topics.id(topicId);
    if (!topic) {
      console.log('Topic not found:', topicId);
      return res.status(404).json({ message: 'Topic not found' });
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

    // Push the new comment into the 'comments' array of the topic
    topic.comments.push(newComment);

    // Save the updated project with the new comment
    await project.save();

    console.log('Comment added successfully:', newComment);

    // Respond with the created comment
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment to topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get comments for a specific topic
export const getTopicComments = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;
    
    console.log(`Fetching comments for projectId: ${projectId}, topicId: ${topicId}`);

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('Project found:', project);

    // Find the topic within the project based on the topicId
    const topic = project.topics.id(topicId);
    if (!topic) {
      console.log('Topic not found');
      return res.status(404).json({ message: 'Topic not found' });
    }

    console.log('Topic found:', topic);

    // Extract comments from the topic
    const comments = topic.comments;

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

    // Return comments for the topic with createdBy populated
    console.log('Returning comments for the topic with createdBy populated');
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments for topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




