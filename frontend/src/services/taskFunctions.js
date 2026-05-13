export const getAllTasksAPI = async (month, year) => {
  try {
    let url = "http://localhost:8005/api/tasks";

    // 👉 jo month & year hoy to query add kar
    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    const data = await res.json();

    console.log("API response for tasks: ", data);

    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(
      error.message || "Something went wrong while fetching tasks"
    );
  }
};

  // DELETE TASK
export const deleteTaskAPI = async (id) => {
  try {
    const res = await fetch(`http://localhost:8005/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error(error.message || "Something went wrong while deleting the task");
  }
};



// UPDATE TASK
export const updateTaskAPI = async (id, updatedData) => {
  try {
    const res = await fetch(`http://localhost:8005/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error(error.message || "Something went wrong while updating the task");
  }
};



// CREATE TASK
export const createTaskAPI = async (payload) => {
  try {
    const res = await fetch("http://localhost:8005/api/tasks/createtask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();  
    return data;
    
  } catch (error) {
    return { success: false, message: "Create task failed" };
  }
};

// ASSIGN TASK

export const assignTaskAPI = async (payload) => {
  try {
    const res = await fetch(
      "http://localhost:8005/api/tasks/assign/task",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    return data;

  } catch (error) {
    return { success: false, message: "Assign task failed" };
  }
};


// tl get their created tasks
export const getMyCreatedTasksAPI = async (month, year) => {
  try {
    let url =  "http://localhost:8005/api/tasks/my-created-tasks";

    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    return { success: false, message: "Error fetching TL tasks" };
  }
};


// employee get their tasks
export const getMyAssignedTasksAPI = async (month, year) => {
  try {
    let url = "http://localhost:8005/api/tasks/my-tasks";

    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    return await res.json();
  } catch (error) {
    return { success: false, message: "Error fetching tasks" };
  }
};

// update task status by employee
export const updateTaskStatusAPI = async (task_id, status) => {
  try {
    const res = await fetch(
      "http://localhost:8005/api/tasks/update-status",
      {
        method: "PATCH", // IMPORTANT (not PUT)
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ task_id, status }), // IMPORTANT
      }
    );

    const data = await res.json();
    return data;
    
  } catch (error) {
    return { success: false, message: "Status update failed" };
  }
};


//manager get all tl stats
export const getTLTaskStatsAPI = async () => {
  try {
    const res = await fetch(
      "http://localhost:8005/api/employees/tl-task-stats",
      {
        credentials: "include",
      }
    );

    const data = await res.json();
    return data;
    
  } catch (error) {
    return { success: false, message: "Error fetching TL stats" };
  }
};