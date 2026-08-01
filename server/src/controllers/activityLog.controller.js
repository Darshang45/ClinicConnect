import ActivityLog from "../models/ActivityLog.js";
import { paginateQuery } from "../utils/paginate.js";

/*
    GET /api/admins/activity-logs
*/
export const getActivityLogs = async (req, res) => {
  try {
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

    const response = await paginateQuery({
      model: ActivityLog,
      filter,
      query: ActivityLog.find(filter)
        .populate("user", "fullName email role")
        .sort({ createdAt: -1 }),
      pagination: req.query,
      message: "Activity logs retrieved successfully.",
      legacy: {
        dataKey: "logs",
        totalKey: "total",
        pageKey: "page",
        limitKey: "limit",
        totalPagesKey: "totalPages",
      },
    });

    return res.status(200).json(response);
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
