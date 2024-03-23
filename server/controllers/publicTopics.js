import Project from '../models/Project.js';



// Create a new public topic within a project
export const createPublicTopic = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, content } = req.body;

    // Find the project by ID
    const project = await Project.findById(projectId);

    // Ensure that the project exists
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create a new topic object with the required fields
    const newTopic = {
      title,
      content,
      createdAt: new Date(),
      // Add other properties as needed
    };

    // Push the new topic into the 'topics' array
    project.topics.push(newTopic);

    // Save the updated project with the new topic
    await project.save();

    // Return a success response
    res.status(201).json(newTopic);
  } catch (error) {
    // Handle errors
    console.error('Error creating public topic:', error);
    res.status(500).json({ message: 'Failed to create public topic' });
  }
};




// Get all public topics within a project
export const getPublicTopics = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const publicTopics = project.publicTopics;
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

