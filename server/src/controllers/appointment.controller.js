import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
import DoctorAvailability from "../models/DoctorAvailability.js";

import { validateAppointment } from "../validators/appointment.validator.js";

import {
  calculateAppointmentTime,
} from "../services/appointment.service.js";