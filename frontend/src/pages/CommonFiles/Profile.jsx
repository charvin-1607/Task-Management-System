import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {

    updateEmployeeStart,
    updateEmployeeSuccess,
    updateEmployeeFail,


} from "../../redux/employee/employeeSlice";


import {

    fetchMyDetailsStart,
    fetchMyDetailsSuccess,
    fetchMyDetailsFail,

} from '../../redux/auth/authSlice';


import { updateEmployeeAPI, getMeAPI} from '../../services/employeeFunctions'

function Profile() {

    const dispatch = useDispatch();

    const { employee, fetchMyDetailsRequest } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!employee._id) {

            fetchMyDetails();
        }
    }, []);


    // update state
    const [editUser, setEditUser] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });


 

    // // get me
    const fetchMyDetails = async () => {
        try {
            dispatch(fetchMyDetailsStart());

            const res = await getMeAPI();

            console.log("API fetch my details response: ", res);

            if (!res || res.error) {
                dispatch(fetchMyDetailsFail(res.message || "Failed to fetch employee details"));
                alert(res.message || "Failed to fetch employee details");
                return;
            }

            dispatch(fetchMyDetailsSuccess(res));
            console.log("Fetched employee details: ", res);
            //   alert(" fetch success = " + res.message || "Employee details fetched successfully");

        } catch (error) {
            console.error("Error fetching employee details: ", error);
            dispatch(fetchMyDetailsFail(error.message || "Failed to fetch employee details"));
            alert(error.message || "Failed to fetch employee details");
        }
    };

  

    if (fetchMyDetailsRequest.loading) {
        return <h3>Loading profile...</h3>;
    }

    if (!employee || !employee._id) {
        return <h3>Loading full profile...</h3>;
    }

    //handle update

    // UPDATE TASK
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        dispatch(updateEmployeeStart());

        try {
            const res = await updateEmployeeAPI(
                employee._id,
                formData
            );

            console.log("update respoonse = ", res);


            if (!res || res.error) {
                dispatch(updateEmployeeFail(res.message || "Failed to fetch employee details"));
                alert(res.message || "Failed to fetch employee details");
                return;
            }

            dispatch(updateEmployeeSuccess(res));
            console.log("Fetched employee details: ", res);
            alert(res.message || "Employee details fetched successfully");

            // 🔥 SYNC authSlice
            //   dispatch(updateEmployeeFromProfile(res.employee));

            dispatch(fetchMyDetails());
            alert("Profile updated successfully");



        } catch (error) {
            dispatch(updateEmployeeFail("Error updating profile"));
            console.log("error = ", error.message);
        }
    };





    return (

        <>
            <div className="container mt-4">
                <div className="card shadow p-4">
                    <h3 className="mb-4">My Profile</h3>
                </div>
            </div>

            <br /> <br />


            <div className="card shadow-lg border-0 rounded-4 p-4">
                <div className="text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: "80px", height: "80px", fontSize: "30px" }}>
                        {employee.name?.charAt(0).toUpperCase()}
                    </div>

                    <h4 className="mt-3">{employee.name}</h4>
                    <span className="badge bg-secondary">{employee.role}</span>
                </div>

                <hr />

                <p><strong>Email:</strong> {employee.email}</p>
                <p><strong>User ID:</strong> {employee._id}</p>
                <p><strong>Joined:</strong> {new Date(employee.createdAt).toLocaleString()}</p>

                <div>
                    <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                            setEditUser(employee);
                            setFormData({
                                name: employee.name,
                                email: employee.email
                            });
                        }}
                    >
                        Edit
                    </button>
                </div>

            </div>

            {/* MODAL */}

            {editUser && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Edit User</h5>
                                <button className="btn-close" onClick={() => setEditUser(null)}></button>
                            </div>

                            <div className="modal-body">

                                <input
                                    className="form-control mb-2"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="name"
                                />

                                <input
                                    className="form-control mb-2"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email"
                                />


                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setEditUser(null)}>
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



        </>
    );
}

export default Profile;