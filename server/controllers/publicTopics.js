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
      userId: user._id,
      title,
      content,
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
      content: topic.content
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
    const publicTopic = project.topics.find(topic => topic._id === topicId);
    if (!publicTopic) {
      return res.status(404).json({ message: 'Public topic not found' });
    }

    // Send the public topic details in the response
    res.status(200).json(publicTopic);
  } catch (error) {
    console.error('Error getting public topic details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};