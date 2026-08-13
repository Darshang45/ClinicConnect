import mongoose from "mongoose";

import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";

const CHAT_ROLES = new Set(["patient", "doctor", "receptionist"]);
const ACTIVE_APPOINTMENT_FILTER = {
  status: { $nin: ["Cancelled", "No Show"] },
};

const toIdString = (value) => String(value?._id ?? value?.id ?? value ?? "");

const idEquals = (left, right) => toIdString(left) === toIdString(right);

export const isValidChatObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const usersHaveAppointmentRelationship = async (patientUserId, doctorUserId) => {
  const [patient, doctor] = await Promise.all([
    Patient.findOne({ user: patientUserId, isActive: true }).select("_id"),
    Doctor.findOne({ user: doctorUserId, isActive: true }).select("_id"),
  ]);

  if (!patient || !doctor) return false;

  return Boolean(
    await Appointment.exists({
      patient: patient._id,
      doctor: doctor._id,
      ...ACTIVE_APPOINTMENT_FILTER,
    }),
  );
};

/**
 * The single authority for direct-chat permissions.  Callers may use an id or
 * a populated User document, but never client-provided role/identity fields.
 */
export const canUsersChat = async (currentUserOrId, targetUserOrId) => {
  const resolveUser = (userOrId) =>
    typeof userOrId?.role === "string" && typeof userOrId?.isActive === "boolean"
      ? userOrId
      : User.findById(userOrId?._id || userOrId).select("_id role isActive");

  const [currentUser, targetUser] = await Promise.all([
    resolveUser(currentUserOrId),
    resolveUser(targetUserOrId),
  ]);

  if (!currentUser || !targetUser || !currentUser.isActive || !targetUser.isActive) {
    return { allowed: false, status: 404, message: "User not found." };
  }

  if (idEquals(currentUser._id, targetUser._id)) {
    return { allowed: false, status: 400, message: "You cannot create a chat with yourself." };
  }

  if (!CHAT_ROLES.has(currentUser.role) || !CHAT_ROLES.has(targetUser.role)) {
    return { allowed: false, status: 403, message: "This role is not allowed to use chat." };
  }

  const rolePair = [currentUser.role, targetUser.role].sort().join(":");

  if (rolePair === "doctor:doctor" || rolePair === "doctor:receptionist") {
    return { allowed: true, currentUser, targetUser };
  }

  if (rolePair === "doctor:patient") {
    const patientUser = currentUser.role === "patient" ? currentUser : targetUser;
    const doctorUser = currentUser.role === "doctor" ? currentUser : targetUser;
    const hasAppointment = await usersHaveAppointmentRelationship(
      patientUser._id,
      doctorUser._id,
    );

    return hasAppointment
      ? { allowed: true, currentUser, targetUser }
      : {
          allowed: false,
          status: 403,
          message: "Patients and doctors can only chat when they have a booked appointment.",
        };
  }

  return { allowed: false, status: 403, message: "This chat relationship is not allowed." };
};

export const getAllowedChatTargets = async (currentUser) => {
  if (!currentUser || !CHAT_ROLES.has(currentUser.role)) return [];

  if (currentUser.role === "patient") {
    const patient = await Patient.findOne({ user: currentUser._id, isActive: true }).select("_id");
    if (!patient) return [];

    const appointmentDoctorIds = await Appointment.distinct("doctor", {
      patient: patient._id,
      ...ACTIVE_APPOINTMENT_FILTER,
    });
    const doctorUserIds = await Doctor.distinct("user", {
      _id: { $in: appointmentDoctorIds },
      isActive: true,
    });

    return User.find({
      _id: { $in: doctorUserIds },
      role: "doctor",
      isActive: true,
    }).select("fullName email role");
  }

  if (currentUser.role === "doctor") {
    const doctor = await Doctor.findOne({ user: currentUser._id, isActive: true }).select("_id");
    const appointmentPatientIds = doctor
      ? await Appointment.distinct("patient", { doctor: doctor._id, ...ACTIVE_APPOINTMENT_FILTER })
      : [];
    const patientUserIds = await Patient.distinct("user", {
      _id: { $in: appointmentPatientIds },
      isActive: true,
    });

    return User.find({
      _id: { $ne: currentUser._id },
      isActive: true,
      $or: [
        { _id: { $in: patientUserIds }, role: "patient" },
        { role: "receptionist" },
        { role: "doctor" },
      ],
    }).select("fullName email role");
  }

  return User.find({
    _id: { $ne: currentUser._id },
    role: "doctor",
    isActive: true,
  }).select("fullName email role");
};

export const getOtherChatParticipant = (chat, userId) =>
  chat.participants.find((participant) => !idEquals(participant, userId));

/**
 * A chat can be read or used only when the authenticated user is a direct
 * participant and the relationship still satisfies the central policy.
 */
export const authorizeChatForUser = async (chat, currentUser) => {
  if (!chat || chat.type !== "Direct" || chat.participants.length !== 2) {
    return { allowed: false, status: 404, message: "Conversation not found." };
  }

  if (!chat.participants.some((participant) => idEquals(participant, currentUser._id))) {
    return { allowed: false, status: 403, message: "Access denied." };
  }

  const otherParticipant = getOtherChatParticipant(chat, currentUser._id);
  if (!otherParticipant) {
    return { allowed: false, status: 403, message: "Access denied." };
  }

  const permission = await canUsersChat(currentUser, otherParticipant);
  return permission.allowed
    ? { ...permission, otherParticipant }
    : permission;
};
