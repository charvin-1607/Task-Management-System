import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFail,
} from "../../redux/task/taskSlice";

import { getAllTasksAPI } from "../../services/taskFunctions";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);




function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, tasks, fetchTasksRequest } = useSelector((state) => state.tasks);

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
    fetchTasks();
  }, [dispatch]);

  const fetchTasks = async () => {
    dispatch(fetchTasksStart());

    try {
      const res = await getAllTasksAPI(selectedMonth, selectedYear);

      console.log("API response in AdminDashboard: ", res);

      if (!res || res.error) {
        dispatch(fetchTasksFail(res.message || "Failed to fetch tasks"));
        alert(res.message || "Failed to fetch tasks");
        return;
      }

      dispatch(fetchTasksSuccess(res));
      console.log("Fetched tasks in AdminDashboard: ", res.tasks);
      alert(res.message || "Tasks fetched successfully");



    } catch (error) {
      dispatch(fetchTasksFail(error.message || "Failed to fetch tasks"));
      alert("inside catch block = " + (error.message || "Failed to fetch tasks"));
      return;

    }


  };

  // Prepare data for Pie Chart

  const chartData = {
    labels: ["Completed", "In Progress", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          stats.completed,
          stats.in_progress,
          stats.pending,
          stats.overdue,
        ],
        backgroundColor: [
          "#198754", // green
          "#0d6efd", // blue
          "#ffc107", // yellow
          "#dc3545", // red
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container">
      <h2 className="mb-4">Admin Dashboard</h2>

      {fetchTasksRequest.loading && <p>Loading...</p>}
      {/* {fetchTasksRequest.loading && <p>Loading...</p>} */}


      <div className="row g-3">

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Total Task</h5>
              <h3>{stats.total}</h3>
            </div>
          </div>
        </div>

        <div>
          <br />
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Completed</h5>
              <h3 className="text-success">{stats.completed}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>In_progress</h5>
              <h3 className="text-success">{stats.in_progress}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Pending</h5>
              <h3 className="text-warning">{stats.pending}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Overdue</h5>
              <h3 className="text-danger">{stats.overdue}</h3>
            </div>
          </div>
        </div>

      </div>

      <div className="m-4">
      <br />
      </div>

      {/* // Filters */}

      <div className="card p-3 mb-4 shadow-sm">
        <h5>Filter Tasks</h5>

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
              className="btn btn-primary w-100"
              onClick={fetchTasks}
            >
              Apply Filter
            </button>
          </div>

        </div>
      </div>



      <div className="row mt-5">

        {/* LEFT → PIE */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="text-center mb-3">Task Distribution</h5>

            <div style={{ width: "280px", margin: "0 auto" }}>
              <Pie data={chartData} />
            </div>
          </div>
        </div>

        {/* RIGHT → RECENT TASKS */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">Recent Tasks</h5>

            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>

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

                      <td>
                        <span className="badge bg-secondary">
                          {task.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;