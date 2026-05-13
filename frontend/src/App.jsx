import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";

import {

  fetchMyDetailsStart,
  fetchMyDetailsSuccess,
  fetchMyDetailsFail,

} from './redux/auth/authSlice';



import { getMeAPI } from './services/employeeFunctions';

import GlobalLoader from "./components/GlobalLoader";

import './App.css'
import AppRoutes from './Routes/Routes'

function App() {

  const dispatch = useDispatch();

  // const {loading,error,success} = useSelector((state) => state.employees.fetchMyDetailsRequest);

  const { fetchMyDetailsRequest } = useSelector((state) => state.auth);
  // const { auth } = useSelector((state) => state.auth);
  const { fetchTasksRequest } = useSelector((state) => state.tasks);

  useEffect(() => {
    fetchMyDetails();
  }, []);

  const fetchMyDetails = async () => {
    try {
      dispatch(fetchMyDetailsStart());

      const res = await getMeAPI();

      console.log("API fetch my details response: ", res);

      if (!res || res.error) {
        dispatch(fetchMyDetailsFail(res.message || "Failed to fetch employee details"));
     //   alert(res.message || "Failed to fetch employee details");
        return;
      }

      dispatch(fetchMyDetailsSuccess(res));
      console.log("Fetched employee details: ", res);
      //alert(res.message || "Employee details fetched successfully");

    } catch (error) {
      console.error("Error fetching employee details: ", error);
      dispatch(fetchMyDetailsFail(error.message || "Failed to fetch employee details"));
      alert(error.message || "Failed to fetch employee details");
    }
  };


  const isLoading =
    fetchMyDetailsRequest.loading ||
    fetchTasksRequest.loading;


  return (
    <>
      {isLoading && <GlobalLoader />}
      <AppRoutes />
    </>
  )
}

export default App
