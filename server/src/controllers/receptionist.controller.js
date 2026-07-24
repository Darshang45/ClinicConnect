import Appointment from "../models/Appointment.js";

// ==========================================
// Get Today's Appointments
// ==========================================

export const getTodayAppointments = async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      appointmentStart: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization consultationFee",
        populate: {
          path: "user",
          select: "fullName email",
        },
      })
      .populate({
        path: "department",
        select: "name",
      })
      .sort({
        tokenNumber: 1,
      });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================================
// Check-In Patient
// ==========================================

export const checkInPatient = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot be checked in.",
      });
    }

    if (appointment.status === "Checked-In") {
      return res.status(400).json({
        success: false,
        message: "Patient is already checked in.",
      });
    }

    if (appointment.status !== "Scheduled") {
      return res.status(400).json({
        success: false,
        message: `Cannot check in appointment with status '${appointment.status}'.`,
      });
    }

    appointment.status = "Checked-In";
    appointment.checkInTime = new Date();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "department",
        select: "name",
      });

    return res.status(200).json({
      success: true,
      message: "Patient checked in successfully.",
      appointment: {
        id: updatedAppointment._id,

        patient: updatedAppointment.patient,

        doctor: {
          id: updatedAppointment.doctor._id,
          fullName: updatedAppointment.doctor.user.fullName,
          specialization: updatedAppointment.doctor.specialization,
        },

        department: updatedAppointment.department,

        appointmentStart: updatedAppointment.appointmentStart,

        status: updatedAppointment.status,

        tokenNumber: updatedAppointment.tokenNumber,

        checkInTime: updatedAppointment.checkInTime,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// ==========================================
// Start Consultation
// ==========================================

export const startConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot start consultation.",
      });
    }

    if (appointment.status === "In Consultation") {
      return res.status(400).json({
        success: false,
        message: "Consultation has already started.",
      });
    }

    if (appointment.status !== "Checked-In") {
      return res.status(400).json({
        success: false,
        message: "Patient must be checked in before starting consultation.",
      });
    }

    appointment.status = "In Consultation";
    appointment.consultationStartTime = new Date();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "department",
        select: "name",
      });

    return res.status(200).json({
      success: true,
      message: "Consultation started successfully.",
      appointment: {
        id: updatedAppointment._id,
        patient: updatedAppointment.patient,
        doctor: {
          id: updatedAppointment.doctor._id,
          fullName: updatedAppointment.doctor.user.fullName,
          specialization: updatedAppointment.doctor.specialization,
        },
        department: updatedAppointment.department,
        appointmentStart: updatedAppointment.appointmentStart,
        tokenNumber: updatedAppointment.tokenNumber,
        status: updatedAppointment.status,
        consultationStartTime:
          updatedAppointment.consultationStartTime,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// ==========================================
// Complete Appointment
// ==========================================

export const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot be completed.",
      });
    }

    if (appointment.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already completed.",
      });
    }

    if (appointment.status !== "In Consultation") {
      return res.status(400).json({
        success: false,
        message:
          "Appointment must be in consultation before it can be completed.",
      });
    }

    appointment.status = "Completed";
    appointment.consultationEndTime = new Date();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "patient",
        select: "patientId fullName phone",
      })
      .populate({
        path: "doctor",
        select: "specialization",
        populate: {
          path: "user",
          select: "fullName",
        },
      })
      .populate({
        path: "department",
        select: "name",
      });

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully.",
      appointment: {
        id: updatedAppointment._id,
        patient: updatedAppointment.patient,
        doctor: {
          id: updatedAppointment.doctor._id,
          fullName: updatedAppointment.doctor.user.fullName,
          specialization: updatedAppointment.doctor.specialization,
        },
        department: updatedAppointment.department,
        appointmentStart: updatedAppointment.appointmentStart,
        tokenNumber: updatedAppointment.tokenNumber,
        status: updatedAppointment.status,
        consultationStartTime:
          updatedAppointment.consultationStartTime,
        consultationEndTime:
          updatedAppointment.consultationEndTime,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// ==========================================
// Cancel Appointment
// ==========================================

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { cancelledBy, cancellationReason } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "In Consultation") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an appointment that is in consultation.",
      });
    }

    if (appointment.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed appointments cannot be cancelled.",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled.",
      });
    }

    appointment.status = "Cancelled";
    appointment.cancelledBy = cancelledBy;
    appointment.cancellationReason = cancellationReason;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment: {
        id: appointment._id,
        status: appointment.status,
        cancelledBy: appointment.cancelledBy,
        cancellationReason: appointment.cancellationReason,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};