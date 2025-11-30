import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTodayStatus, checkIn, checkOut } from '../../store/slices/attendanceSlice';
import { getCurrentUser } from '../../store/slices/authSlice';
import axios from 'axios';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { todayStatus, loading } = useSelector((state) => state.attendance);
  const [dashboardData, setDashboardData] = React.useState(null);

  useEffect(() => {
    dispatch(getTodayStatus());
    dispatch(getCurrentUser());
    loadDashboardData();
  }, [dispatch]);

  const loadDashboardData = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/employee`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn());
    if (result.type === 'attendance/checkIn/fulfilled') {
      dispatch(getTodayStatus());
      loadDashboardData();
    }
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (result.type === 'attendance/checkOut/fulfilled') {
      dispatch(getTodayStatus());
      loadDashboardData();
    }
  };

  if (!dashboardData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Employee Dashboard</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Today's Status</h3>
          <div className="status-display">
            <div className={`status-badge ${todayStatus?.status || 'absent'}`}>
              {todayStatus?.checkedIn
                ? todayStatus?.checkedOut
                  ? 'Checked Out'
                  : 'Checked In'
                : 'Not Checked In'}
            </div>
            {todayStatus?.checkInTime && (
              <p>Check In: {new Date(todayStatus.checkInTime).toLocaleTimeString()}</p>
            )}
            {todayStatus?.checkOutTime && (
              <p>Check Out: {new Date(todayStatus.checkOutTime).toLocaleTimeString()}</p>
            )}
            {todayStatus?.totalHours && (
              <p>Total Hours: {todayStatus.totalHours} hrs</p>
            )}
          </div>
          <div className="action-buttons">
            {!todayStatus?.checkedIn ? (
              <button onClick={handleCheckIn} className="btn btn-success" disabled={loading}>
                Check In
              </button>
            ) : !todayStatus?.checkedOut ? (
              <button onClick={handleCheckOut} className="btn btn-danger" disabled={loading}>
                Check Out
              </button>
            ) : (
              <p className="success">Attendance completed for today</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3>This Month Summary</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{dashboardData.monthSummary.present}</div>
              <div className="stat-label">Present</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{dashboardData.monthSummary.absent}</div>
              <div className="stat-label">Absent</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{dashboardData.monthSummary.late}</div>
              <div className="stat-label">Late</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{dashboardData.monthSummary.totalHours.toFixed(1)}</div>
              <div className="stat-label">Total Hours</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Recent Attendance (Last 7 Days)</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentAttendance.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'danger'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.totalHours || 0} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/employee/mark-attendance" className="btn btn-primary">
              Mark Attendance
            </Link>
            <Link to="/employee/attendance-history" className="btn btn-secondary">
              View History
            </Link>
            <Link to="/employee/profile" className="btn btn-secondary">
              My Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

