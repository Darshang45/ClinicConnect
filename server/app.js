import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "../server/src/routes/auth.routes.js";
import testRoutes from "../server/src/routes/test.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import userRoutes from "../server/src/routes/user.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import doctorRoutes from "./src/routes/doctor.routes.js";
import patientRoutes from "./src/routes/patient.routes.js";
import availabilityRoutes from "./src/routes/availability.routes.js";



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
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/availability", availabilityRoutes);

export default app;