import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchMyAssignedTasksStart,
    fetchMyAssignedTasksSuccess,
    fetchMyAssignedTasksFail,

    updateTaskStatusStart,
    updateTaskStatusSuccess,
    updateTaskStatusFail,
} from "../../redux/task/taskSlice";


import { getMyAssignedTasksAPI, updateTaskStatusAPI } from "../../services/taskFunctions";

function MyTasks() {
    const dispatch = useDispatch();

    const { myAssignedTasks } = useSelector((state) => state.tasks);


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


    // update task status by employee
    const handleStatusChange = async (taskId, newStatus) => {

        dispatch(updateTaskStatusStart());

        try {
            const res = await updateTaskStatusAPI(taskId, newStatus);

            console.log("status update response = ", res);

            if (!res || res.error) {
                dispatch(updateTaskStatusFail(res.message || "Status update failed"));
                alert(res.message || "Status update failed");
                return;
            }

            // IMPORTANT: backend mathi updated task aave chhe → res.task
            dispatch(updateTaskStatusSuccess(res.task));

            alert(res.message || "Status updated successfully");

        } catch (error) {
            dispatch(updateTaskStatusFail("Error updating status"));
            alert("Error updating status");
        }
    };



    return (
        <>

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


            <div className="container mt-4">
                <h2>My Tasks</h2>

                <table className="table table-bordered mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {myAssignedTasks.map((task) => (
                            <tr key={task._id}>
                                <td>{task.title}</td>

                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={task.status}
                                        onChange={(e) =>
                                            handleStatusChange(task._id, e.target.value)
                                        }
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>

                                <td>
                                    <span className="badge bg-secondary">
                                        {task.priority}
                                    </span>
                                </td>

                                <td>
                                    {new Date(task.start_time).toLocaleString()}
                                </td>

                                <td>
                                    {new Date(task.end_time).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </>
    );
}

export default MyTasks;