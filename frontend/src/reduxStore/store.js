import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import taskReducer from "../redux/task/taskSlice";
import employeeReducer from "../redux/employee/employeeSlice";


 const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    employees: employeeReducer,
  },
});

// Export the store so it can be used in main.jsx with <Provider>
export default store;