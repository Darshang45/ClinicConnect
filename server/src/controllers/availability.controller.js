import DoctorAvailability from "../models/DoctorAvailability.js";
import Doctor from "../models/Doctor.js";
import { validateAvailability } from "../validators/availability.validator.js";
import { generateSlots } from "../utils/slotGenerator.js";
import { getDayName } from "../utils/dateHelper.js";
import Appointment from "../models/Appointment.js";

//Create Availability

export const createAvailability = async (req, res) => {
  try {
    const validation = validateAvailability(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const { doctor, consultationDuration, schedule } = req.body;

    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctor);

    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Check if availability already exists
    const existingAvailability = await DoctorAvailability.findOne({
      doctor,
    });

    if (existingAvailability) {
      return res.status(400).json({
        success: false,
        message: "Availability already exists for this doctor.",
      });
    }

    const availability = await DoctorAvailability.create({
      doctor,
      consultationDuration,
      schedule,
    });

    return res.status(201).json({
      success: true,
      message: "Availability created successfully.",
      availability,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//getAvailability

export const getAvailability = async (req, res) => {
  try {

    const availability = await DoctorAvailability.findOne({
      doctor: req.params.doctorId,
    }).populate("doctor");

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found.",
      });
    }

    return res.status(200).json({
      success: true,
      availability,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//update Availability

export const updateAvailability = async (req, res) => {
  try {

    const availability = await DoctorAvailability.findOne({
      doctor: req.params.doctorId,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found.",
      });
    }

    availability.consultationDuration =
      req.body.consultationDuration ||
      availability.consultationDuration;

    availability.schedule =
      req.body.schedule ||
      availability.schedule;

    await availability.save();

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully.",
      availability,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//delete Availability

export const deleteAvailability = async (req, res) => {
  try {

    const availability = await DoctorAvailability.findOne({
      doctor: req.params.doctorId,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found.",
      });
    }

    await availability.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Availability deleted successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//get Available Slots

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const selectedDate = new Date(date);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot fetch slots for a past date.",
      });
    }

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "doctorId and date are required.",
      });
    }

    const day = getDayName(date);

    const allAvailabilities = await DoctorAvailability.find();

    const availability = await DoctorAvailability.findOne({
      doctor: doctorId,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Doctor availability not found.",
      });
    }

    const schedule = availability.schedule.find((item) => item.day === day);

    if (!schedule || !schedule.isAvailable) {
      return res.status(200).json({
        success: true,
        slots: [],
      });
    }

    const allSlots = generateSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.breakStart,
      schedule.breakEnd,
      availability.consultationDuration,
    );

    // Get start and end of selected day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find();

    const bookedSlots = bookedAppointments.map((appointment) => {
      const date = new Date(appointment.appointmentStart);

      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    });

    // Remove booked slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot.start),
    );

    return res.status(200).json({
      success: true,

      date,

      day,

      totalSlots: availableSlots.length,

      slots: availableSlots,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

