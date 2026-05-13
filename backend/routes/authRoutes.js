const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

// register and login routes (public)
router.post("/signup", authController.signup);
router.post("/login", authController.login);


// logout route protected by authMiddleware
router.post("/logout", authMiddleware, authController.logout);




module.exports = router;