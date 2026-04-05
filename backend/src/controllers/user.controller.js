import { db } from '../config/db.js';

/**
 * Get all users with pagination and filtering
 * GET /api/users
 */
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'newest';
    const offset = (page - 1) * limit;

    // Build order by clause
    let orderBy = 'created_at DESC';
    if (sort === 'oldest') orderBy = 'created_at ASC';
    if (sort === 'name') orderBy = 'full_name ASC';

    // Fetch users with department name
    const result = await db.query(
      `SELECT u.id, u.full_name, u.email, u.role, u.account_status, 
              u.created_at, u.last_active, d.name as department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY ${orderBy}
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Get total count for pagination
    const countResult = await db.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

/**
 * Get single user profile
 * GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT u.*, d.name as department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password_hash, ...user } = result.rows[0];
    return res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
};

/**
 * Update user profile (detailed fields)
 * PUT /api/users/me
 */
export const updateProfile = async (req, res) => {
  try {
    const {
      first_name, last_name, gender,
      career_objective, professional_title,
      location, skills_list,
      linkedin_url, github_url, bio, phone
    } = req.body;

    await db.query(
      `UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        full_name = CASE
          WHEN $1 IS NOT NULL AND $2 IS NOT NULL
          THEN CONCAT($1, ' ', $2)
          ELSE full_name
        END,
        gender = $3,
        career_objective = $4,
        professional_title = $5,
        location = $6,
        skills_list = $7,
        linkedin_url = $8,
        github_url = $9,
        bio = $10,
        phone = $11,
        is_profile_completed = TRUE,
        updated_at = NOW()
      WHERE id = $12`,
      [
        first_name, last_name, gender,
        career_objective, professional_title,
        location, skills_list || [],
        linkedin_url, github_url,
        bio, phone, req.user.id
      ]
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (e) {
    console.error('Profile update error:', e);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

/**
 * Add education entry
 * POST /api/users/me/education
 */
export const addEducation = async (req, res) => {
  try {
    const {
      degree, institution, board,
      start_year, end_year, percentage, is_current
    } = req.body;

    if (!degree || !institution) {
      return res.status(400).json({
        success: false,
        message: 'Degree and institution are required'
      });
    }

    const result = await db.query(
      `INSERT INTO user_education
       (user_id, degree, institution, board,
        start_year, end_year, percentage, is_current)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        req.user.id, degree, institution, board,
        start_year, end_year, percentage,
        is_current || false
      ]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (e) {
    console.error('Add education error:', e);
    return res.status(500).json({
      success: false, message: 'Failed to add education'
    });
  }
};

/**
 * Get my education
 * GET /api/users/me/education
 */
export const getEducation = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM user_education
       WHERE user_id = $1
       ORDER BY end_year DESC NULLS FIRST`,
      [req.user.id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (e) {
    console.error('Get education error:', e);
    return res.status(500).json({ success: false });
  }
};

/**
 * Delete education entry
 * DELETE /api/users/me/education/:id
 */
export const deleteEducation = async (req, res) => {
  try {
    await db.query(
      `DELETE FROM user_education
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    return res.json({ success: true });
  } catch (e) {
    console.error('Delete education error:', e);
    return res.status(500).json({ success: false });
  }
};

/**
 * Get public profile logic
 * GET /api/users/public/:id
 */
export const getPublicProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const userResult = await db.query(
      `SELECT u.id, u.full_name, u.role, u.bio, u.profile_photo_url, d.name as department_name,
              g.total_xp, g.current_level, g.badges
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN gamification g ON u.id = g.user_id
       WHERE u.id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: userResult.rows[0]
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch public profile' });
  }
};

/**
 * Get Global Leaderboard
 * GET /api/users/leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.full_name, u.profile_photo_url, d.name as department_name,
              g.total_xp, g.current_level
       FROM gamification g
       JOIN users u ON g.user_id = u.id
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY g.total_xp DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};
