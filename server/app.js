import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "../server/src/routes/auth.routes.js";
import testRoutes from "../server/src/routes/test.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ClinicConnect API Running",
  });
});

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/appointments", appointmentRoutes);

export default app;