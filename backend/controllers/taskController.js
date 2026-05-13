const Task = require("../models/taskModel");
const TaskAssignment = require("../models/taskAssignmentModel");
const Employee = require("../models/employeeModel")
const ActivityLog = require("../models/activityLogModel");
const logActivity = require("../utils/logActivity");
const sendEmail = require("../utils/sendEmail");



// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, start_time, end_time, priority } = req.body;

    // Basic validation
    // if (!title || !description || !start_time || !end_time) {
    //   return res
    //     .status(400)
    //     .json({ success:false,message: "Title, start time and end time are required" });
    // }

    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Title, start time and end time are required" });
    }


    //get employee who is may be creating task and their role like tl, manager or admin
    //const employee = req.params.id;

    const employee = req.user.id; // Assuming auth middleware sets req.user with employee info

    const task = await Task.create({
      title,
      description,
      start_time,
      end_time,
      priority,
      created_by: employee,
    });

    console.log("Task created:", task);

    // LOG AFTER TASK CREATED
    await logActivity(employee, "Created a task", task._id);

    res.status(201).json({
      success: true,
      message: "Task created",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};




// GET ALL TASKS
exports.getAllTasks = async (req, res) => {
  try {
    let { month, year } = req.query;

    console.log("Query:", req.query); 

    const filter = {};

    console.log("check month and year before if block");

    month = Number(month);
    year = Number(year);

    console.log("Parsed month and year:", month, year);

    // 👉 if month & year provided
    if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12){

      console.log("Month and year provided:", month, year);


      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      console.log("Default date filter:", { startDate, endDate });

      console.log("Month:", month, "Year:", year);
      console.log("Start:", startDate);
      console.log("End:", endDate);

      filter.start_time = {
        $gte: startDate,
        $lte: endDate,
      };

    }

    // 👉 default: current month
    else {

      console.log("inside first else block");

      const now = new Date();

      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);


      // filter.createdAt = {
      //   $gte: startDate,
      //   $lte: endDate,
      // };

      filter.start_time = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const tasks = await Task.find(filter);

    res.json({
      success: true,
      message: `Tasks fetched for ${month ? `month ${month}` : "current month"} and year ${year || new Date().getFullYear()}`,
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
};




// GET SINGLE TASK
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "created_by",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task retrieved",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};





// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated",
      task,
    });

    console.log("Task updated:", task);

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// ASSIGN TASK
exports.assignTask = async (req, res) => {
  try {
    const { task_id, employee_id } = req.body;


    // check task exists
    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // check employee exists
    const employee = await Employee.findById(employee_id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // create assignment
    const assignment = await TaskAssignment.create({
      task_id,
      employee_id,
    });

    // send email notification to employee
    await sendEmail(
      employee.email,
      "New Task Assigned",
      `Hello ${employee.name}, you have been assigned a new task: ${task.title}`
    );

    // log
    // here use req.user.id to log who assigned the task, not employee_id because employee_id is the one who is getting assigned, not the one who is doing the assignment
    await logActivity(req.user.id, `Assigned task to ${employee.name}`, task_id);


    res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// GET MY TASKS [ employee get their assigned tasks ]
exports.getMyTasks = async (req, res) => {
  try {
    const employee = req.user.id;

    let { month, year } = req.query;

    // convert
    month = Number(month);
    year = Number(year);

    const assignments = await TaskAssignment.find({
      employee_id: employee,
    }).populate("task_id");

    let tasks = assignments.map((a) => a.task_id);

    // ✅ APPLY FILTER
    if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12) {

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      tasks = tasks.filter((task) => {
        const taskDate = new Date(task.start_time);
        return taskDate >= startDate && taskDate <= endDate;
      });

    } else {
      // default current month
      const now = new Date();

      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23, 59, 59
      );

      tasks = tasks.filter((task) => {
        const taskDate = new Date(task.start_time);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    res.status(200).json({
      success: true,
      message: "My tasks retrieved",
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};


// UPDATE TASK STATUS (employee)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { task_id, status } = req.body;

    const employee = req.user.id; // Assuming auth middleware sets req.user with employee info


    // check valid status
    const validStatus = ["pending", "in_progress", "completed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // check assignment (IMPORTANT )
    const assignment = await TaskAssignment.findOne({
      task_id,
      employee_id: employee,
    });

    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this task",
      });
    }

    // update task
    const task = await Task.findByIdAndUpdate(
      task_id,
      { status },
      { new: true }
    );

    //log
    await logActivity(employee, `Updated status to ${status}`, task_id);


    res.json({
      success: true,
      message: "Task status updated",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET ALL LOGS (admin/tl)
exports.getLogs = async (req, res) => {
  try {

    const logs = await ActivityLog.find()
      .populate("employee_id", "name email role")
      .populate("task_id", "title");



    res.status(200).json({
      success: true,
      message: "Activity logs retrieved",
      logs
    });

    console.log("Activity logs retrieved:", logs);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// TL get their cretaed tasks
exports.getMyCreatedTasks = async (req, res) => {
  try {
    const tlId = req.user.id;

    let { month, year } = req.query;

    const filter = {
      created_by: tlId,
    };

    // ✅ convert
    month = Number(month);
    year = Number(year);

    // ✅ if valid month/year
    if (!isNaN(month) && !isNaN(year) && month >= 1 && month <= 12) {

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      filter.start_time = {
        $gte: startDate,
        $lte: endDate,
      };

    } else {
      // ✅ default current month
      const now = new Date();

      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23, 59, 59
      );

      filter.start_time = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const tasks = await Task.find(filter)
      .populate("created_by", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `TL Created Tasks fetched for ${month ? `month ${month}` : "current month"} and year ${year || new Date().getFullYear()}`,
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching TL tasks",
    });
  }
};