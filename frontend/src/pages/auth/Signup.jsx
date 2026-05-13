import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signupRequestStart,
  signupRequestSuccess,
  signupRequestFail,
} from "../../redux/auth/authSlice";

import { signupAPI } from "../../services/authFunctions";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { signupRequest } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
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

    dispatch(signupRequestStart());

    try {
        const res = await signupAPI(formData);

        if (!res || res.error) {
            dispatch(signupRequestFail(res.message || "Signup failed"));
            alert("error message = " + (res.message || "Signup failed"));
            return;
          }
    
          dispatch(signupRequestSuccess(res));
          alert(res.message || "Signup successful");
          console.log("in signup component response.message = " , res.message);
          console.log("in signup component full response  = " , res);

          setFormData({name: "", email: "", password: ""});

            // Navigate to login page after successful signup
            navigate("/login");
        
    } catch (error) {
        const errorMessage = error.message || "Something went wrong during signup";
        dispatch(signupRequestFail(errorMessage));
        alert(errorMessage);   
    }

}  

  return (
    <>
    

    <div className="container d-flex justify-content-center align-items-center vh-100">
      
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        
        <h2 className="text-center mb-4">Signup</h2>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
            className="btn btn-primary w-100"
            disabled={signupRequest.loading}
          >
            {signupRequest.loading ? "Signing up..." : "Signup"}
          </button>

        </form>

        {/* Messages */}
        {signupRequest.success && (
          <div className="alert alert-success mt-3">
            {signupRequest.message}
          </div>
        )}

        {signupRequest.error && (
          <div className="alert alert-danger mt-3">
            {signupRequest.error}
          </div>
        )}
    
    <br />
    <span> if you have an account so please login </span>
    <Link to='/login'> login </Link>

      </div>
       
    </div>

    <div>
     
    </div>
      
    </>
  );
}

export default Signup;