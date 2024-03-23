import Project from '../models/Project.js';

// Create a new private topic within a project
export const createPrivateTopic = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, content } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newTopic = {
      title,
      content,
      // Add other topic properties as needed
    };

    project.privateTopics.push(newTopic);
    await project.save();

    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating private topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all private topics within a project
export const getPrivateTopics = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const privateTopics = project.privateTopics;
    res.status(200).json(privateTopics);
  } catch (error) {
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


