import { db } from '../config/db.js';

export const getDepartments = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, description FROM departments
       WHERE is_active = true ORDER BY name ASC`
    );
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get departments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch departments'
    });
  }
};
