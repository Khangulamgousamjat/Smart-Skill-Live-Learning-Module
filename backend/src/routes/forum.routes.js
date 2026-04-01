import express from 'express';
import { 
  getForumPosts, 
  createForumPost, 
  getForumComments, 
  addForumComment 
} from '../controllers/forum.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/:deptId',              getForumPosts);
router.post('/',                    createForumPost);
router.get('/post/:postId/comments', getForumComments);
router.post('/post/:postId/comment', addForumComment);

export default router;
