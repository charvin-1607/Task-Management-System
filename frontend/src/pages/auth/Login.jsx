import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginRequestStart,
  loginRequestSuccess,
  loginRequestFail,
} from "../../redux/auth/authSlice";

import { loginAPI } from "../../services/authFunctions";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginRequest } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginRequestStart());

    try {
      // Call API function from userSlice (fetch-based)
      const response = await loginAPI(formData.email, formData.password);

      if (!response.success) {
        dispatch(loginRequestFail(response.message || "Login failed"));
        alert(response.message || "Login failed");
        alert("error message = " + (response.message || "Login failed"));

        return;
      }

      dispatch(loginRequestSuccess(response));
      alert(response.message || "Login successful");
      console.log("in login component response.message = ", response.message);
      console.log("in login component full response  = ", response)


      const role = response?.user?.role;
      console.log("in Login component role = ", role);


      // Role based redirect
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "tl") {
        navigate("/tl/dashboard");
      } else if (role === "manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/employee/dashboard"); // or separate manager dashboard
      }


      // Optional: clear form after successful login
      setFormData({
        email: "",
        password: "",
      });

    } catch (error) {
      const errorMessage = error.message || "Something went wrong during login";
      dispatch(loginRequestFail(errorMessage));
      alert(errorMessage);
    }

  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card p-4 shadow" style={{ width: "400px" }}>

        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loginRequest.loading}
          >
            {loginRequest.loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Messages */}
        {loginRequest.success && (
          <div className="alert alert-success mt-3">
            {loginRequest.message}
          </div>
        )}

        {loginRequest.error && (
          <div className="alert alert-danger mt-3">
            {loginRequest.error}
          </div>
        )}

       <br />
        <span> <Link to='/forgot-password'> forget password </Link></span>
      </div>


    </div>
  );
}

export default Login;