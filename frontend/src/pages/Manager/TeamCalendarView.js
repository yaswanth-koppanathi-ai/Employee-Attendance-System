import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './TeamCalendarView.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TeamCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDateAttendance, setSelectedDateAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAttendance();
  }, [month, year]);

  useEffect(() => {
    loadSelectedDateAttendance();
  }, [selectedDate]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/attendance/all`, {
        params: { startDate, endDate }
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedDateAttendance = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/attendance/all`, {
        params: { startDate: dateStr, endDate: dateStr }
      });
      setSelectedDateAttendance(response.data);
    } catch (error) {
      console.error('Failed to load date attendance:', error);
    }
  };

  const getDateStats = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayRecords = attendanceData.filter(
      (record) => new Date(record.date).toISOString().split('T')[0] === dateStr
    );
    return {
      present: dayRecords.filter(r => r.status === 'present' || r.status === 'late').length,
      absent: dayRecords.filter(r => r.status === 'absent').length,
      total: dayRecords.length
    };
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const stats = getDateStats(date);
      if (stats.total > 0) {
        return (
          <div className="calendar-day-stats">
            <div className="stat-dot present" title={`${stats.present} present`}></div>
            {stats.absent > 0 && <div className="stat-dot absent" title={`${stats.absent} absent`}></div>}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="container">
      <h1>Team Calendar View</h1>

      <div className="calendar-controls">
        <div className="month-year-selector">
          <label>Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <label>Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="calendar-container">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          calendarType="US"
        />
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot present"></div>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot absent"></div>
            <span>Absent</span>
          </div>
        </div>
      </div>

      <div className="selected-date-attendance">
        <h3>Attendance for {selectedDate.toLocaleDateString()}</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : selectedDateAttendance.length === 0 ? (
          <p>No attendance records for this date</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {selectedDateAttendance.map((record) => (
                <tr key={record._id}>
                  <td>{record.userId?.employeeId || 'N/A'}</td>
                  <td>{record.userId?.name || 'N/A'}</td>
                  <td>{record.userId?.department || 'N/A'}</td>
                  <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A'}</td>
                  <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'N/A'}</td>
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
        )}
      </div>
    </div>
  );
};

export default TeamCalendarView;

