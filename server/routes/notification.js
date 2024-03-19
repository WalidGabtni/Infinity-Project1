import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { sendJoinRequest, acceptJoinRequest,getNotifications } from '../controllers/notification.js';

const router = express.Router();

// Route to send a join request
router.post('/join-request/:projectId', verifyToken, sendJoinRequest);

// Route to accept a join request
router.patch('/accept-join-request/:notificationId', verifyToken, acceptJoinRequest);

router.get('/:userId/notifications',verifyToken, getNotifications);

export default router;