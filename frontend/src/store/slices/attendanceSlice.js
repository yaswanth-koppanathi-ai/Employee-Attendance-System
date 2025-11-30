import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Check in
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/attendance/checkin`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check in failed'
      );
    }
  }
);

// Check out
export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/attendance/checkout`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check out failed'
      );
    }
  }
);

// Get today's status
export const getTodayStatus = createAsyncThunk(
  'attendance/getTodayStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/today`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get today status'
      );
    }
  }
);

// Get my attendance history
export const getMyHistory = createAsyncThunk(
  'attendance/getMyHistory',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const response = await axios.get(`${API_URL}/attendance/my-history`, {
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get history'
      );
    }
  }
);

// Get my summary
export const getMySummary = createAsyncThunk(
  'attendance/getMySummary',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const response = await axios.get(`${API_URL}/attendance/my-summary`, {
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get summary'
      );
    }
  }
);

// Get all attendance (Manager)
export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/all`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get attendance'
      );
    }
  }
);

// Get today status (Manager)
export const getTodayStatusAll = createAsyncThunk(
  'attendance/getTodayStatusAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/today-status`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get today status'
      );
    }
  }
);

// Get team summary (Manager)
export const getTeamSummary = createAsyncThunk(
  'attendance/getTeamSummary',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const response = await axios.get(`${API_URL}/attendance/summary`, {
        params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get team summary'
      );
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    todayStatus: null,
    myHistory: [],
    mySummary: null,
    allAttendance: [],
    todayStatusAll: [],
    teamSummary: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check in
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check out
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get today status
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload;
      })
      // Get my history
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.myHistory = action.payload;
      })
      // Get my summary
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.mySummary = action.payload;
      })
      // Get all attendance
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.allAttendance = action.payload;
      })
      // Get today status all
      .addCase(getTodayStatusAll.fulfilled, (state, action) => {
        state.todayStatusAll = action.payload;
      })
      // Get team summary
      .addCase(getTeamSummary.fulfilled, (state, action) => {
        state.teamSummary = action.payload;
      });
  }
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;

