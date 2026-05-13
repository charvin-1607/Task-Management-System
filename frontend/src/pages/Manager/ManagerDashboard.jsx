import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFail,
} from "../../redux/employee/employeeSlice";

import {
  fetchTLTaskStatsStart,
  fetchTLTaskStatsSuccess,
  fetchTLTaskStatsFail,

  fetchTLTeamSizeStart,
  fetchTLTeamSizeSuccess,
  fetchTLTeamSizeFail,

} from "../../redux/task/taskSlice";



import { getAllEmployeesAPI, getTLTeamSizeAPI } from "../../services/employeeFunctions";

import { getTLTaskStatsAPI } from "../../services/taskFunctions";

import {
  fetchTLStart,
  fetchTLSuccess,
  fetchTLFail,
} from "../../redux/employee/employeeSlice";

import { getAllTLAPI } from "../../services/employeeFunctions";



function ManagerDashboard() {
  const dispatch = useDispatch();

  const { stats, fetchEmployeeRequest, tls, fetchTlRequest } = useSelector(
    (state) => state.employees
  );

  const { tlStats, tlTeamSize } = useSelector((state) => state.tasks);


  // FETCH all employees 
  useEffect(() => {
    fetchEmployees();
  }, [dispatch]);


  //fetch all TLs for manager 
  useEffect(() => {
    fetchTL();
  }, [dispatch]);


  //fetch TL stats for manager
  useEffect(() => {
    fetchTLStats();
  }, [dispatch]);


  // fetch TL team size for manager
  useEffect(() => {
    fetchTLTeamSize();
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


  const fetchTLStats = async () => {
    dispatch(fetchTLTaskStatsStart());

    try {
      const res = await getTLTaskStatsAPI();

      console.log("API fetch TL stats response: ", res);

      if (!res || res.error) {
        dispatch(fetchTLTaskStatsFail(res.message || "Failed to fetch TL stats"));
        alert(res.message || "Failed to fetch TL stats");
        return;
      }

      dispatch(fetchTLTaskStatsSuccess(res));
      console.log("Fetched TL stats: ", res.data);
      alert(res.message || "TL stats fetched successfully");

    } catch (error) {
      dispatch(fetchTLTaskStatsFail(error.message || "Failed to fetch TL stats"));
      alert(error.message || "Failed to fetch TL stats");
    }
  };


  const fetchTLTeamSize = async () => {
    dispatch(fetchTLTeamSizeStart());

    try {
      const res = await getTLTeamSizeAPI();

      console.log("API fetch TL team size response: ", res);

      if (!res || res.error) {
        dispatch(fetchTLTeamSizeFail(res.message || "Failed to fetch TL team size"));
        alert(res.message || "Failed to fetch TL team size");
        return;
      }

      dispatch(fetchTLTeamSizeSuccess(res));
      console.log("Fetched TL team size: ", res.data);
      alert(res.message || "TL team size fetched successfully");

    } catch (error) {
      dispatch(fetchTLTeamSizeFail(error.message || "Failed to fetch TL team size"));
      alert(error.message || "Failed to fetch TL team size");
    }
  }


  return (
    <div className="container">
      <h2 className="mb-4">Manager Dashboard</h2>

      {fetchEmployeeRequest.loading && <p>Loading...</p>}

      <div className="row g-3">

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Total Employees</h5>
              <h3>{stats.totalEmployees}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Total TL</h5>
              <h3>{stats.totalTL}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Total Managers</h5>
              <h3>{stats.totalManagers}</h3>
            </div>
          </div>
        </div>


      </div>




      <div className="row mt-5">

        <div className="col-md-12">
          <div className="card shadow-sm p-3">

            {fetchTlRequest.loading && <p>Loading TLs...</p>}

            <h5 className="mb-3">Team Leaders</h5>

            {tls.length === 0 ? (
              <p>No TL found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered">

                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tls.map((tl) => (
                      <tr key={tl._id}>
                        <td>{tl.name}</td>
                        <td>{tl.email}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            )}

          </div>
        </div>

      </div>


      <div className="card p-3 mt-4 shadow-sm">
        <h5>TL Performance</h5>

        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Total</th>
              <th>Completed</th>
              <th>Pending</th>
              <th>In Progress</th>
            </tr>
          </thead>

          <tbody>
            {tlStats.map((tl) => (
              <tr key={tl.tl_id}>
                <td>{tl.name}</td>

                <td>{tl.total}</td>

                <td>
                  <span className="badge bg-success">
                    {tl.completed}
                  </span>
                </td>

                <td>
                  <span className="badge bg-warning text-dark">
                    {tl.pending}
                  </span>
                </td>

                <td>
                  <span className="badge bg-primary">
                    {tl.in_progress}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="card p-3 mt-4 shadow-sm">
        <h5>Team Size per TL</h5>

        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Team Size</th>
            </tr>
          </thead>

          <tbody>
            {tlTeamSize.map((tl) => (
              <tr key={tl.tl_id}>
                <td>{tl.name}</td>
                <td>{tl.email}</td>
                <td>
                  <span className="badge bg-info">
                    {tl.teamSize}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ManagerDashboard;