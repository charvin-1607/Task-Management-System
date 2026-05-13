import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyTeamStart,
  fetchMyTeamSuccess,
  fetchMyTeamFail,
} from "../../redux/employee/employeeSlice";

import {
  createTaskStart,
  createTaskSuccess,
  createTaskFail,

  fetchMyCreatedTasksStart,
  fetchMyCreatedTasksSuccess,
  fetchMyCreatedTasksFail,

  assignTaskStart,
  assignTaskSuccess,
  assignTaskFail,
} from "../../redux/task/taskSlice";

import { getMyTeamAPI } from "../../services/employeeFunctions";
import { createTaskAPI,  getMyCreatedTasksAPI , assignTaskAPI} from "../../services/taskFunctions";

import { convertToUTC } from "../../utils/time";


function CreateTask() {

  const dispatch = useDispatch();

  const { myTeam } = useSelector((state) => state.employees);
  const { createTaskRequest, myCreatedTasks, assignTaskRequest } = useSelector((state) => state.tasks);


// fetch my cretaed tasks for task select in assign form
 
useEffect(() => {
  fetchMyCreatedTasks();
}, [dispatch]);


const fetchMyCreatedTasks = async () => {
  try {

    dispatch(fetchMyCreatedTasksStart());

    const res = await getMyCreatedTasksAPI();

    console.log("API response in TLDashboard: ", res);

    if (!res || res.error) {
      dispatch(fetchMyCreatedTasksFail(res.message || "Failed to fetch tasks"));
      alert(res.message || "Failed to fetch tasks");
      return;
    }

    dispatch(fetchMyCreatedTasksSuccess(res));
    console.log("Fetched my created tasks in TLDashboard: ", res.tasks);
    alert(res.message || "Tasks fetched successfully");

  } catch (error) {

    dispatch(fetchMyCreatedTasksFail("Failed to fetch tasks"));
    alert(error.message || "Failed to assign task");
    return;
  }
};






  //create task form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    start_time: "",
    end_time: "",
    employee_id: "",
  });


  // assign task form data
  const [assignData, setAssignData] = useState({
    task_id: "",
    employee_id: "",
  });




  //  FETCH TEAM [ tl fetch their team members ]

  useEffect(() => {
    fetchTeam();
  }, [dispatch]);


  const fetchTeam = async () => {

    try {
      dispatch(fetchMyTeamStart());

      const res = await getMyTeamAPI();

      console.log("API fetch my team response: ", res);

      if (!res || res.error) {
        dispatch(fetchMyTeamFail(res.message || "Failed to fetch team members"));
        alert(res.message || "Failed to fetch team members");
        return;
      }

      dispatch(fetchMyTeamSuccess(res.data));
      console.log("Fetched my team members: ", res.data);
      alert(res.message || "Team members fetched successfully");

    } catch (error) {
      console.error("Error fetching my team: ", error);
      dispatch(fetchMyTeamFail(error.message || "Failed to fetch team members"));
      alert(error.message || "Failed to fetch team members");
    }
  };

  //  HANDLE CHANGE for create task form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  SUBMIT for create task form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      dispatch(createTaskStart());

      const payload = {
        ...formData,
        start_time: convertToUTC(formData.start_time),
        end_time: convertToUTC(formData.end_time),
      };

      const res = await createTaskAPI(payload);

      console.log("API create task response: ", res);

      if (!res || res.error) {
        dispatch(createTaskFail(res.message || "Failed to create task"));
        alert(res.message || "Failed to create task");
        return;
      }

      if (res.success) {
        dispatch(createTaskSuccess(res));
        alert("Task created successfully");

        setFormData({
          title: "",
          description: "",
          priority: "",
          start_time: "",
          end_time: "",
        });
      }

    } catch (error) {
      console.error("Error creating task: ", error);
      dispatch(createTaskFail(error.message || "Failed to create task"));
      alert(error.message || "Failed to create task");
      return;

    }


  };



  // HANDLE CHANGE for assign task form
  const handleAssignChange = (e) => {
    setAssignData({
      ...assignData,
      [e.target.name]: e.target.value,
    });
  };


  // HANDLE assign for assign task form
  const handleAssign = async (e) => {
    e.preventDefault();

    dispatch(assignTaskStart());

    try {

      const res = await assignTaskAPI(assignData);

      console.log("API assign task response: ", res);

      if (!res || res.error) {
        dispatch(assignTaskFail(res.message || "Failed to assign task"));
        alert(res.message || "Failed to assign task");
        return;
      }

      if (res.success) {
        dispatch(assignTaskSuccess(res));
        alert("Task assigned successfully");

        setAssignData({
          task_id: "",
          employee_id: "",
        });

      }
    } catch (error) {
      console.error("Error assigning task: ", error);
      dispatch(assignTaskFail(error.message || "Failed to assign task"));
      alert(error.message || "Failed to assign task");
      return;

    }
  };


  return (
    <div className="container">
      <h2 className="mb-4">Create Task</h2>

      <div className="card shadow-sm p-4">
        <form onSubmit={handleSubmit}>

          <input
            className="form-control mb-3"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="form-control mb-3"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <select
            className="form-select mb-3"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="datetime-local"
            className="form-control mb-3"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />

          <input
            type="datetime-local"
            className="form-control mb-3"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />

          <button
            className="btn btn-primary w-100"
            disabled={createTaskRequest.loading}
          >
            {createTaskRequest.loading ? "Creating..." : "Create Task"}
          </button>

        </form>
      </div>



      {/* ASSIGN TASK FORM */}

      <div className="card shadow-sm p-4 mt-4">
        <h4 className="mb-3">Assign Task</h4>

        <form onSubmit={handleAssign}>

          {/* TASK SELECT */}
          <div className="mb-3">
            <label className="form-label">Select Task</label>
            <select
              className="form-select"
              name="task_id"
              value={assignData.task_id}
              onChange={handleAssignChange}
              required
            >
              <option value="">Select Task</option>
              {myCreatedTasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          {/* EMPLOYEE SELECT */}
          <div className="mb-3">
            <label className="form-label">Select Employee</label>
            <select
              className="form-select"
              name="employee_id"
              value={assignData.employee_id}
              onChange={handleAssignChange}
              required
            >
              <option value="">Select Employee</option>
              {myTeam.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-success w-100">
            Assign Task
          </button>

        </form>
      </div>


    </div>
  );
}

export default CreateTask;