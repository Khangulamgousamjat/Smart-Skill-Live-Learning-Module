import pool from '../config/db.js';

// ─── GET /api/expert/lectures ───────────────────────────────────
export const getMyLectures = async (req, res) => {
  const expertId = req.user.id;
  try {
    const query = `
      SELECT id, title, description, scheduled_time as time, link, status 
      FROM lectures 
      WHERE expert_id = $1 
      ORDER BY scheduled_time ASC
    `;
    const result = await pool.query(query, [expertId]);
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    console.error('get expert lectures error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving lectures.' });
  }
};

// ─── POST /api/expert/lectures ──────────────────────────────────
export const scheduleLecture = async (req, res) => {
  const expertId = req.user.id;
  const { title, description, scheduledTime, link } = req.body;

  try {
    const query = `
      INSERT INTO lectures (expert_id, title, description, scheduled_time, link, status)
      VALUES ($1, $2, $3, $4, $5, 'upcoming')
      RETURNING id, title, scheduled_time as time, status
    `;
    const result = await pool.query(query, [expertId, title, description || '', scheduledTime, link || '']);
    res.status(201).json({ success: true, message: 'Lecture scheduled.', data: result.rows[0] });
  } catch (error) {
    console.error('schedule lecture error:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule lecture.' });
  }
};

// ─── GET /api/expert/resources ──────────────────────────────────
export const getMyResources = async (req, res) => {
  const expertId = req.user.id;
  try {
    // We'll mock returning a list of files or resource links for now, 
    // assuming a hypothetical `resources` table linked by uploader_id.
    const query = `
      SELECT id, title, type, url, created_at 
      FROM resources 
      WHERE uploader_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [expertId]);
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    console.error('get resources error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resources.' });
  }
};

// ─── POST /api/expert/resources ─────────────────────────────────
export const uploadResource = async (req, res) => {
  const expertId = req.user.id;
  const { title, type, url } = req.body;
  try {
    const query = `
      INSERT INTO resources (uploader_id, title, type, url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, type, url, created_at
    `;
    const result = await pool.query(query, [expertId, title, type, url]);
    res.status(201).json({ success: true, message: 'Resource shared.', data: result.rows[0] });
  } catch (error) {
    console.error('upload resource error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload resource.' });
  }
};

// ─── GET /api/expert/qna ────────────────────────────────────────
export const getPendingQuestions = async (req, res) => {
  const expertId = req.user.id;
  try {
    const query = `
      SELECT qa.id, qa.question, qa.is_answered, u.first_name, u.last_name, l.title as lecture_title
      FROM qa_questions qa
      JOIN lectures l ON qa.lecture_id = l.id
      JOIN users u ON qa.student_id = u.id
      WHERE l.expert_id = $1 AND qa.is_answered = false
      ORDER BY qa.created_at ASC
    `;
    const result = await pool.query(query, [expertId]);
    res.json({ success: true, count: result.rowCount, data: result.rows });
  } catch (error) {
    console.error('get Q&A error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve questions.' });
  }
};

// ─── POST /api/expert/qna/:qaId/answer ──────────────────────────
export const answerQuestion = async (req, res) => {
  const expertId = req.user.id;
  const { qaId } = req.params;
  const { answer } = req.body;

  try {
    // Update the question using the expert_id check through the lecture
    const query = `
      UPDATE qa_questions 
      SET answer = $1, is_answered = true, answered_at = NOW()
      WHERE id = $2 AND lecture_id IN (SELECT id FROM lectures WHERE expert_id = $3)
      RETURNING id, is_answered
    `;
    const result = await pool.query(query, [answer, qaId, expertId]);
    
    if (result.rowCount === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized or invalid question.' });
    }
    
    res.json({ success: true, message: 'Question answered successfully.' });
  } catch (error) {
    console.error('answer Q&A error:', error);
    res.status(500).json({ success: false, message: 'Failed to save answer.' });
  }
};
