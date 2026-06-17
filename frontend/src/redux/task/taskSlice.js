import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",

  initialState: {
    tasks: [],
    myCreatedTasks: [],  // TL tasks
    myAssignedTasks: [], // employee tasks
    tlStats: [],        // manager get all tl stats for their tasks
    tlTeamSize: [],    // manger get tl team size

    stats: {
      total: 0,
      completed: 0,
      in_progress: 0,
      pending: 0,
      overdue: 0,
    },

    myCreatedStats: {
      total: 0,
      completed: 0,
      in_progress: 0,
      pending: 0,
      overdue: 0,
    },

    // employee stats for their assigned tasks
    myAssignedStats: {
      total: 0,
      completed: 0,
      in_progress: 0,
      pending: 0,
      overdue: 0,
    },


    fetchTasksRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },

    deleteTaskRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },

    updateTaskRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },


    // create task 
    createTaskRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },


    // assign task
    assignTaskRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },

    // Tl get their created tasks
    fetchMyCreatedTasksRequest: { 
      loading: false,
      success: false,
      error: null,
      message: "",
    },


    // employee get their assigned tasks
    fetchMyAssignedTasksRequest: { 
      loading: false,
      success: false,
      error: null,
      message: "",
    },

    // update task status by employee
    updateTaskStatusRequest: { 
      loading: false,
      success: false,
      error: null,
      message: "",
    },


    // manager get all tl stats for their tasks
    fetchTLTaskStatsRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    }, 


    // manager get tl team size
    fetchTLTeamSizeRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },


    // logs
    fetchLogsRequest: {
      loading: false,
      success: false,
      error: null,
      message: "",
    },
    
    logs: [],


  },

  reducers: {
    // FETCH START
    fetchTasksStart: (state) => {
      state.fetchTasksRequest.loading = true;
      state.fetchTasksRequest.error = null;
      state.fetchTasksRequest.success = false;
    },

    // FETCH SUCCESS
    fetchTasksSuccess: (state, action) => {
      state.fetchTasksRequest.loading = false;
      state.fetchTasksRequest.success = true;
      state.tasks = action.payload.tasks;

      console.log("inside taskSlice, action.payload = ", action.payload);
      console.log("inside taskSlice Fetched tasks: ", action.payload.tasks);

      const total = action.payload.tasks.length;
      const completed = action.payload.tasks.filter(t => t.status === "completed").length;
      const in_progress = action.payload.tasks.filter(t => t.status === "in_progress").length;
      const pending = action.payload.tasks.filter(t => t.status === "pending").length;
      const overdue = action.payload.tasks.filter(t => t.status === "overdue").length;

      state.stats = { total, completed, in_progress, pending, overdue };

      state.fetchTasksRequest.message = action.payload?.message;
    },

    // FETCH FAIL
    fetchTasksFail: (state, action) => {
      state.fetchTasksRequest.loading = false;
      state.fetchTasksRequest.error = action.payload;
    },


    // DELETE START
    deleteTaskStart: (state) => {
      state.deleteTaskRequest.loading = true;
      state.deleteTaskRequest.error = null;
      state.deleteTaskRequest.success = false;
    },

    // DELETE SUCCESS
    deleteTaskSuccess: (state, action) => {
      state.deleteTaskRequest.loading = false;
      state.deleteTaskRequest.success = true;
      state.tasks = state.tasks.filter(
        (task) => task._id !== action.payload
      );
      state.deleteTaskRequest.message = action.payload?.message;
    },

    deleteTaskFail: (state, action) => {
      state.deleteTaskRequest.loading = false;
      state.deleteTaskRequest.error = action.payload;

    },



    // UPDATE TASK START
    updateTaskStart: (state) => {
      state.updateTaskRequest.loading = true;
      state.updateTaskRequest.error = null;
      state.updateTaskRequest.success = false;
    },

    // UPDATE TASK SUCCESS
    updateTaskSuccess: (state, action) => {
      state.updateTaskRequest.loading = false;
      state.updateTaskRequest.success = true;
    
      const updatedTask = action.payload;

      console.log("inside updateTaskSuccess, action.payload = ", action.payload);

      state.tasks = state.tasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      );

      state.updateTaskRequest.message = action.payload?.message;
    },

    // UPDATE TASK FAIL
    updateTaskFail: (state, action) => {
      state.updateTaskRequest.loading = false;
      state.updateTaskRequest.error = action.payload;
    },


    // CREATE TASK START

    createTaskStart: (state) => {
      state.createTaskRequest.loading = true;
      state.createTaskRequest.error = null;
      state.createTaskRequest.success = false;
    },
    
    createTaskSuccess: (state, action) => {
      state.createTaskRequest.loading = false;
      state.createTaskRequest.success = true;
      state.createTaskRequest.message = action.payload?.message;
    
      // optional: push new task in list
      if (action.payload?.data) {
        state.tasks.unshift(action.payload.data);
      }
    },
    
    createTaskFail: (state, action) => {
      state.createTaskRequest.loading = false;
      state.createTaskRequest.error = action.payload;
    },


    // ASSIGN TASK START

    assignTaskStart: (state) => {
      state.assignTaskRequest.loading = true;
      state.assignTaskRequest.error = null;
    },
    
    assignTaskSuccess: (state, action) => {
      state.assignTaskRequest.loading = false;
      state.assignTaskRequest.success = true;
      state.assignTaskRequest.message = action.payload?.message;
    },
    
    assignTaskFail: (state, action) => {
      state.assignTaskRequest.loading = false;
      state.assignTaskRequest.error = action.payload;
    },


    // TL get their created tasks

    fetchMyCreatedTasksStart: (state) => {
      state.fetchMyCreatedTasksRequest.loading = true;
      state.fetchMyCreatedTasksRequest.error = null;
      state.fetchMyCreatedTasksRequest.success = false;
    },

    fetchMyCreatedTasksSuccess: (state, action) => {
      state.fetchMyCreatedTasksRequest.loading = false;
      state.fetchMyCreatedTasksRequest.success = true;
      state.myCreatedTasks = action.payload.tasks;

      console.log("inside taskSlice, action.payload = ", action.payload);
      console.log("inside taskSlice Fetched my created tasks: ", action.payload.tasks);

      const total = action.payload.tasks.length;
      const completed = action.payload.tasks.filter(t => t.status === "completed").length;
      const in_progress = action.payload.tasks.filter(t => t.status === "in_progress").length;
      const pending = action.payload.tasks.filter(t => t.status === "pending").length;
      const overdue = action.payload.tasks.filter(t => t.status === "overdue").length;

      state.myCreatedStats = { total, completed, in_progress, pending, overdue };

      state.fetchMyCreatedTasksRequest.message = action.payload?.message;
    },

    fetchMyCreatedTasksFail: (state, action) => { 
      state.fetchMyCreatedTasksRequest.loading = false;
      state.fetchMyCreatedTasksRequest.error = action.payload;
    },


    // employee get their assigned tasks
    fetchMyAssignedTasksStart: (state) => {
      state.fetchMyAssignedTasksRequest.loading = true;
      state.fetchMyAssignedTasksRequest.error = null;
      state.fetchMyAssignedTasksRequest.success = false;
    },  

    fetchMyAssignedTasksSuccess: (state, action) => {
      state.fetchMyAssignedTasksRequest.loading = false;
      state.fetchMyAssignedTasksRequest.success = true;
      state.myAssignedTasks = action.payload.tasks;

      console.log("inside taskSlice, action.payload = ", action.payload);
      console.log("inside taskSlice Fetched my assigned tasks: ", action.payload.tasks);

      const total = action.payload.tasks.length;
      const completed = action.payload.tasks.filter(t => t.status === "completed").length;
      const in_progress = action.payload.tasks.filter(t => t.status === "in_progress").length;
      const pending = action.payload.tasks.filter(t => t.status === "pending").length;
      const overdue = action.payload.tasks.filter(t => t.status === "overdue").length;

      state.myAssignedStats = { total, completed, in_progress, pending, overdue };

      state.fetchMyAssignedTasksRequest.message = action.payload?.message;
    },  

    fetchMyAssignedTasksFail: (state, action) => {
      state.fetchMyAssignedTasksRequest.loading = false;
      state.fetchMyAssignedTasksRequest.error = action.payload;
    },


    // update task status by employee
    updateTaskStatusStart: (state) => {
      state.updateTaskStatusRequest.loading = true;
      state.updateTaskStatusRequest.error = null;
      state.updateTaskStatusRequest.success = false;
    },

    updateTaskStatusSuccess: (state, action) => {
      state.updateTaskStatusRequest.loading = false;
      state.updateTaskStatusRequest.success = true;
    
      const updatedTask = action.payload;

      console.log("inside updateTaskStatusSuccess, action.payload = ", action.payload);

      state.myAssignedTasks = state.myAssignedTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      );

      state.updateTaskStatusRequest.message = action.payload?.message;
    },

    updateTaskStatusFail: (state, action) => {
      state.updateTaskStatusRequest.loading = false;
      state.updateTaskStatusRequest.error = action.payload;
    },


    // manager get all tl stats for their tasks
      fetchTLTaskStatsStart: (state) => {
        state.fetchTLTaskStatsRequest.loading = true;
        state.fetchTLTaskStatsRequest.error = null;
        state.fetchTLTaskStatsRequest.success = false;
      },

      fetchTLTaskStatsSuccess: (state, action) => {
        state.fetchTLTaskStatsRequest.loading = false;
        state.fetchTLTaskStatsRequest.success = true;
        state.tlStats = action.payload.data;

        console.log("inside taskSlice, action.payload = ", action.payload);
        console.log("inside taskSlice Fetched TL stats: ", action.payload.data);

        state.fetchTLTaskStatsRequest.message = action.payload?.message;
      },

      fetchTLTaskStatsFail: (state, action) => {
        state.fetchTLTaskStatsRequest.loading = false;
        state.fetchTLTaskStatsRequest.error = action.payload;

      },


      // manager get tl team size
      fetchTLTeamSizeStart: (state) => {
        state.fetchTLTeamSizeRequest.loading = true;
        state.fetchTLTeamSizeRequest.error = null;
        state.fetchTLTeamSizeRequest.success = false;
      },

      fetchTLTeamSizeSuccess: (state, action) => {
        state.fetchTLTeamSizeRequest.loading = false;
        state.fetchTLTeamSizeRequest.success = true;
        state.tlTeamSize = action.payload.data;

        console.log("inside taskSlice, action.payload = ", action.payload);
        console.log("inside taskSlice Fetched TL team size: ", action.payload.data);

        state.fetchTLTeamSizeRequest.message = action.payload?.message;
      },

      fetchTLTeamSizeFail: (state, action) => {
        state.fetchTLTeamSizeRequest.loading = false;
        state.fetchTLTeamSizeRequest.error = action.payload;
      },


      //logs

      fetchLogsStart: (state) => {
        state.fetchLogsRequest.loading = true;
        state.fetchLogsRequest.error = null;
      },
      
      fetchLogsSuccess: (state, action) => {
        state.fetchLogsRequest.loading = false;
        state.fetchLogsRequest.success = true;
      
        state.logs = action.payload.logs || [];
      
        state.fetchLogsRequest.message =
          action.payload.message;
      },
      
      fetchLogsFail: (state, action) => {
        state.fetchLogsRequest.loading = false;
        state.fetchLogsRequest.error = action.payload;
      },

  },

});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFail,

  deleteTaskStart,
  deleteTaskSuccess,
  deleteTaskFail,

  updateTaskStart,
  updateTaskSuccess,
  updateTaskFail,

  createTaskStart,
  createTaskSuccess,
  createTaskFail,

  assignTaskStart,
  assignTaskSuccess,
  assignTaskFail,
  
  fetchMyCreatedTasksStart,
  fetchMyCreatedTasksSuccess,
  fetchMyCreatedTasksFail,

  fetchMyAssignedTasksStart,
  fetchMyAssignedTasksSuccess,
  fetchMyAssignedTasksFail,

  updateTaskStatusStart,
  updateTaskStatusSuccess,
  updateTaskStatusFail,

  fetchTLTaskStatsStart,
  fetchTLTaskStatsSuccess,
  fetchTLTaskStatsFail, 

  fetchTLTeamSizeStart,
  fetchTLTeamSizeSuccess,
  fetchTLTeamSizeFail,

  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFail,
  
} = taskSlice.actions;

export default taskSlice.reducer;