import pool from '../config/db.js';
import { getOrSetCache } from '../utils/cache.js';

// ─── GET /api/hr/interns ──────────────────────────────────────────
export const getAllInterns = async (req, res) => {
  try {
    const data = await getOrSetCache('hr_all_interns', async () => {
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
      return result.rows;
    });
    res.json({ success: true, data });
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

// ─── GET /api/hr/department-stats ───────────────────────────────
export const getDepartmentStats = async (req, res) => {
  try {
    const data = await getOrSetCache('hr_department_stats', async () => {
      const result = await pool.query(`
        SELECT 
          d.id, d.name,
          COUNT(DISTINCT u.id) as intern_count,
          COALESCE(AVG(la.duration_watched_minutes), 0) as avg_attendance,
          (
            SELECT COUNT(*) 
            FROM project_assignments pa 
            JOIN users u2 ON pa.intern_id = u2.id 
            WHERE u2.department_id = d.id AND pa.status = 'completed'
          ) as completed_projects
        FROM departments d
        LEFT JOIN users u ON d.id = u.department_id AND u.role = 'student'
        LEFT JOIN lecture_attendance la ON u.id = la.intern_id
        GROUP BY d.id, d.name
        ORDER BY intern_count DESC
      `);
      return result.rows;
    });
    
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch department statistics' });
  }
};

// ─── GET /api/hr/certificates ──────────────────────────────────
export const getAllCertificates = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, u.full_name as intern_name, d.name as department_name, 
        c.certificate_type, c.issued_at, c.verification_code, c.pdf_url,
        COALESCE(s.name, p.title, 'General Recognition') as skill_or_project
      FROM certificates c
      JOIN users u ON c.intern_id = u.id
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN skills s ON c.skill_id = s.id
      LEFT JOIN projects p ON c.project_id = p.id
      ORDER BY c.issued_at DESC
    `);
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to retrieve certificates audit trail' });
  }
};
