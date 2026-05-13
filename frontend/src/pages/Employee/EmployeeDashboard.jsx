import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyAssignedTasksStart,
  fetchMyAssignedTasksSuccess,
  fetchMyAssignedTasksFail,
} from "../../redux/task/taskSlice";

import { getMyAssignedTasksAPI } from "../../services/taskFunctions";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function EmployeeDashboard() {
  const dispatch = useDispatch();

  const { myAssignedTasks, myAssignedStats } = useSelector(
    (state) => state.tasks
  );


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
    fetchMyAssignedTasks();
  }, [dispatch]);

  const fetchMyAssignedTasks = async () => {
    dispatch(fetchMyAssignedTasksStart());
    try {

      const res = await getMyAssignedTasksAPI(selectedMonth, selectedYear);

      console.log("API response in EmployeeDashboard: ", res);

      if (!res || res.error) {
        dispatch(fetchMyAssignedTasksFail(res.message || "Failed to fetch tasks"));
        alert(res.message || "Failed to fetch tasks");
        return;
      }

      dispatch(fetchMyAssignedTasksSuccess(res));
      console.log("Fetched my assigned tasks in EmployeeDashboard: ", res.tasks);
      alert(res.message || "Tasks fetched successfully");
    } catch (error) {
      dispatch(fetchMyAssignedTasksFail("Error fetching tasks"));
      alert("Error fetching tasks");
      return;

    }

  };



  const data = {
    labels: ["Completed", "In Progress", "Pending", "Overdue"],
    datasets: [
      {
        data: [
          myAssignedStats.completed,
          myAssignedStats.in_progress,
          myAssignedStats.pending,
          myAssignedStats.overdue,
        ],
        backgroundColor: ["#28a745", "#17a2b8", "#ffc107", "#dc3545"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2>Employee EmployeeDashboard</h2>

      {/* STATS */}
      <div className="row text-center mt-3">

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Total</h5>
            <h3>{myAssignedStats.total}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Completed</h5>
            <h3>{myAssignedStats.completed}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>In Progress</h5>
            <h3>{myAssignedStats.in_progress}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h5>Pending</h5>
            <h3>{myAssignedStats.pending}</h3>
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
              className="btn btn-info w-100"
              onClick={fetchMyAssignedTasks}
            >
              Apply Filter
            </button>
          </div>

        </div>
      </div>



      {/* PIE */}
      <div className="row mt-5">
        <div className="col-md-12">
          <div className="card p-3 shadow-sm text-center">
            <h5>My Task Distribution</h5>
            <div style={{ maxWidth: "400px", margin: "auto" }}>
              <Pie data={data} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default EmployeeDashboard;