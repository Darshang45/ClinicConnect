import dotenv from "dotenv";

dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./src/config/db.js";

import initializeSocket from "./src/socket/socket.js";

const PORT = process.env.PORT || 5000;

/* ===========================================================
   HTTP Server
=========================================================== */

const server = http.createServer(app);

/* ===========================================================
   Socket.IO
=========================================================== */

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

/* ===========================================================
   Socket Events Initialization
=========================================================== */

initializeSocket(io);

/* ===========================================================
   Start Server
=========================================================== */

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`⚡ Socket.IO running`);
    });

  } catch (error) {

    console.error(error);

    process.exit(1);

  }
};

startServer();