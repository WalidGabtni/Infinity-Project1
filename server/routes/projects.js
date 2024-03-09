import express from "express";
import { createProject, getAllProjects, updateProject, deleteProject, searchProjects ,joinProject} from "../controllers/projects.js";
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

export default router;
