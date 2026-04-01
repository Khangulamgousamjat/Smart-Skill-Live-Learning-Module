import { db } from '../config/db.js';
import { getIO } from '../config/socket.js';

/**
 * Get conversation history between two users
 * GET /api/messages/:userId
 */
export const getMessages = async (req, res) => {
  const currentUserId = req.user.id;
  const targetUserId = req.params.userId;

  try {
    const result = await db.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [currentUserId, targetUserId]
    );

    // Mark messages as read
    await db.query(
      `UPDATE messages SET is_read = TRUE 
       WHERE sender_id = $1 AND receiver_id = $2`,
      [targetUserId, currentUserId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

/**
 * Get all active conversations for the current user
 * GET /api/messages/conversations/list
 */
export const getConversations = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db.query(
            `SELECT DISTINCT ON (other_id)
                CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as other_id,
                full_name, profile_photo_url, content as last_message, m.created_at as last_message_at
             FROM messages m
             JOIN users u ON u.id = (CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END)
             WHERE sender_id = $1 OR receiver_id = $1
             ORDER BY other_id, m.created_at DESC`,
            [userId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Get conversations error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
    }
};

/**
 * Send a message (also saved to DB)
 * POST /api/messages
 */
export const sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content) 
       VALUES ($1, $2, $3) RETURNING *`,
      [senderId, receiverId, content]
    );

    const newMessage = result.rows[0];

    // Emit via socket if user is online
    const io = getIO();
    // This part is handled by the socket listener itself if we want real-time only, 
    // but better to trigger it here for guaranteed DB sync.
    // However, the client emits 'send_message' to socket too.
    
    res.json({ success: true, data: newMessage });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};
