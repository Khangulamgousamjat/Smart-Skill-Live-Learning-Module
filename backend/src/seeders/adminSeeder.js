import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const seedAdmin = async () => {
  try {
    const existingAdmin = await db.query(
      'SELECT id FROM users WHERE email = $1', 
      [process.env.SUPER_ADMIN_EMAIL]
    );

    if (existingAdmin.rows.length === 0) {
      const hash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 12);
      await db.query(
        `INSERT INTO users 
         (full_name, email, password_hash, role, account_status, is_email_verified)
         VALUES ($1, $2, $3, 'super_admin', 'active', true)`,
        [process.env.SUPER_ADMIN_NAME, process.env.SUPER_ADMIN_EMAIL, hash]
      );
      console.log('✅ Super Admin seeded');
    } else {
      console.log('ℹ️ Super Admin already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};
