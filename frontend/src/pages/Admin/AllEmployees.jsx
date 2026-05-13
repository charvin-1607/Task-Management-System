import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFail,

  deleteEmployeeStart,
  deleteEmployeeSuccess,
  deleteEmployeeFail,

  updateEmployeeStart,
  updateEmployeeSuccess,
  updateEmployeeFail,

} from "../../redux/employee/employeeSlice";


// API functions
import {
  getAllEmployeesAPI,
  deleteEmployeeAPI,
  updateEmployeeAPI,
} from "../../services/employeeFunctions";



function AllEmployees() {
  const dispatch = useDispatch();
  const { employees,fetchEmployeeRequest,deleteEmployeeRequest,updateEmployeeRequest } = useSelector((state) => state.employees);


  
  // FETCH
  useEffect(() => {
    fetchEmployees();
  }, [dispatch]);


  const fetchEmployees = async () => {
    try {
        dispatch(fetchEmployeesStart());

        const res = await getAllEmployeesAPI();

        console.log("API fetrch employee response: ", res);

        if (!res || res.error) {
            dispatch(fetchEmployeesFail(res.message || "Failed to fetch tasks"));
            alert(res.message || "Failed to fetch tasks");
            return;
        }

        dispatch(fetchEmployeesSuccess(res));
        console.log("Fetched employees: ", res.employees);
        alert(res.message || "Employees fetched successfully");
        
    } catch (error) {

        dispatch(fetchEmployeesFail(error.message || "Failed to fetch employees"));
        alert(error.message || "Failed to fetch employees");
    }

};




  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      dispatch(deleteEmployeeStart());

      const res = await deleteEmployeeAPI(id);

      console.log("API delete employee response: ", res);

      if (!res || res.error) {
        dispatch(deleteEmployeeFail(res.message || "Failed to delete employee"));
        alert(res.message || "Failed to delete employee");
        return;
      }

      dispatch(deleteEmployeeSuccess(id));
      alert(res.message || "Employee deleted");

    } catch (error) {   
      dispatch(deleteEmployeeFail(error.message || "Failed to delete employee"));
      alert(error.message || "Failed to delete employee");
    }

  };

   


  // UPDATE ROLE
  const handleRoleChange = async (id,newData) => {

    try {
      dispatch(updateEmployeeStart());

      const res = await updateEmployeeAPI(id,newData);

      console.log("API update role response: ", res);

      if (!res || res.error) {
        dispatch(updateEmployeeFail(res.message || "Failed to update role"));
        alert(res.message || "Failed to update role");
        return;
      }

      dispatch(updateEmployeeSuccess(res));
      alert(res.message || "Role updated");

      fetchEmployees();

    } catch (error) {   
      dispatch(updateEmployeeFail(error.message || "Failed to update role"));
      alert(error.message || "Failed to update role");
    }
    
  };


  return (
    <div className="container">
      <h2 className="mb-4">All Employees</h2>

      {fetchEmployeeRequest.loading && <p>Loading...</p>}

      <div className="card shadow-sm p-3">
        <div className="table-responsive">
          <table className="table table-bordered table-hover">

            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>

                  <td>
                    <select
                      className="form-select"
                      value={emp.role}
                      onChange={(e) =>
                        handleRoleChange(emp._id, { role: e.target.value })
                      }
                    >
                      <option value="employee">Employee</option>
                      <option value="tl">TL</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default AllEmployees;