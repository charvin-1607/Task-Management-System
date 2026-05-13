import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchTasksStart,
    fetchTasksSuccess,
    fetchTasksFail,

    deleteTaskStart,
    deleteTaskFail,
    deleteTaskSuccess,

    updateTaskStart,
    updateTaskSuccess,
    updateTaskFail,
} from "../../redux/task/taskSlice";

// API functions
import {
    getAllTasksAPI,
    deleteTaskAPI,
    updateTaskAPI,
} from "../../services/taskFunctions";

function AllTasks() {
    const dispatch = useDispatch();
    const { tasks, fetchTasksRequest, deleteTaskRequest } = useSelector((state) => state.tasks);

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

        } catch (error) {
            dispatch(deleteTaskFail(error.message || "Delete failed"));
            alert("Error deleting task: " + (error.message || "Delete failed"));
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


    return (
        <>
            {/* // Filters */}

            < div className="card p-3 mb-4 shadow-sm" >
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
            </div >




            <div className="container">
                <h2 className="mb-4">All Tasks</h2>

                {fetchTasksRequest.loading && <p>Loading...</p>}
                {fetchTasksRequest.error && <p>Error...</p>}


                <div className="card shadow-sm p-3" >
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover p-3">

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

                                        <td>
                                            {new Date(task.start_time).toLocaleString()}
                                        </td>

                                        <td>
                                            {new Date(task.end_time).toLocaleString()}
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(task._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>

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


                        {/*  Edit Modal */}

                        {editTask && (
                            <div className="modal d-block" tabIndex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">

                                        <div className="modal-header">
                                            <h5 className="modal-title">Edit Task</h5>
                                            <button className="btn-close" onClick={() => setEditTask(null)}></button>
                                        </div>

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
                        )}

                    </div>
                </div>
            </div>

        </>
    );
}

export default AllTasks;