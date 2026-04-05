import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Pool with max 10 connections as per rules
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = {
  query: (text, params) => pool.query(text, params),
  setupDatabase: async () => {
    try {
      await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      
      await pool.query(`
        ALTER TABLE users
          ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
          ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
          ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
          ADD COLUMN IF NOT EXISTS career_objective TEXT,
          ADD COLUMN IF NOT EXISTS professional_title VARCHAR(150),
          ADD COLUMN IF NOT EXISTS location VARCHAR(150),
          ADD COLUMN IF NOT EXISTS skills_list TEXT[] DEFAULT '{}',
          ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
          ADD COLUMN IF NOT EXISTS github_url VARCHAR(500)
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_education (
          id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id     UUID NOT NULL REFERENCES users(id)
                      ON DELETE CASCADE,
          degree      VARCHAR(200) NOT NULL,
          institution VARCHAR(300) NOT NULL,
          board       VARCHAR(200),
          start_year  INTEGER,
          end_year    INTEGER,
          percentage  VARCHAR(20),
          is_current  BOOLEAN DEFAULT FALSE,
          created_at  TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Database Schema setup completed');
    } catch (e) {
      console.error('❌ Database Setup Error:', e);
    }
  }
};

export default pool;
