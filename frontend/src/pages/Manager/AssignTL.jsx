import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTLStart,
  fetchTLSuccess,
  fetchTLFail,
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFail,
  assignTLStart,
  assignTLSuccess,
  assignTLFail,
} from "../../redux/employee/employeeSlice";

import {
  getAllTLAPI,
  getAllEmployeesAPI,
  assignTLAPI,
} from "../../services/employeeFunctions";

function AssignTL() {
  const dispatch = useDispatch();

  const { tls, employees, assignTLRequest } = useSelector(
    (state) => state.employees
  );

  const [formData, setFormData] = useState({
    tl_id: "",
    employee_id: "",
  });

  //  FETCH TL

   useEffect(() => {
    fetchTL();
  }, [dispatch]);

  
const fetchTL = async () => {
    try {
        dispatch(fetchTLStart());
  
        const res = await getAllTLAPI();
  
        console.log("API fetch TL response: ", res);
  
        if (!res || res.error) {
            dispatch(fetchTLFail(res.message || "Failed to fetch TLs"));
            alert(res.message || "Failed to fetch TLs");
            return;
        }
  
        dispatch(fetchTLSuccess(res));
        console.log("Fetched TLs: ", res.data);
        alert(res.message || "TLs fetched successfully");
        
    } catch (error) {
  
        dispatch(fetchTLFail(error.message || "Failed to fetch TLs"));
        alert(error.message || "Failed to fetch TLs");
    }
  
  };
  



  //  FETCH EMPLOYEES
  useEffect(() => {
    fetchEmployees();
  }, [dispatch]);

  const fetchEmployees = async () => {
    dispatch(fetchEmployeesStart());

    try {
      const res = await getAllEmployeesAPI();

      console.log("API fetch employees response: ", res);

      if (!res || res.error) {
        dispatch(fetchEmployeesFail(res.message || "Failed to fetch employees"));
      //  alert(res.message || "Failed to fetch employees");
        return;
      }

       if (res.success) {
        // only employees (not tl/manager)
        const onlyEmployees = res.employees.filter(
          (e) => e.role === "employee"
        );

        dispatch(fetchEmployeesSuccess(onlyEmployees));
        console.log("Fetched Employees: ", res.employees);
        alert(res.message || "Employees fetched successfully");
    
      }

      
    } catch (error) {
      dispatch(fetchEmployeesFail(error.message || "Failed to fetch employees"));
      alert(error.message || "Failed to fetch employees");
      
    }

};



  //  HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  //  SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(assignTLStart());

    try {
      
      const res = await assignTLAPI(formData);

      console.log("API assign TL response: ", res);

      if (!res || res.error) {
        dispatch(assignTLFail(res.message || "Failed to assign TL"));
        alert(res.message || "Failed to assign TL");
        return;
      }

      dispatch(assignTLSuccess(res));
      console.log("Assigned TL successfully: ", res.data);
      alert(res.message || "TL assigned successfully");

    } catch (error) {
      dispatch(assignTLFail(error.message || "Failed to assign TL"));
      alert(error.message || "Failed to assign TL");
      
    }

 
  };



  return (
    <div className="container">
      <h2 className="mb-4">Assign TL to Employee</h2>

      <div className="card shadow-sm p-4">

        <form onSubmit={handleSubmit}>

          {/* TL */}
          <div className="mb-3">
            <label className="form-label">Select TL</label>
            <select
              className="form-select"
              name="tl_id"
              value={formData.tl_id}
              onChange={handleChange}
              required
            >
              <option value="">Select TL</option>
              {tls.map((tl) => (
                <option key={tl._id} value={tl._id}>
                  {tl.name}
                </option>
              ))}
            </select>
          </div>

          {/* EMPLOYEE */}
          <div className="mb-3">
            <label className="form-label">Select Employee</label>
            <select
              className="form-select"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} {`(${emp.role})`}  
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary w-100"
            disabled={assignTLRequest.loading}
          >
            {assignTLRequest.loading ? "Assigning..." : "Assign TL"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AssignTL;