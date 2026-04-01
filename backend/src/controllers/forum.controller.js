import { db } from '../config/db.js';

/**
 * Get all forum posts for a department
 * GET /api/forums/:deptId
 */
export const getForumPosts = async (req, res) => {
  const { deptId } = req.params;
  try {
    const result = await db.query(
      `SELECT p.*, u.full_name, u.profile_photo_url, 
              (SELECT COUNT(*) FROM forum_comments WHERE post_id = p.id) as comment_count
       FROM forum_posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.department_id = $1
       ORDER BY p.created_at DESC`,
      [deptId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get forum posts error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch forum posts' });
  }
};

/**
 * Create a new forum post
 * POST /api/forums
 */
export const createForumPost = async (req, res) => {
  const authorId = req.user.id;
  const { department_id, title, content } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO forum_posts (author_id, department_id, title, content) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [authorId, department_id, title, content]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Create forum post error:', err);
    res.status(500).json({ success: false, message: 'Failed to create forum post' });
  }
};

/**
 * Get comments for a post
 * GET /api/forums/post/:postId/comments
 */
export const getForumComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await db.query(
      `SELECT c.*, u.full_name, u.profile_photo_url 
       FROM forum_comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get forum comments error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch forum comments' });
  }
};

/**
 * Add a comment to a forum post
 * POST /api/forums/post/:postId/comment
 */
export const addForumComment = async (req, res) => {
  const authorId = req.user.id;
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO forum_comments (post_id, author_id, content) 
       VALUES ($1, $2, $3) RETURNING *`,
      [postId, authorId, content]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Add forum comment error:', err);
    res.status(500).json({ success: false, message: 'Failed to add forum comment' });
  }
};
