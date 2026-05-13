import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyCreatedTasksStart,
  fetchMyCreatedTasksSuccess,
  fetchMyCreatedTasksFail,

  deleteTaskStart,
  deleteTaskSuccess,
  deleteTaskFail,

  updateTaskStart,
  updateTaskSuccess,
  updateTaskFail,

} from "../../redux/task/taskSlice";

import {
  deleteTaskAPI,
  updateTaskAPI,
  getMyCreatedTasksAPI
} from "../../services/taskFunctions";

import { convertToUTC } from "../../utils/time";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function TLDashboard() {
  const dispatch = useDispatch();

  const { myCreatedTasks, myCreatedStats, fetchTasksRequest } =
    useSelector((state) => state.tasks);

  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
  });



  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const years = [2024, 2025, 2026, 2027];


  useEffect(() => {
    fetchMyCreatedTasks();
  }, [dispatch]);


  const fetchMyCreatedTasks = async () => {
    try {

      dispatch(fetchMyCreatedTasksStart());

      const res = await getMyCreatedTasksAPI(selectedMonth, selectedYear);

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


  // UPDATE TASK
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    dispatch(updateTaskStart());

    try {
      const res = await updateTaskAPI(editTask._id, formData);

      if (!res || res.error) {
        dispatch(updateTaskFail(res.message || "Update failed"));
        alert(res.message || "Update failed");
        return;
      }

      dispatch(updateTaskSuccess(res));
      alert(res.message || "Task updated");
      console.log("Update response: ", res);

    } catch (error) {
      dispatch(updateTaskFail(error.message || "Update failed"));
      alert("Error updating task: " + (error.message || "Update failed"));
      return;

    }

  };


  //  DELETE TASK

  const handleDelete = async (id) => {

    dispatch(deleteTaskStart());

    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;
    try {
      const res = await deleteTaskAPI(id);

      if (!res || res.error) {
        dispatch(deleteTaskFail(res.message || "Delete failed"));
        alert(res.message || "Delete failed");
        return;
      }

      dispatch(deleteTaskSuccess(res));
      alert(res.message || "Task deleted");
      console.log("Delete response: ", res);

      // Refresh the task list after deletion
      fetchMyCreatedTasks();

    } catch (error) {
      dispatch(deleteTaskFail(error.message || "Delete failed"));
      alert("Error deleting task: " + (error.message || "Delete failed"));
      return;

    }


  };


  //  PIE DATA
  const chartData = {
    labels: ["Completed", "In Progress", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          myCreatedStats.completed,
          myCreatedStats.in_progress,
          myCreatedStats.pending,
          myCreatedStats.overdue,
        ],

        backgroundColor: [
          "#28a745", // green → completed
          "#17a2b8", // blue → in progress
          "#ffc107", // yellow → pending
          "#dc3545", // red → overdue
        ],
        borderWidth: 1,

      },
    ],
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">TL Dashboard</h2>

      {/*  STATS */}
      <div className="row text-center">

        <div className="col-md-3">
          <div className="card p-3 m-1 shadow-sm">
            <h5>Total</h5>
            <h3>{myCreatedStats.total}</h3>
          </div>
        </div>



        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Completed</h5>
            <h3>{myCreatedStats.completed}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>In Progress</h5>
            <h3>{myCreatedStats.in_progress}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Pending</h5>
            <h3>{myCreatedStats.pending}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 m-1 shadow-sm">
            <h5>overdue</h5>
            <h3>{myCreatedStats.overdue}</h3>
          </div>
        </div>


      </div>

      <div className="m-4">
      <br />
      </div>


      {/*  FILTER */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Filter My Tasks</h5>

        <div className="row">

          {/* MONTH */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* YEAR */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <div className="col-md-4">
            <button
              className="btn btn-success w-100"
              onClick={fetchMyCreatedTasks}
            >
              Apply Filter
            </button>
          </div>

        </div>
      </div>



      {/*  PIE + LIST */}
      <div className="row mt-5">

        {/* PIE */}
        {/* PIE CHART */}
        <div className="row mt-5">
          <div className="col-md-12">
            <div className="card p-3 shadow-sm">
              <h5>Task Distribution</h5>
              <div style={{ maxWidth: "400px", margin: "auto" }}>
                <Pie data={chartData} />
              </div>
            </div>
          </div>
        </div>


        {/* LIST */}
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card p-3 shadow-sm">

              <h5>My Created Tasks</h5>

              {myCreatedTasks.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <table className="table table-bordered">

                    <thead className="table-dark">
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Action</th>
                        <th>Edit</th>
                      </tr>
                    </thead>

                    <tbody>
                      {myCreatedTasks.map((task) => (
                        <tr key={task._id}>

                          {/* TITLE */}
                          <td>{task.title}</td>

                          {/* STATUS */}
                          <td>
                            <span
                              className={`badge ${task.status === "completed"
                                ? "bg-success"
                                : task.status === "in_progress"
                                  ? "bg-primary"
                                  : task.status === "pending"
                                    ? "bg-warning text-dark"
                                    : "bg-danger"
                                }`}
                            >
                              {task.status}
                            </span>
                          </td>

                          {/* PRIORITY */}
                          <td>
                            <span className="badge bg-secondary">
                              {task.priority}
                            </span>
                          </td>

                          {/* START TIME (IST) */}
                          <td>
                            {new Date(task.start_time).toLocaleString()}
                          </td>

                          {/* END TIME (IST) */}
                          <td>
                            {new Date(task.end_time).toLocaleString()}
                          </td>

                          {/* DELETE */}
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(task._id)}
                            >
                              Delete
                            </button>
                          </td>

                          {/* EDIT */}
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => {
                                setEditTask(task);
                                setFormData({
                                  title: task.title,
                                  description: task.description,
                                  priority: task.priority,

                                });
                              }}
                            >
                              Edit
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>

                  {editTask && (
                    <div
                      className="modal fade show"
                      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">

                          {/* HEADER */}
                          <div className="modal-header">
                            <h5 className="modal-title">Edit Task</h5>
                            <button
                              className="btn-close"
                              onClick={() => setEditTask(null)}
                            ></button>
                          </div>

                          {/* BODY */}
                          <div className="modal-body">


                            <div className="modal-body">

                              <input
                                className="form-control mb-2"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Title"
                              />

                              <textarea
                                className="form-control mb-2"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                              />

                              <select
                                className="form-control"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                              >
                                <option value="">Select Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>

                            </div>

                            <div className="modal-footer">
                              <button className="btn btn-secondary" onClick={() => setEditTask(null)}>
                                Cancel
                              </button>
                              <button className="btn btn-primary" onClick={handleUpdate}>
                                Update
                              </button>
                            </div>



                          </div>

                        </div>
                      </div>
                    </div>
                  )}


                </div>
              )}

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default TLDashboard;