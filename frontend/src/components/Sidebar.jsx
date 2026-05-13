import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";


function Sidebar() {
  const { employee } = useSelector((state) => state.auth);
  const role = employee?.role;

  // console.log("Sidebar employee = ", employee);
  // console.log("Sidebar role = ", role);

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center px-3 py-2 rounded ${isActive ? "bg-primary text-white" : "text-dark"
    }`;

  return (
    <div
      className="bg-white border-end shadow-sm d-flex flex-column"
      style={{ width: "240px", height: "100vh" }}
    >
      {/* Logo / Title */}
      <div className="p-3 border-bottom text-center">
        <h5 className="fw-bold mb-0">🚀 Task Manager</h5>
      </div>

      {/* Menu */}
      <ul className="nav flex-column p-3 gap-2">

        {/* ADMIN */}
        {role === "admin" && (
          <>

            <li>
              <NavLink to="/admin/profile" className={linkClass}>
                👤 <span className="ms-2">Profile</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/dashboard" className={linkClass}>
                📊 <span className="ms-2">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/employees" className={linkClass}>
                👥 <span className="ms-2">Employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/tasks" className={linkClass}>
                📋 <span className="ms-2">Tasks</span>
              </NavLink>
            </li>
          </>
        )}

        {/* MANAGER */}
        {role === "manager" && (
          <>

            <li>
              <NavLink to="/manager/profile" className={linkClass}>
                👤 <span className="ms-2">Profile</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/manager/dashboard" className={linkClass}>
                📊 <span className="ms-2">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/manager/assign-tl" className={linkClass}>
                🧑‍💼 <span className="ms-2">Assign TL</span>
              </NavLink>
            </li>
          </>
        )}

        {/* TL */}
        {role === "tl" && (
          <>

            <li>
              <NavLink to="/tl/profile" className={linkClass}>
                👤 <span className="ms-2">Profile</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/tl/dashboard" className={linkClass}>
                📊 <span className="ms-2">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tl/create-task" className={linkClass}>
                ➕ <span className="ms-2">Create Task</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tl/my-team" className={linkClass}>
                👨‍👩‍👧 <span className="ms-2">My Team</span>
              </NavLink>
            </li>
          </>
        )}

        {/* EMPLOYEE */}
        {role === "employee" && (
          <>

            <li>
              <NavLink to="/employee/profile" className={linkClass}>
                👤 <span className="ms-2">Profile</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/employee/dashboard" className={linkClass}>
                📊 <span className="ms-2">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/employee/my-tasks" className={linkClass}>
                📋 <span className="ms-2">My Tasks</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Bottom user info */}
      <div className="mt-auto p-3 border-top text-center">
        <small className="text-muted">{employee?.name}</small>
        <div>
          <span className="badge bg-secondary text-capitalize">
            {employee?.role}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;