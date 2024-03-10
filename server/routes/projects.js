import express from "express";
import { createProject, getAllProjects, updateProject, deleteProject, searchProjects, joinProject, getProjectMembers} from "../controllers/projects.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

/* CREATE */
router.post("/", verifyToken, createProject);

/* READ */
router.get("/", verifyToken, getAllProjects);

/* UPDATE */
router.patch("/:id", verifyToken, updateProject);

/* DELETE */
router.delete("/:id", verifyToken, deleteProject);

/* SEARCH */
router.get("/search", verifyToken, searchProjects);

// Join a project
router.post('/:projectId/join', joinProject);

// Fetch members for a project
router.get('/:projectId/members', verifyToken, getProjectMembers);

export default router;