import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  
  initialState: {
    data: [],
    employee: null,
    authToken: "",
    authChecked: false,

    signupRequest: { 
      loading: false,
      success: false,
      error: null,
      message: "",
    },
    loginRequest: { 
     loading: false,
     success: false,
     error: null,
     message: "",
    },

    logoutRequest:{
      loading: false,
     success: false,
     error: null,
     message: "",

    },

    
     //get me [ employees fetch therir own details when they login and view their dashboard]
     fetchMyDetailsRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
     },

  
  
  },

  reducers: {
    // SIGNUP
    signupRequestStart: (state) => {
      state.signupRequest.loading = true;
      state.signupRequest.success = false;
      state.signupRequest.error = null;
      state.signupRequest.message = "";
    },
    signupRequestSuccess: (state, action) => {
      state.signupRequest.loading = false;
      state.signupRequest.success = true;
      state.signupRequest.message = action.payload?.message || "Signup successful";
      console.log("in user slice inside singup  = ", action.payload);
      
    },
    signupRequestFail: (state, action) => {
      state.signupRequest.loading = false;
      state.signupRequest.error = action.payload || "Signup failed";
      console.log("in userslice = ",state.signupRequest.error);
    },


    // LOGIN
    loginRequestStart: (state) => {
      state.loginRequest.loading = true;
      state.loginRequest.success = false;
      state.loginRequest.error = null;
      state.loginRequest.message = "";
    },
    loginRequestSuccess: (state, action) => {
      state.loginRequest.loading = false;
      state.loginRequest.success = true;
      state.loginRequest.message = action.payload?.message || "Login successful";
      state.employee = action.payload?.user || null;

     console.log("in userslice action.payload = ", action.payload);
     console.log("in userslice state.employee = ", state.employee);

     state.authToken = action.payload.token;
     state.authChecked = true;  
    },
    
    loginRequestFail: (state, action) => {
      state.loginRequest.loading = false;
      state.loginRequest.error = action.payload || "Login failed";
      console.log("in userslice = ",state.loginRequest.error);
  },


  // logout 

 
  logoutRequestStart: (state) => {
    state.logoutRequest.loading = true;
    state.logoutRequest.success = false;
    state.logoutRequest.error = null;
    state.logoutRequest.message = "";
  },
 
  logoutRequestSuccess: (state, action) => {
    state.logoutRequest.loading = false;
    state.logoutRequest.success = true;
    state.logoutRequest.message = action.payload?.message || "Login successful";
    state.employee = null;
   state.authToken = "";
   state.authChecked = false;  
  },

  logutRequestFail: (state, action) => {
    state.logoutRequest.loading = false;
    state.logoutRequest.error = action.payload || "Login failed";
    console.log("in userslice = ",state.loginRequest.error);
 },





  
    // employee get their own details when they login and view their dashboard
    fetchMyDetailsStart: (state) => {
      state.fetchMyDetailsRequest.loading = true;
      state.fetchMyDetailsRequest.success = false;
      state.fetchMyDetailsRequest.error = null;
    },

    fetchMyDetailsSuccess: (state, action) => {
      state.fetchMyDetailsRequest.loading = false;
      state.fetchMyDetailsRequest.success = true;
      state.employee = action.payload.employee;

      console.log("inside employeeSlice, action.payload = ", action.payload);
      console.log("inside employeeSlice Fetched employee details: ", action.payload.employee);

      state.fetchMyDetailsRequest.message = action.payload.message;

      state.authChecked = true; // set authChecked to true after we have fetched employee details, so that we can show the appropriate UI (login page or dashboard) without any flickering
    },

    fetchMyDetailsFail: (state, action) => {
      state.fetchMyDetailsRequest.loading = false;
      state.fetchMyDetailsRequest.error = action.payload;
    },


},
  
});

export const {

  signupRequestStart,
  signupRequestSuccess,
  signupRequestFail,

  loginRequestStart,
  loginRequestSuccess,
  loginRequestFail,

  logoutRequestStart,
  logoutRequestSuccess,
  logutRequestFail,

  fetchMyDetailsStart,
  fetchMyDetailsSuccess,
  fetchMyDetailsFail,
 

} = authSlice.actions;

export default authSlice.reducer;
