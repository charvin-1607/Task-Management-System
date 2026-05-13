const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// GET all employees
router.get("/", employeeController.getAllEmployees);

// forget password & reset password
router.post("/forgot-password", employeeController.forgotPassword);

router.patch("/reset-password/:token", employeeController.resetPassword); 


// change password
router.patch("/change-password", authMiddleware, employeeController.changePassword);



//manager and admin assign tl to employee 

router.patch(
  "/assign/tl",
  authMiddleware,
  roleMiddleware(["manager", "admin"]),
  employeeController.assignTL
);


// get all tl for manager and admin

router.get(
  "/get-all-tl",
  authMiddleware,
  roleMiddleware(["manager", "admin"]),
  employeeController.getAllTL
);



// tl get all employee under their team

router.get(
  "/my-team",
  authMiddleware,
  roleMiddleware(["tl"]),
  employeeController.getMyTeam
);




// manager get al tl stats
router.get(
  "/tl-task-stats",
  authMiddleware,
  roleMiddleware(["manager"]),
  employeeController.getTLTaskStats
);


// manager get tl team size
router.get(
  "/tl-team-size",
  authMiddleware,
  roleMiddleware(["manager"]),
  employeeController.getTLTeamSize
);


// get me 
router.get(
  "/me",
  authMiddleware,
  employeeController.getMe
);


// Get, Update, Delete employee by ID

router.route("/:id")
  .get(authMiddleware, employeeController.getEmployeeById)
  .patch(authMiddleware, employeeController.updateEmployeeById)
  .delete(authMiddleware,
    roleMiddleware(["admin", "manager"]),
    employeeController.deleteEmployeeById);



module.exports = router;