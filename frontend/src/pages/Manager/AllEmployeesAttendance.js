import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance } from '../../store/slices/attendanceSlice';
import axios from 'axios';
import './AllEmployeesAttendance.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AllEmployeesAttendance = () => {
  const dispatch = useDispatch();
  const { allAttendance } = useSelector((state) => state.attendance);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadAttendance();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [filters]);

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

  const loadAttendance = async () => {
    setLoading(true);
    try {
      await dispatch(getAllAttendance(filters));
    } catch (error) {
      console.error('Failed to load attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      employeeId: '',
      startDate: '',
      endDate: '',
      status: ''
    });
  };

  return (
    <div className="container">
      <h1>All Employees Attendance</h1>

      <div className="filters-card">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Employee</label>
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
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
        </div>
        <button onClick={clearFilters} className="btn btn-secondary">
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
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
              {allAttendance.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No attendance records found</td>
                </tr>
              ) : (
                allAttendance.map((record) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllEmployeesAttendance;

