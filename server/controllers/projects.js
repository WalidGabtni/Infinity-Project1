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


/* JOIN PROJECT */
export const joinProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, firstName, lastName } = req.body;

    // Find the user based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the project based on the projectId
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check if the user is already a member of the project
    const isMember = project.members.some((member) => member.userId === userId);
    if (isMember) {
      return res.status(400).json({ message: 'User is already a member of the project.' });
    }

    // Add the user to the members list
    project.members.push({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Save the updated project
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error('Error joining project:', error);
    res.status(500).json({ message: 'Error joining the project.' });
  }
};