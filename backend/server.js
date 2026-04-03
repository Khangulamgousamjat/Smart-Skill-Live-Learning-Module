import app from './src/app.js';
import { db } from './src/config/db.js';
import redisClient from './src/config/redis.js';
import { runAdminSeeder } from './src/seeders/adminSeeder.js';
import { initializeSocket } from './src/config/socket.js';
import http from 'http';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Attach Socket.io to the HTTP Server
initializeSocket(server);

async function createTablesIfNotExist() {
  try {
    await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await db.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM (
          'super_admin','hr_admin','manager','expert','student'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await db.query(`
      DO $$ BEGIN
        CREATE TYPE account_status AS ENUM (
          'pending_email','pending_approval',
          'active','rejected','deactivated'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name        VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        manager_id  UUID,
        is_active   BOOLEAN DEFAULT TRUE,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        full_name         VARCHAR(150) NOT NULL,
        email             VARCHAR(255) NOT NULL UNIQUE,
        password_hash     VARCHAR(255) NOT NULL,
        role              user_role NOT NULL DEFAULT 'student',
        department_id     UUID REFERENCES departments(id)
                          ON DELETE SET NULL,
        employee_id       VARCHAR(100),
        profile_photo_url VARCHAR(500),
        bio               TEXT,
        phone             VARCHAR(20),
        is_email_verified BOOLEAN DEFAULT FALSE,
        account_status    account_status DEFAULT 'pending_email',
        rejection_reason  TEXT,
        access_reason     TEXT,
        dark_mode         BOOLEAN DEFAULT FALSE,
        last_active       TIMESTAMP,
        position          VARCHAR(150),
        skills            JSONB DEFAULT '[]',
        social_links      JSONB DEFAULT '{}',
        location          VARCHAR(150),
        is_profile_completed BOOLEAN DEFAULT FALSE,
        created_at        TIMESTAMP DEFAULT NOW(),
        updated_at        TIMESTAMP DEFAULT NOW()
      )
    `);

    // Migration to add columns if they don't exist
    const columnsToAdd = [
      { name: 'position', type: 'VARCHAR(150)' },
      { name: 'skills', type: "JSONB DEFAULT '[]'" },
      { name: 'social_links', type: "JSONB DEFAULT '{}'" },
      { name: 'location', type: 'VARCHAR(150)' },
      { name: 'is_profile_completed', type: 'BOOLEAN DEFAULT FALSE' }
    ];

    for (const col of columnsToAdd) {
      await db.query(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='users' AND column_name='${col.name}') THEN
            ALTER TABLE users ADD COLUMN ${col.name} ${col.type};
          END IF;
        END $$;
      `);
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS role_requests (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id          UUID NOT NULL REFERENCES users(id)
                          ON DELETE CASCADE,
        requested_role   user_role NOT NULL,
        department_id    UUID REFERENCES departments(id)
                          ON DELETE SET NULL,
        employee_id      VARCHAR(100) NOT NULL,
        reason           TEXT NOT NULL,
        status           VARCHAR(20) DEFAULT 'pending',
        reviewed_by      UUID REFERENCES users(id)
                          ON DELETE SET NULL,
        rejection_reason TEXT,
        requested_at     TIMESTAMP DEFAULT NOW(),
        reviewed_at      TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id    UUID NOT NULL REFERENCES users(id)
                   ON DELETE CASCADE,
        otp_code   VARCHAR(6) NOT NULL,
        purpose    VARCHAR(50) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used       BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash   VARCHAR(255) NOT NULL UNIQUE,
        expires_at   TIMESTAMP NOT NULL,
        is_revoked   BOOLEAN DEFAULT FALSE,
        created_at   TIMESTAMP DEFAULT NOW()
      )
    `);

    // --- STUDENT DASHBOARD TABLES ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS personal_projects (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        link        VARCHAR(500),
        status      VARCHAR(50) DEFAULT 'In Progress',
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS learning_roadmaps (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        topic_name  VARCHAR(100) NOT NULL,
        roadmap_json JSONB NOT NULL,
        status      VARCHAR(50) DEFAULT 'Not Started',
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS gamification (
        id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        total_xp             INTEGER DEFAULT 0,
        current_level        INTEGER DEFAULT 1,
        current_streak_days  INTEGER DEFAULT 0,
        last_activity_at     TIMESTAMP DEFAULT NOW(),
        badges               JSONB DEFAULT '[]',
        updated_at           TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_name  VARCHAR(100) NOT NULL,
        badge_icon  VARCHAR(100),
        earned_at   TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title             VARCHAR(255) NOT NULL,
        message           TEXT NOT NULL,
        notification_type VARCHAR(50) NOT NULL,
        is_read           BOOLEAN DEFAULT FALSE,
        read_at           TIMESTAMP,
        action_url        VARCHAR(500),
        created_at        TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content      TEXT NOT NULL,
        is_read      BOOLEAN DEFAULT FALSE,
        created_at   TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name        VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        category    VARCHAR(50),
        is_active   BOOLEAN DEFAULT TRUE,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_skills (
        id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        skill_id  UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        level     INTEGER DEFAULT 0,
        added_at  TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, skill_id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS department_skills (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
        skill_id      UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        is_mandatory  BOOLEAN DEFAULT FALSE,
        created_at    TIMESTAMP DEFAULT NOW(),
        UNIQUE(department_id, skill_id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        author_id            UUID REFERENCES users(id) ON DELETE SET NULL,
        title                VARCHAR(255) NOT NULL,
        body                 TEXT NOT NULL,
        type                 VARCHAR(20) DEFAULT 'info',
        target_role          user_role,
        target_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
        is_active            BOOLEAN DEFAULT TRUE,
        created_at           TIMESTAMP DEFAULT NOW(),
        updated_at           TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
       CREATE TABLE IF NOT EXISTS activity_logs (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
        action      VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id   UUID,
        description TEXT,
        ip_address  VARCHAR(45),
        created_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        department_id    UUID REFERENCES departments(id) ON DELETE SET NULL,
        title            VARCHAR(255) NOT NULL,
        description      TEXT,
        difficulty_level VARCHAR(50) DEFAULT 'Beginner',
        status           VARCHAR(50) DEFAULT 'In Progress',
        deadline         TIMESTAMP,
        max_marks        INTEGER DEFAULT 100,
        created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at       TIMESTAMP DEFAULT NOW(),
        updated_at       TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS project_assignments (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_id       UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        intern_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status           VARCHAR(50) DEFAULT 'todo',
        submission_url   VARCHAR(500),
        submission_notes TEXT,
        submitted_at     TIMESTAMP,
        feedback         TEXT,
        grade            VARCHAR(10),
        created_at       TIMESTAMP DEFAULT NOW(),
        updated_at       TIMESTAMP DEFAULT NOW(),
        UNIQUE(project_id, intern_id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS lectures (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        expert_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
        title         VARCHAR(255) NOT NULL,
        description   TEXT,
        video_url     VARCHAR(500),
        scheduled_at  TIMESTAMP,
        status        VARCHAR(20) DEFAULT 'upcoming',
        is_recorded   BOOLEAN DEFAULT FALSE,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        uploader_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
        title         VARCHAR(255) NOT NULL,
        type          VARCHAR(50) NOT NULL,
        url           VARCHAR(500) NOT NULL,
        created_at    TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS lecture_attendance (
        id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
        intern_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        joined_at  TIMESTAMP DEFAULT NOW(),
        UNIQUE(lecture_id, intern_id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        intern_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        department_id    UUID REFERENCES departments(id) ON DELETE SET NULL,
        title            VARCHAR(255) NOT NULL,
        verification_url VARCHAR(500) UNIQUE,
        issued_at        TIMESTAMP DEFAULT NOW(),
        created_at       TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        intern_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        manager_id    UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        period_start  DATE,
        period_end    DATE,
        scores        JSONB NOT NULL DEFAULT '{}',
        comments      TEXT,
        overall_score DECIMAL(4,2),
        submitted_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS qa_questions (
        id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lecture_id   UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
        student_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question     TEXT NOT NULL,
        answer       TEXT,
        is_answered  BOOLEAN DEFAULT FALSE,
        answered_at  TIMESTAMP,
        created_at   TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        author_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
        title         VARCHAR(255) NOT NULL,
        content       TEXT NOT NULL,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS forum_comments (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        post_id     UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
        author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content     TEXT NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS project_help_requests (
        id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_id         UUID REFERENCES personal_projects(id) ON DELETE CASCADE,
        requester_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        issue_description  TEXT NOT NULL,
        status             VARCHAR(50) DEFAULT 'open',
        created_at         TIMESTAMP DEFAULT NOW(),
        updated_at         TIMESTAMP DEFAULT NOW()
      )
    `);

    // After creating departments table:
    const deptCheck = await db.query(
      'SELECT COUNT(*) FROM departments'
    );
    if (parseInt(deptCheck.rows[0].count) === 0) {
      const defaultDepartments = [
        { name: 'Computer Science',
          description: 'CS and software development' },
        { name: 'Information Technology',
          description: 'IT infrastructure and support' },
        { name: 'Human Resources',
          description: 'HR and people management' },
        { name: 'Finance',
          description: 'Finance and accounting' },
        { name: 'Marketing',
          description: 'Marketing and communications' },
        { name: 'Operations',
          description: 'Business operations' },
        { name: 'Design',
          description: 'UI/UX and graphic design' },
        { name: 'Sales',
          description: 'Sales and business development' },
        { name: 'Data Science',
          description: 'Data analysis and ML' },
        { name: 'Cybersecurity',
          description: 'Security and compliance' },
      ];

      for (const dept of defaultDepartments) {
        await db.query(
          `INSERT INTO departments (name, description)
           VALUES ($1, $2)
           ON CONFLICT (name) DO NOTHING`,
          [dept.name, dept.description]
        );
      }
      console.log('✅ Default departments seeded');
    } else {
      console.log('✅ Departments already exist');
    }

    console.log('✅ All tables ready');
  } catch (error) {
    console.error('❌ Table creation error:', error.message);
    throw error;
  }
}

async function startServer() {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected');

    await createTablesIfNotExist();

    if (redisClient) {
      console.log('✅ Redis connected');
    }

    await runAdminSeeder();

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();
