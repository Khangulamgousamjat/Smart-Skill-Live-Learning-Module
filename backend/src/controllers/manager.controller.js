import pool from '../config/db.js';

// ─── GET /api/manager/team ─────────────────────────────────────────
export const getMyTeam = async (req, res) => {
  const managerId = req.user.id;
  try {
    // A manager's team is defined as all interns in the same department
    // OR we could have a specific 'assigned_manager_id' in the users table later.
    // For now, let's use the department-based relationship.
    const result = await pool.query(`
      SELECT 
        u.id, u.full_name, u.email, u.profile_photo_url, u.employee_id,
        u.onboarding_completed,
        (SELECT COUNT(*) FROM project_assignments WHERE intern_id = u.id AND status = 'in_progress') as active_tasks,
        (SELECT COUNT(*) FROM project_assignments WHERE intern_id = u.id AND status = 'under_review') as pending_reviews
      FROM users u
      WHERE u.role = 'student' 
      AND u.department_id = (SELECT department_id FROM users WHERE id = $1)
      ORDER BY u.full_name ASC
    `, [managerId]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch team' });
  }
};

// ─── POST /api/manager/evaluations ───────────────────────────────
export const createEvaluation = async (req, res) => {
  const managerId = req.user.id;
  const { intern_id, period_start, period_end, scores, comments } = req.body;

  if (!intern_id || !scores || !period_start || !period_end) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Calculate overall score from the JSON scores object
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const count = Object.values(scores).length;
    const overallScore = total / count;

    const result = await pool.query(
      `INSERT INTO evaluations (intern_id, manager_id, period_start, period_end, scores, comments, overall_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [intern_id, managerId, period_start, period_end, JSON.stringify(scores), comments, overallScore]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to submit evaluation' });
  }
};

// ─── POST /api/manager/projects/assign ─────────────────────────────
export const assignProject = async (req, res) => {
  const managerId = req.user.id;
  const { project_id, intern_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO project_assignments (project_id, intern_id, assigned_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (project_id, intern_id) 
       DO UPDATE SET status = 'todo', assigned_at = NOW()
       RETURNING *`,
      [project_id, intern_id, managerId]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to assign project' });
  }
};

// ─── GET /api/manager/reviews ─────────────────────────────────────
export const getPendingReviews = async (req, res) => {
  const managerId = req.user.id;
  try {
    const result = await pool.query(`
      SELECT 
        pa.id as assignment_id, pa.status, pa.submitted_at, pa.submission_url, pa.submission_notes,
        p.title as project_title,
        u.full_name as intern_name, u.email as intern_email
      FROM project_assignments pa
      JOIN projects p ON pa.project_id = p.id
      JOIN users u ON pa.intern_id = u.id
      WHERE pa.status = 'under_review'
      ORDER BY pa.submitted_at ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch pending reviews' });
  }
};
