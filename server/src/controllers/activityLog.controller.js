import ActivityLog from "../models/ActivityLog.js";

/*
    GET /api/admins/activity-logs
*/
export const getActivityLogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.module) {
      filter.module = req.query.module;
    }

    if (req.query.search) {
      filter.description = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const total = await ActivityLog.countDocuments(filter);

    const logs = await ActivityLog.find(filter)
      .populate("user", "fullName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
    GET /api/admins/activity-logs/:id
*/
export const getActivityLogById = async (req, res) => {
  try {
    const log = await ActivityLog.findById(req.params.id).populate(
      "user",
      "fullName email role",
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Activity log not found.",
      });
    }

    return res.status(200).json({
      success: true,
      log,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
