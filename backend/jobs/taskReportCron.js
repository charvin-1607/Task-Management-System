const cron = require("node-cron");
const ExcelJS = require("exceljs");
const Task = require("../models/taskModel");
const path = require("path");
const fs = require("fs");

cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("Running monthly task report cron...");

    const now = new Date();

    //  Previous month calculate
    const month = now.getMonth(); // current month
    const year = now.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const tasks = await Task.find({
      start_time: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("created_by", "name");

    if (tasks.length === 0) {
      console.log("No tasks found for report");
      return;
    }

    // 📊 Excel create
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Task Report");

    worksheet.columns = [
      { header: "Title", key: "title", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Start Time", key: "start_time", width: 25 },
      { header: "End Time", key: "end_time", width: 25 },
      { header: "Created By", key: "created_by", width: 20 },
    ];

    tasks.forEach((task) => {
      worksheet.addRow({
        title: task.title,
        status: task.status,
        priority: task.priority,
        start_time: new Date(task.start_time).toLocaleString(),
        end_time: new Date(task.end_time).toLocaleString(),
        created_by: task.created_by?.name || "N/A",
      });
    });

    // 📁 Save file
    const reportsDir = path.join(__dirname, "../reports");

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const fileName = `task_report_${month}_${year}.xlsx`;
    const filePath = path.join(reportsDir, fileName);

    await workbook.xlsx.writeFile(filePath);

    console.log("Report generated:", fileName);

  } catch (error) {
    console.error("Cron error:", error);
  }
});