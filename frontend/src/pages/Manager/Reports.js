import React, { useState } from 'react';
import axios from 'axios';
import './Reports.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Reports = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: ''
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  React.useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/today-status`);
      const uniqueEmployees = Array.from(
        new Map(response.data.map(emp => [emp.employee.employeeId, emp.employee])).values()
      );
      setEmployees(uniqueEmployees);
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerate = async () => {
    if (!filters.startDate || !filters.endDate) {
      alert('Please select start date and end date');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/attendance/all`, {
        params: filters
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Failed to load attendance:', error);
      alert('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!filters.startDate || !filters.endDate) {
      alert('Please select start date and end date');
      return;
    }

    setExporting(true);
    try {
      const response = await axios.get(`${API_URL}/attendance/export`, {
        params: filters,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${filters.startDate}_${filters.endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Failed to export attendance data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container">
      <h1>Attendance Reports</h1>

      <div className="reports-filters">
        <h3>Generate Report</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Employee (Optional)</label>
            <select
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeId} - {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="action-buttons">
          <button onClick={handleGenerate} className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          <button onClick={handleExport} className="btn btn-success" disabled={exporting || !filters.startDate || !filters.endDate}>
            {exporting ? 'Exporting...' : 'Export to CSV'}
          </button>
        </div>
      </div>

      {attendanceData.length > 0 && (
        <div className="reports-table">
          <h3>Report Results ({attendanceData.length} records)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

