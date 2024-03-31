import express from "express";
import { createProject, getAllProjects, updateProject, deleteProject, searchProjects, joinProject, getProjectMembers, getUserProjects, getProjectDescription, leaveProject} from "../controllers/projects.js";
import { verifyToken } from "../middleware/auth.js";
import { createPublicTopic, getPublicTopics, updatePublicTopic, deletePublicTopic, getPublicTopicDetails, addCommentToTopic, getTopicComments} from '../controllers/publicTopics.js';
import { createPrivateTopic, getPrivateTopics, updatePrivateTopic, deletePrivateTopic ,getPrivateTopicDetails,addCommentToPrivateTopic,getPrivateTopicComments} from '../controllers/privateTopics.js';
import { createArchiveTopic, getArchiveTopics, updateArchiveTopic, deleteArchiveTopic } from '../controllers/archiveTopics.js';

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

// Fetch projects for a user
router.get('/projects/user/:userId', getUserProjects);

// Fetch description for a project
router.get('/:projectId/description', verifyToken, getProjectDescription);

// Leave a project
router.post('/:projectId/leave', leaveProject);

// Public Topics Routes
router.post('/:projectId/topics/public', createPublicTopic);
router.get('/:projectId/topics/public', getPublicTopics);
router.patch('/:projectId/topics/public/:topicId/update', verifyToken,updatePublicTopic);
router.delete('/:projectId/topics/public/:topicId/delete', verifyToken,deletePublicTopic);
router.get('/:projectId/topics/public/:topicId', getPublicTopicDetails);
router.post('/:projectId/topics/public/:topicId/comments', addCommentToTopic);
router.get('/:projectId/topics/public/:topicId/all-comments', getTopicComments); // Add this route

// Private Topics Routes
router.post('/:projectId/topics/private', verifyToken, createPrivateTopic);
router.get('/:projectId/topics/private', verifyToken, getPrivateTopics);
router.get('/:projectId/topics/private/:topicId', verifyToken,getPrivateTopicDetails);
router.patch('/:projectId/topics/private/:topicId/update', verifyToken, updatePrivateTopic);
router.delete('/:projectId/topics/private/:topicId/delete', verifyToken, deletePrivateTopic);
router.post('/:projectId/topics/private/:topicId/comments', verifyToken,addCommentToPrivateTopic);
router.get('/:projectId/topics/private/:topicId/all-comments', verifyToken,getPrivateTopicComments);

// Archive Topics Routes
router.post('/:projectId/topics/archive', verifyToken, createArchiveTopic);
router.get('/:projectId/topics/archive', verifyToken, getArchiveTopics);
router.patch('/:projectId/topics/archive/:topicId', verifyToken, updateArchiveTopic);
router.delete('/:projectId/topics/archive/:topicId', verifyToken, deleteArchiveTopic);

export default router;
