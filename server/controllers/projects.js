import Project from "../models/Project.js";


/* CREATE */
export const createProject = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { name, description, startDate, endDate, currentStatus } = req.body;

    console.log("name:", name);
    console.log("description:", description);

    // Validate if name is present
    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      currentStatus,
    });

    await newProject.save();

    const projects = await Project.find();

    res.status(201).json(projects);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* UPDATE */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, currentStatus } = req.body;
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, startDate, endDate, currentStatus },
      { new: true }
    );
    res.status(200).json(project);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* DELETE */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* SEARCH PROJECTS BY NAME */
export const searchProjects = async (req, res) => {
  try {
    const { name } = req.query;

    // Perform a case-insensitive search on the name field
    const projects = await Project.find({ name: { $regex: new RegExp(name, 'i') } });

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
