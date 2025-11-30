import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayStatus, checkIn, checkOut } from '../../store/slices/attendanceSlice';
import './MarkAttendance.css';

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { todayStatus, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getTodayStatus());
  }, [dispatch]);

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn());
    if (result.type === 'attendance/checkIn/fulfilled') {
      dispatch(getTodayStatus());
    }
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (result.type === 'attendance/checkOut/fulfilled') {
      dispatch(getTodayStatus());
    }
  };

  return (
    <div className="container">
      <h1>Mark Attendance</h1>
      <div className="attendance-card">
        <div className="attendance-header">
          <h2>Today's Attendance</h2>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="attendance-status">
          <div className="status-item">
            <span className="status-label">Check In Status:</span>
            <span className={`status-value ${todayStatus?.checkedIn ? 'checked' : 'not-checked'}`}>
              {todayStatus?.checkedIn ? '✓ Checked In' : '✗ Not Checked In'}
            </span>
          </div>
          {todayStatus?.checkInTime && (
            <div className="status-item">
              <span className="status-label">Check In Time:</span>
              <span className="status-value">
                {new Date(todayStatus.checkInTime).toLocaleString()}
              </span>
            </div>
          )}

          <div className="status-item">
            <span className="status-label">Check Out Status:</span>
            <span className={`status-value ${todayStatus?.checkedOut ? 'checked' : 'not-checked'}`}>
              {todayStatus?.checkedOut ? '✓ Checked Out' : '✗ Not Checked Out'}
            </span>
          </div>
          {todayStatus?.checkOutTime && (
            <div className="status-item">
              <span className="status-label">Check Out Time:</span>
              <span className="status-value">
                {new Date(todayStatus.checkOutTime).toLocaleString()}
              </span>
            </div>
          )}

          {todayStatus?.totalHours && (
            <div className="status-item">
              <span className="status-label">Total Hours:</span>
              <span className="status-value">{todayStatus.totalHours} hrs</span>
            </div>
          )}

          <div className="status-item">
            <span className="status-label">Status:</span>
            <span className={`badge badge-${todayStatus?.status === 'present' ? 'success' : todayStatus?.status === 'late' ? 'warning' : 'danger'}`}>
              {todayStatus?.status || 'absent'}
            </span>
          </div>
        </div>

        <div className="attendance-actions">
          {!todayStatus?.checkedIn ? (
            <button
              onClick={handleCheckIn}
              className="btn btn-success btn-large"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Check In'}
            </button>
          ) : !todayStatus?.checkedOut ? (
            <button
              onClick={handleCheckOut}
              className="btn btn-danger btn-large"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Check Out'}
            </button>
          ) : (
            <div className="completed-message">
              <p className="success">✓ Attendance completed for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;

