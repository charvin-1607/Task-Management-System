import React, { useEffect, useState } from 'react'

import {

    changePasswordReqStart,
    changepasswordReqSuccess,
    changePasswordReqFail,

} from '../../redux/employee/employeeSlice'


import { changePasswordAPI } from '../../services/employeeFunctions'
import { useDispatch, useSelector } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'



const ChangePassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { employee } = useSelector((state) => state.auth);

    //change password state
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: ""
    });


    const handleChangeValue = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };



    const handleChangePassword = async (e) => {

        e.preventDefault();
        try {

            dispatch(changePasswordReqStart());

            const res = await changePasswordAPI(formData);

            console.log("res = ", res);


            if (!res.success) {
                dispatch(changePasswordReqFail(res.message || "Failed to fetch employee details"));
                alert("inside change password fail = "  + res.message || "Failed to fetch employee details");
                return;
            }


            dispatch(changepasswordReqSuccess(res));
            alert("change password successs = " + res.message);
            console.log("res.messsage = ", res.message);

            setFormData({ currentPassword: "", newPassword: "" });

            const role = employee?.role;
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


        } catch (error) {
            dispatch(changePasswordReqFail(error.message || "Failed to fetch employee details"));
            alert(error.message || "Failed to fetch employee details");
        }



    }


    return (
        <>
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div
                    className="card shadow-lg border-0 p-4"
                    style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}
                >
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">Change Password</h2>
                        <p className="text-muted mb-0">
                            Update your account password securely
                        </p>
                    </div>

                    <form onSubmit={handleChangePassword}>

                        {/* Current Password */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                Current Password
                            </label>

                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="Enter current password"
                                value={formData.currentPassword}
                                onChange={handleChangeValue}
                                className="form-control form-control-lg"
                            />
                        </div>

                        {/* New Password */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                New Password
                            </label>

                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChangeValue}
                                className="form-control form-control-lg"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-dark w-100 btn-lg"
                        >
                            Change Password
                        </button>

                    </form>

                    <br /> <br />

                    <span> <Link to='/forgot-password'> forget password </Link></span>


                </div>
            </div>
        </>
    )
}

export default ChangePassword
