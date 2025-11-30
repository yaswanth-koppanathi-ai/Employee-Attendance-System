import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Employee pages
import EmployeeLogin from './pages/Employee/Login';
import EmployeeRegister from './pages/Employee/Register';
import EmployeeDashboard from './pages/Employee/Dashboard';
import MarkAttendance from './pages/Employee/MarkAttendance';
import MyAttendanceHistory from './pages/Employee/MyAttendanceHistory';
import Profile from './pages/Employee/Profile';

// Manager pages
import ManagerLogin from './pages/Manager/Login';
import ManagerDashboard from './pages/Manager/Dashboard';
import AllEmployeesAttendance from './pages/Manager/AllEmployeesAttendance';
import TeamCalendarView from './pages/Manager/TeamCalendarView';
import Reports from './pages/Manager/Reports';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/employee/login"
          element={
            !isAuthenticated ? (
              <EmployeeLogin />
            ) : user?.role === 'employee' ? (
              <Navigate to="/employee/dashboard" />
            ) : (
              <Navigate to="/manager/dashboard" />
            )
          }
        />
        <Route
          path="/employee/register"
          element={
            !isAuthenticated ? (
              <EmployeeRegister />
            ) : user?.role === 'employee' ? (
              <Navigate to="/employee/dashboard" />
            ) : (
              <Navigate to="/manager/dashboard" />
            )
          }
        />
        <Route
          path="/manager/login"
          element={
            !isAuthenticated ? (
              <ManagerLogin />
            ) : user?.role === 'manager' ? (
              <Navigate to="/manager/dashboard" />
            ) : (
              <Navigate to="/employee/dashboard" />
            )
          }
        />

        {/* Employee routes */}
        <Route
          path="/employee/dashboard"
          element={
            <PrivateRoute role="employee">
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/mark-attendance"
          element={
            <PrivateRoute role="employee">
              <MarkAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/attendance-history"
          element={
            <PrivateRoute role="employee">
              <MyAttendanceHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <PrivateRoute role="employee">
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Manager routes */}
        <Route
          path="/manager/dashboard"
          element={
            <PrivateRoute role="manager">
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/attendance"
          element={
            <PrivateRoute role="manager">
              <AllEmployeesAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/calendar"
          element={
            <PrivateRoute role="manager">
              <TeamCalendarView />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/reports"
          element={
            <PrivateRoute role="manager">
              <Reports />
            </PrivateRoute>
          }
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === 'manager' ? (
                <Navigate to="/manager/dashboard" />
              ) : (
                <Navigate to="/employee/dashboard" />
              )
            ) : (
              <Navigate to="/employee/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;

