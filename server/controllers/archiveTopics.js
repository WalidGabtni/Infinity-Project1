import Project from '../models/Project.js';

// Create a new archive topic within a project
export const createArchiveTopic = async (req, res) => {
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

    project.archiveTopics.push(newTopic);
    await project.save();

    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating archive topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all archive topics within a project
export const getArchiveTopics = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const archiveTopics = project.archiveTopics;
    res.status(200).json(archiveTopics);
  } catch (error) {
    console.error('Error getting archive topics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update an archive topic within a project
export const updateArchiveTopic = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;
    const { title, content } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const archiveTopic = project.archiveTopics.id(topicId);
    if (!archiveTopic) {
      return res.status(404).json({ message: 'Archive topic not found' });
    }

    if (title) {
      archiveTopic.title = title;
    }
    if (content) {
      archiveTopic.content = content;
    }

    await project.save();

    res.status(200).json(archiveTopic);
  } catch (error) {
    console.error('Error updating archive topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an archive topic within a project
export const deleteArchiveTopic = async (req, res) => {
  try {
    const { projectId, topicId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const archiveTopic = project.archiveTopics.id(topicId);
    if (!archiveTopic) {
      return res.status(404).json({ message: 'Archive topic not found' });
    }

    archiveTopic.remove();
    await project.save();

    res.status(200).json({ message: 'Archive topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting archive topic:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

