import app from './src/app.js';
import { db } from './src/config/db.js';
import { initializeSocket } from './src/config/socket.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SSLLM Backend Entry Point
 * ----------------------------
 * This module creates the HTTP server and initializes the Socket.io
 * engine for real-time messaging and notifications.
 */

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSocket Gateway
const io = initializeSocket(server);
app.set('io', io);

// Initial Database Setup
db.setupDatabase();

server.listen(port, () => {
  console.log('---------------------------------------------------------');
  console.log(`🚀 SSLLM Backend Authority online at PORT: ${port}`);
  console.log(`📡 WebSocket Gateway Pulse: Active`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('---------------------------------------------------------');
});