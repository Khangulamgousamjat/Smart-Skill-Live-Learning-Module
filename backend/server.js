import http from 'http';
import dotenv from 'dotenv';
import app from './src/app.js';
import { db } from './src/config/db.js';
import redisClient from './src/config/redis.js';
import { seedAdmin } from './src/seeders/adminSeeder.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Check DB Connection
    await db.query('SELECT NOW()');
    console.log('PostgreSQL database connected seamlessly.');
    
    // Seed Super Admin
    await seedAdmin();
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
