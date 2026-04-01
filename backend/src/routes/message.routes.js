import express from 'express';
import { getMessages, getConversations, sendMessage } from '../controllers/message.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/conversations/list', getConversations);
router.get('/:userId',           getMessages);
router.post('/',                  sendMessage);

export default router;
