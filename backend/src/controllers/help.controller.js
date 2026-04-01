import { db } from '../config/db.js';

/**
 * Get all active help requests for projects
 * GET /api/help-board
 */
export const getHelpRequests = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT h.*, u.full_name, u.profile_photo_url, p.title as project_title, d.name as department_name
       FROM project_help_requests h
       JOIN users u ON h.requester_id = u.id
       LEFT JOIN personal_projects p ON h.project_id = p.id
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY h.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Get help requests error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch help requests' });
  }
};

/**
 * Create a new help request
 * POST /api/help-board
 */
export const createHelpRequest = async (req, res) => {
  const requesterId = req.user.id;
  const { project_id, issue_description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO project_help_requests (project_id, requester_id, issue_description) 
       VALUES ($1, $2, $3) RETURNING *`,
      [project_id || null, requesterId, issue_description]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Create help request error:', err);
    res.status(500).json({ success: false, message: 'Failed to create help request' });
  }
};

/**
 * Toggle status of help request
 * PATCH /api/help-board/:id/status
 */
export const updateHelpStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      `UPDATE project_help_requests SET status = $1, updated_at = NOW() 
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Update help status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update help status' });
  }
};
