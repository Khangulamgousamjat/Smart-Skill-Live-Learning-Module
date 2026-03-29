import pool from '../config/db.js';

// ─── GET /api/hr/interns ──────────────────────────────────────────
export const getAllInterns = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.full_name, u.email, u.account_status, u.profile_photo_url,
        u.employee_id, u.created_at, u.last_active,
        d.name AS department_name,
        oc.checklist_completed,
        (SELECT COUNT(*) FROM project_assignments WHERE intern_id = u.id AND status = 'completed') as completed_projects
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN onboarding_checklist oc ON u.id = oc.intern_id
      WHERE u.role = 'student'
      ORDER BY u.full_name ASC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch interns' });
  }
};

// ─── GET /api/hr/attendance ───────────────────────────────────────
export const getAttendanceLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        la.id, la.joined_at, la.duration_watched_minutes,
        u.full_name as intern_name,
        l.title as lecture_title, l.scheduled_at
      FROM lecture_attendance la
      JOIN users u ON la.intern_id = u.id
      JOIN lectures l ON la.lecture_id = l.id
      ORDER BY la.joined_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance logs' });
  }
};

// ─── GET /api/hr/onboarding-status ────────────────────────────────
export const getOnboardingStatus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        oc.*,
        u.full_name, u.email
      FROM onboarding_checklist oc
      JOIN users u ON oc.intern_id = u.id
      ORDER BY oc.updated_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch onboarding status' });
  }
};
