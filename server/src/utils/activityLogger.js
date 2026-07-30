import ActivityLog from "../models/ActivityLog.js";

export const logActivity = async ({
  user,
  role,
  action,
  module,
  description,
  ipAddress = "",
}) => {
  try {
    await ActivityLog.create({
      user,
      role,
      action,
      module,
      description,
      ipAddress,
    });
  } catch (error) {
    console.error("Activity Logger Error:", error.message);
  }
};