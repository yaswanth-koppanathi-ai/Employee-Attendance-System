import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { getMyHistory, getMySummary } from '../../store/slices/attendanceSlice';
import 'react-calendar/dist/Calendar.css';
import './MyAttendanceHistory.css';

const MyAttendanceHistory = () => {
  const dispatch = useDispatch();
  const { myHistory, mySummary } = useSelector((state) => state.attendance);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const loadData = () => {
    dispatch(getMyHistory({ month: selectedMonth, year: selectedYear }));
    dispatch(getMySummary({ month: selectedMonth, year: selectedYear }));
  };

  const getAttendanceForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return myHistory.find(
      (record) => new Date(record.date).toISOString().split('T')[0] === dateStr
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const attendance = getAttendanceForDate(date);
      if (attendance) {
        if (attendance.status === 'present') return 'present-day';
        if (attendance.status === 'late') return 'late-day';
        if (attendance.status === 'half-day') return 'halfday-day';
      } else {
        // Check if it's a past weekday (likely absent)
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isPast = date < new Date() && date.toDateString() !== new Date().toDateString();
        if (!isWeekend && isPast) return 'absent-day';
      }
    }
    return null;
  };

  const selectedAttendance = getAttendanceForDate(selectedDate);

  return (
    <div className="container">
      <h1>My Attendance History</h1>

      <div className="history-controls">
        <div className="month-year-selector">
          <label>Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <label>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="view-toggle">
          <button
            className={viewMode === 'calendar' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </button>
          <button
            className={viewMode === 'table' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
        </div>
      </div>

      {mySummary && (
        <div className="summary-card">
          <h3>Monthly Summary</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Present:</span>
              <span className="summary-value present">{mySummary.present}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Absent:</span>
              <span className="summary-value absent">{mySummary.absent}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Late:</span>
              <span className="summary-value late">{mySummary.late}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Hours:</span>
              <span className="summary-value">{mySummary.totalHours.toFixed(1)} hrs</span>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'calendar' ? (
        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            calendarType="US"
          />
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-color present-day"></span>
              <span>Present</span>
            </div>
            <div className="legend-item">
              <span className="legend-color late-day"></span>
              <span>Late</span>
            </div>
            <div className="legend-item">
              <span className="legend-color absent-day"></span>
              <span>Absent</span>
            </div>
            <div className="legend-item">
              <span className="legend-color halfday-day"></span>
              <span>Half Day</span>
            </div>
          </div>
          {selectedAttendance && (
            <div className="attendance-details">
              <h3>Details for {selectedDate.toLocaleDateString()}</h3>
              <div className="details-content">
                <p><strong>Status:</strong> <span className={`badge badge-${selectedAttendance.status === 'present' ? 'success' : selectedAttendance.status === 'late' ? 'warning' : 'danger'}`}>{selectedAttendance.status}</span></p>
                {selectedAttendance.checkInTime && (
                  <p><strong>Check In:</strong> {new Date(selectedAttendance.checkInTime).toLocaleString()}</p>
                )}
                {selectedAttendance.checkOutTime && (
                  <p><strong>Check Out:</strong> {new Date(selectedAttendance.checkOutTime).toLocaleString()}</p>
                )}
                {selectedAttendance.totalHours && (
                  <p><strong>Total Hours:</strong> {selectedAttendance.totalHours} hrs</p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {myHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              ) : (
                myHistory.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'danger'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A'}</td>
                    <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'N/A'}</td>
                    <td>{record.totalHours || 0} hrs</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAttendanceHistory;

