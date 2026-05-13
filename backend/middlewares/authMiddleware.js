const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel");

async function authMiddleware(req, res, next){

    console.log("check before token declaration"); // Debugging log

   const token =  req.cookies.token;
    console.log("Token from cookies:", token); // Debugging log

  if (!token) {
    return res.status(401).json({success:false, message: "No token, authorization denied" });
  }

  try {
    const decoded =  jwt.verify(token, process.env.JWT_SECRET);
    //req.user = decoded.user;

    //find user by decoded id and attach to req.user

    const user = await Employee.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ success:false,message: "User not found" });
    }

    req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

   return next();
  } catch (err) {
    res.status(401).json({success:false,message: "Token is not valid" });
  }
}

module.exports = authMiddleware;