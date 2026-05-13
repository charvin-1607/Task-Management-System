const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// protect all routes
router.use(authMiddleware);



// TL get his created tasks
router.get(
  "/my-created-tasks",
  roleMiddleware(["tl"]),
  taskController.getMyCreatedTasks
);


// get my tasks [Employee get their tasks]
router.get('/my-tasks',taskController.getMyTasks);


// employee update task status
router.patch(
    "/update-status",
    taskController.updateTaskStatus
  );


//GET LOGS
  
router.get(
    "/logs",
    roleMiddleware(['tl','manager','admin']),
    taskController.getLogs
  );


router.post("/createtask",
    roleMiddleware(['tl','manager','admin']),
    taskController.createTask
);

router.get("/",
    roleMiddleware(['tl','manager','admin']),
    taskController.getAllTasks
);

router.get("/:id", 
    roleMiddleware(['tl','manager','admin']),
    taskController.getTaskById
);

router.patch("/:id", 
    roleMiddleware(['tl','manager','admin']),
    taskController.updateTask
);

router.delete("/:id",
    roleMiddleware(['tl','manager','admin']),
     taskController.deleteTask
    );


// assign task
router.post(
    "/assign/task",
    roleMiddleware(["tl", "manager", "admin"]),
    taskController.assignTask
  );






module.exports = router;