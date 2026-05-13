const ActivityLog = require("../models/activityLogModel");

const logActivity = async (userId, action, taskId = null) => {
  try {
    await ActivityLog.create({
      employee_id: userId,
      action,
      task_id: taskId,
    });
  } catch (error) {
    console.log("Log error:", error.message);
  }
};

module.exports = logActivity;