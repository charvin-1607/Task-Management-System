import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { logoutAPI } from "../services/authFunctions";
import {

  logoutRequestStart,
  logoutRequestSuccess,
  logutRequestFail
} from "../redux/auth/authSlice";

function Navbar() {

  const dispatch = useDispatch();
  const { employee } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout")) return;
    try {

      dispatch(logoutRequestStart());

      const res = await logoutAPI();

      console.log("logout response = ", res);

      if (!res || res.error) {
        dispatch(logutRequestFail(res));
        alert("inside !res error =" + res.message || "Logout failed");
        return;
      }

      dispatch(logoutRequestSuccess(res));
      alert("inside logout = " + res.message);

      navigate("/");

    } catch (error) {
      dispatch(logutRequestFail(error.message));
      alert(" inside catch =" + error.message || "Logout failed");

    }

  }




  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand mb-0 h1">Task Manager</span>

      <div className="text-white">
        {employee && (
          <>
            <span className="me-3">{employee.name}</span>
            <span className="badge bg-warning text-dark">
              {employee.role}
            </span>
          </>
        )}
      </div>

    
    
    
      <div className="dropdown me-3">

        <button
          className="btn btn-success dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          ⚙ Settings
        </button>

        <ul className="dropdown-menu">

          <li>
            <button
              className="dropdown-item"
              onClick={() => navigate("/change-password")}
            >
              🔒 Change Password
            </button>
          </li>

        </ul>

      </div>




      <div>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;