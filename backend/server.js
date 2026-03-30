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

async function startServer() {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected');

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
