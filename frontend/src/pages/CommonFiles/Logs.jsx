import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFail,
} from "../../redux/task/taskSlice";

import { getLogsAPI } from "../../services/taskFunctions";

function Logs() {

  const dispatch = useDispatch();

  const { logs, fetchLogsRequest } =
    useSelector((state) => state.tasks);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {

    dispatch(fetchLogsStart());

    try {

      const res = await getLogsAPI();

      if (!res || res.error) {
        dispatch(
          fetchLogsFail(
            res.message || "Failed to fetch logs"
          )
        );
        return;
      }

      dispatch(fetchLogsSuccess(res));

    } catch (error) {

      dispatch(
        fetchLogsFail(error.message)
      );
    }
  };

  if (fetchLogsRequest.loading) {
    return <h3>Loading Logs...</h3>;
  }

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-dark text-white">
          <h3 className="mb-0">Activity Logs</h3>
        </div>

        <div className="card-body">

          <table className="table table-striped table-hover">

            <thead>

              <tr>
                <th>No</th>
                <th>Action</th>
                <th>Task</th>
                <th>Employee</th>
                <th>Role</th>
                <th>Date</th>
              </tr>

            </thead>

            <tbody>

              {logs.length > 0 ? (

                logs.map((log, index) => (

                  <tr key={log._id}>

                    <td>{index + 1}</td>

                    <td>
                      <span className="badge bg-primary">
                        {log.action}
                      </span>
                    </td>

                    <td>
                      {log.task_id?.title || "N/A"}
                    </td>

                    <td>
                      {log.employee_id?.name || "N/A"}
                    </td>

                    <td>
                      {log.employee_id?.role || "N/A"}
                    </td>

                    <td>
                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="6"
                    className="text-center"
                  >
                    No Logs Found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Logs;