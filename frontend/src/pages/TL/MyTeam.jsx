import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyTeamStart,
  fetchMyTeamSuccess,
  fetchMyTeamFail,
} from "../../redux/employee/employeeSlice";

import { getMyTeamAPI } from "../../services/employeeFunctions";

function MyTeam() {
  const dispatch = useDispatch();

  const { myTeam, fetchMyTeamRequest } = useSelector(
    (state) => state.employees
  );

  useEffect(() => {
    fetchTeam();
  }, [dispatch]);


  const fetchTeam = async () => {
    
    try {
      dispatch(fetchMyTeamStart());

      const res = await getMyTeamAPI();

      console.log("API fetch my team response: ", res);

      if (!res || res.error) {
        dispatch(fetchMyTeamFail(res.message || "Failed to fetch team members"));
        alert(res.message || "Failed to fetch team members");
        return;
      }

      dispatch(fetchMyTeamSuccess(res.data));
      console.log("Fetched my team members: ", res.data);
      alert(res.message || "Team members fetched successfully");
      
    } catch (error) {
      console.error("Error fetching my team: ", error);
      dispatch(fetchMyTeamFail(error.message || "Failed to fetch team members"));
      alert(error.message || "Failed to fetch team members");
    }
  };


  return (
    <div className="container">
      <h2 className="mb-4">My Team</h2>

      {fetchMyTeamRequest.loading && <p>Loading...</p>}

      <div className="card shadow-sm p-3">
        {myTeam.length === 0 ? (
          <p>No team members assigned</p>
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
                {myTeam.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTeam;