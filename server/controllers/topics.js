import Topic from "../models/Topic.js";
import mongoose from "mongoose";

/* CREATE */
export const createTopic = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    // Validate if title is present
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const newTopic = new Topic({
      userId,
      title,
      content,
      // Other fields you may want to include
    });

    await newTopic.save();

    res.status(201).json(newTopic);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* UPDATE */
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Check if the topic ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid topic ID" });
    }

    // Check if the topic exists
    const existingTopic = await Topic.findById(id);

    if (!existingTopic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // Update the topic fields
    existingTopic.title = title || existingTopic.title;
    existingTopic.content = content || existingTopic.content;
    // Other fields you may want to update

    // Save the updated topic
    const updatedTopic = await existingTopic.save();

    res.status(200).json(updatedTopic);
  } catch (error) {
    console.error("Error updating topic:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* DELETE */
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the topic ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid topic ID" });
    }

    const deletedTopic = await Topic.findByIdAndDelete(id);

    if (!deletedTopic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Error deleting topic:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
