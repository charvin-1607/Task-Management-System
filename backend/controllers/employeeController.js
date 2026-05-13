const Employee = require("../models/employeeModel");
const Task = require("../models/taskModel");
const crypto = require("crypto");
const sendEmail = require('../utils/sendEmail');


// GET ALL EMPLOYEES
async function getAllEmployees(req, res) {
  try {
    const employees = await Employee.find().select("-password");
    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET SINGLE EMPLOYEE
async function getEmployeeById(req, res) {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee retrieved successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// UPDATE EMPLOYEE
async function updateEmployeeById(req, res) {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE EMPLOYEE
async function deleteEmployeeById(req, res) {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//assign tl to employee
async function assignTL(req, res) {
  try {


    const { employee_id, tl_id } = req.body;

    // check TL valid chhe ke nai
    const tl = await Employee.findById(tl_id);
    if (!tl || tl.role !== "tl") {
      return res.status(400).json({
        success: false,
        message: "Invalid TL",
      });
    }

    // employee update karo
    const employee = await Employee.findByIdAndUpdate(
      employee_id,
      { team_leader_id: tl_id },
      { new: true }
    ).populate("team_leader_id", "name email");

    res.status(200).json({
      success: true,
      message: "TL assigned successfully",
      data: employee,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error assigning TL",
    });
  }
};

// manager and admin get all tl list
async function getAllTL(req, res) {
  try {
    const tls = await Employee.find({ role: "tl" }).select("-password");

    res.status(200).json({
      success: true,
      count: tls.length,
      data: tls,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching TLs",
    });
  }
};

// tl get their all team members

async function getMyTeam(req, res) {
  try {
    const tlId = req.user.id;

    const team = await Employee.find({
      team_leader_id: tlId,
    }).select("-password").populate("team_leader_id", "name email");

    res.status(200).json({
      success: true,
      count: team.length,
      data: team,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching team",
    });
  }
};


// manager get TL WISE task stats

async function getTLTaskStats(req, res) {
  try {
    const tls = await Employee.find({ role: "tl" });

    const result = [];

    for (let tl of tls) {
      const tasks = await Task.find({ created_by: tl._id });

      const total = tasks.length;
      const completed = tasks.filter(t => t.status === "completed").length;
      const pending = tasks.filter(t => t.status === "pending").length;
      const in_progress = tasks.filter(t => t.status === "in_progress").length;

      result.push({
        tl_id: tl._id,
        name: tl.name,
        email: tl.email,
        total,
        completed,
        pending,
        in_progress,
      });
    }

    res.json({
      success: true,
      message: "TL task stats fetched",
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// manager get TL team size
async function getTLTeamSize(req, res) {
  try {
    const tls = await Employee.find({ role: "tl" });

    const result = [];

    for (let tl of tls) {
      const employees = await Employee.find({
        role: "employee",
        team_leader_id: tl._id,
      });

      result.push({
        tl_id: tl._id,
        name: tl.name,
        email: tl.email,
        teamSize: employees.length,
      });
    }

    res.json({
      success: true,
      message: "TL team size fetched",
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching team size",
    });
  }
};


// get me - for auth check and profile page
async function getMe(req, res) {
  try {
    // req.user already middleware ma set hoy
    const employee = await Employee.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      message: "User authenticated",
      employee,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Not authenticated",
    });
  }
};



//forget passsword

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔐 generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // ⏱ expiry (15 min)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // 🔗 reset URL
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    // 📩 send email (simple version)
    console.log("Reset URL:", resetURL);

    // 🔔 Send email (no await = fast response)
    sendEmail(
      user.email,
      "Reset Password",
      "Click this link to reset password",
      `Hello ${user.name},
      <br/>
      
      <h3>Password Reset</h3>
      
      <br />

      <p>Click below:</p>

      <br/>

        <a href="${resetURL}" 
        style="
        display:inline-block;
        padding:12px 25px;
        background-color:#007bff;
        color:#ffffff;
        text-decoration:none;
        border-radius:5px;
        font-weight:bold;
        ">
         Reset Password
       </a>

      <br />

        <p>This link will expire in 15 minutes.</p>
      `
      
    );



    res.json({
      success: true,
      message:"Reset password Mail send to you check it",
      // message: "Reset link generated (check console for now)",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending reset email",
    });
  }
};


async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await Employee.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 🔐 update password
    const bcrypt = require("bcrypt");

    user.password = await bcrypt.hash(password, 10);

    // ❌ remove token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
    });
  }
};


//change passsword
async function changePassword(req, res){
  try {

    const { currentPassword, newPassword } = req.body;

    console.log("currentPassword = ",currentPassword);
    console.log("newPassword = ",newPassword);

    // user find , take id from middleware [second way] , we can aslo take it from req.params.id [both are right way]

    const employee = await Employee.findById(req.user.id); 

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // compare current password
    const bcrypt = require("bcrypt");

    const isMatch = await bcrypt.compare(
      currentPassword,
      employee.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // hash new password
    employee.password = await bcrypt.hash(newPassword, 10);

    await employee.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });

    sendEmail(
      employee.email,
      "Change Password",
      `Dear ${employee.name},
       Your Password Was Changed`,
      `<p>Hello ${employee.name},
      </p> <h2 style="color:#0d6efd;"> Password Changed Successfully </h2>
       <p> Your account password has been changed successfully. </p> 
       <p> If you made this change, no further action is required. </p>
       <p style="color:red"> If you did NOT change your password, please click on forget password & reset your password immediately or contact support. </p>
       `, 
    );

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error changing password",
    });

  }
};



// EXPORT CONTROLLER FUNCTIONS
module.exports = {
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  assignTL,
  getAllTL,
  getMyTeam,
  getTLTaskStats,
  getTLTeamSize,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword
};