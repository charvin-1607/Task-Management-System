import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employees",

  initialState: {
    employees: [],

    tls: [],            // for manager to show all TLs in dropdown when assigning TL to employee

    myTeam: [],         // TL's team members when TL logs in and views their dashboard

    // me: null,      // for employee to show their own details when they login and view their dashboard


    //Employee CRUD operations states 

    fetchEmployeeRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },

    deleteEmployeeRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },

    updateEmployeeRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },


    //employee counting
    stats: {
      totalEmployees: 0,
      totalTL: 0,
      totalManagers: 0,
    },


    //fetching all TLs for manager when assigning TL to employee

    fetchTlRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },


    // manager assign tl to employee

    assignTLRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },

    // TL get their team members

    fetchMyTeamRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },

    //change password
    changePasswordRequest:{
      loading: false,
      success: false,
      error: null,
      message: "",
    }


  },

  reducers: {

    // fetch employees

    fetchEmployeesStart: (state) => {
      state.fetchEmployeeRequest.loading = true;
      state.fetchEmployeeRequest.error = null;
    },

    fetchEmployeesSuccess: (state, action) => {
      state.fetchEmployeeRequest.loading = false;
      state.fetchEmployeeRequest.success = true;
      state.employees = action.payload.employees;

      console.log("inside employeeSlice, action.payload = ", action.payload);
      console.log("inside employeeSlice Fetched employees: ", action.payload.employees);

      const totalEmployees = action.payload.employees.filter(e => e.role === "employee").length;
      const totalTL = action.payload.employees.filter(e => e.role === "tl").length;
      const totalManagers = action.payload.employees.filter(e => e.role === "manager").length;

      state.stats = {
        totalEmployees,
        totalTL,
        totalManagers,
      };


      state.fetchEmployeeRequest.message = action.payload.message;
    },

    fetchEmployeesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // delete employee

    deleteEmployeeStart: (state) => {
      state.deleteEmployeeRequest.loading = true;
      state.deleteEmployeeRequest.error = null;
    },

    deleteEmployeeSuccess: (state, action) => {
      state.deleteEmployeeRequest.loading = false;
      state.deleteEmployeeRequest.success = true;

      state.employees = state.employees.filter(
        (emp) => emp._id !== action.payload
      );

      state.deleteEmployeeRequest.message = action.payload.message;
    },


    deleteEmployeeFail: (state, action) => {
      state.deleteEmployeeRequest.loading = false;
      state.deleteEmployeeRequest.error = action.payload;
    },


    // update employee role


    updateEmployeeStart: (state) => {
      state.updateEmployeeRequest.loading = true;
      state.updateEmployeeRequest.error = null;
    },

    updateEmployeeSuccess: (state, action) => {
      state.updateEmployeeRequest.loading = false;
      state.updateEmployeeRequest.success = true;
    
      const updatedEmp = action.payload.employee;
    
      // safety check
      if (!updatedEmp || !updatedEmp._id) return;
    
      state.employees = state.employees.map((emp) =>
        emp._id === updatedEmp._id
          ? { ...emp, ...updatedEmp }   // merge updated fields
          : emp
      );
    
      console.log("Updated employees array = ", state.employees);
    
      state.updateEmployeeRequest.message = action.payload.message;
    },

    updateEmployeeFail: (state, action) => {
      state.updateEmployeeRequest.loading = false;
      state.updateEmployeeRequest.error = action.payload;
    },


    // fetch all TLs for manager when assigning TL to employee

    fetchTLStart: (state) => {
      state.fetchTlRequest.loading = true;
      state.fetchTlRequest.error = null;
    },

    fetchTLSuccess: (state, action) => {
      state.fetchTlRequest.loading = false;
      state.fetchTlRequest.success = true;
      state.tls = action.payload.data;

      console.log("inside employeeSlice, action.payload = ", action.payload);
      console.log("inside employeeSlice Fetched TLs: ", action.payload.data);

      state.fetchTlRequest.message = action.payload.message;
    },

    fetchTLFail: (state, action) => {
      state.fetchTlRequest.loading = false;
      state.fetchTlRequest.error = action.payload;
    },


    // assign tl

    assignTLStart: (state) => {
      state.assignTLRequest.loading = true;
      state.assignTLRequest.error = null;
      state.assignTLRequest.success = false;
    },

    assignTLSuccess: (state, action) => {
      state.assignTLRequest.loading = false;
      state.assignTLRequest.success = true;
      state.assignTLRequest.message = action.payload?.message;
    },

    assignTLFail: (state, action) => {
      state.assignTLRequest.loading = false;
      state.assignTLRequest.error = action.payload;
    },


    // TL get their team members
    fetchMyTeamStart: (state) => {
      state.fetchMyTeamRequest.loading = true;
      state.fetchMyTeamRequest.error = null;
    },

    fetchMyTeamSuccess: (state, action) => {
      state.fetchMyTeamRequest.loading = false;
      state.fetchMyTeamRequest.success = true;
      state.myTeam = action.payload;

      console.log("inside employeeSlice, action.payload = ", action.payload);

      state.fetchMyTeamRequest.message = action.payload.message;
    },

    fetchMyTeamFail: (state, action) => {
      state.fetchMyTeamRequest.loading = false;
      state.fetchMyTeamRequest.error = action.payload;
    },


    // change password

    changePasswordReqStart: (state) => {
      state.changePasswordRequest.loading = true;
      state.changePasswordRequest.error = null;
    },

    changepasswordReqSuccess:(state, action) => {
      state.changePasswordRequest.loading = false;
      state.changePasswordRequest.success = true;
      state.changePasswordRequest.message = action.payload.message;

      console.log("inside employeeSlice, action.payload = ", action.payload);
    },

    changePasswordReqFail: (state, action) => {
      state.changePasswordRequest.loading = false;
      state.changePasswordRequest.error = action.payload;
    },


  },
});

export const {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFail,

  deleteEmployeeStart,
  deleteEmployeeSuccess,
  deleteEmployeeFail,

  updateEmployeeStart,
  updateEmployeeSuccess,
  updateEmployeeFail,

  fetchTLStart,
  fetchTLSuccess,
  fetchTLFail,

  assignTLStart,
  assignTLSuccess,
  assignTLFail,

  fetchMyTeamStart,
  fetchMyTeamSuccess,
  fetchMyTeamFail,

  changePasswordReqStart,
  changepasswordReqSuccess,
  changePasswordReqFail,

} = employeeSlice.actions;

export default employeeSlice.reducer;