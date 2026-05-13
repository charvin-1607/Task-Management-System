const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "tl", "employee"],
      default: "employee",
    },

    designation: {
      type: String,
      default: "",
    },

    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    team_leader_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },


    // for forget passsword and reset it
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);