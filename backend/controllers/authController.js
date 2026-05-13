const Employee = require("../models/employeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");


// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Debugging log


    const user = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    console.log("Generated Token:", token); // Debugging log

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      // sameSite: "strict",
      maxAge: 3600000
    });

   

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });


    // const time = new Date().toLocaleString();

    // sendEmail(
    //   user.email,
    //   "Login Alert",
    //   `Hello ${user.name},you are login on our website ,login detected at ${time}`
    // );

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    // 👇 req.user authMiddleware mathi ave chhe
    const user = req.user;

    const time = new Date().toLocaleString();


    // 🔔 Send email (no await = fast response)
    // sendEmail(
    //   user.email,
    //   "Logout Alert",
    //   `Hello ${user.name}, you have successfully logged out.logout detected at ${time}`
    // );

    // 🍪 clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // production ma true
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
    

   


  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


