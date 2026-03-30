import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';

export const runAdminSeeder = async () => {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL
      || 'gousk2004@gmail.com';
    const password = process.env.SUPER_ADMIN_PASSWORD
      || 'Kingkhan@12';
    const name = process.env.SUPER_ADMIN_NAME
      || 'Super Admin';

    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      console.log('ℹ️ Super Admin already exists');
      return;
    }

    const hash = await bcrypt.hash(password, 12);

    await db.query(
      `INSERT INTO users
       (full_name, email, password_hash, role,
        account_status, is_email_verified)
       VALUES ($1, $2, $3, 'super_admin', 'active', true)`,
      [name, email, hash]
    );

    console.log('✅ Super Admin seeded — Gous org');
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
  }
};
