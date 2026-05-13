const cron = require("node-cron");
const Task = require("../models/taskModel");
const TaskAssignment = require("../models/taskAssignmentModel");
const Employee = require("../models/employeeModel");
const sendEmail = require("../utils/sendEmail");

cron.schedule("* * * * *", async () => {
  console.log("Running cron job...");

  try {
    const now = new Date();

    const tasks = await Task.find({
        end_time: { $lt: now },
        status: { $ne: "completed" },
        is_overdue_notified: false,
      });

    for (let task of tasks) {

        task.status = "overdue";
      
        const assignments = await TaskAssignment.find({
          task_id: task._id,
        });
      
        for (let assign of assignments) {
          const employee = await Employee.findById(assign.employee_id);
      
          await sendEmail(
            employee.email,
            "Task Overdue ⚠️",
            `Hello ${employee.name}, your task "${task.title}" is overdue. Please complete it as soon as possible.`
          );
        }
      
        // mark as notified
        task.is_overdue_notified = true;
        await task.save();
      }

  } catch (error) {
    console.log("Cron error:", error.message);
  }
});