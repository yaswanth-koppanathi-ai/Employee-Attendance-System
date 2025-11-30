import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/dashboard/manager`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return <div className="loading">Loading...</div>;
  }

  // Prepare department data for chart
  const departmentData = Object.entries(dashboardData.departmentWise).map(([dept, data]) => ({
    name: dept,
    present: data.present || 0,
    absent: data.absent || 0,
    late: data.late || 0
  }));

  return (
    <div className="container">
      <h1>Manager Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <div className="stat-value">{dashboardData.totalEmployees}</div>
        </div>
        <div className="stat-card success">
          <h3>Today Present</h3>
          <div className="stat-value">{dashboardData.todayAttendance.present}</div>
        </div>
        <div className="stat-card danger">
          <h3>Today Absent</h3>
          <div className="stat-value">{dashboardData.todayAttendance.absent}</div>
        </div>
        <div className="stat-card warning">
          <h3>Late Arrivals</h3>
          <div className="stat-value">{dashboardData.todayAttendance.lateArrivals}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#28a745" name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#dc3545" name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Department-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#28a745" name="Present" />
              <Bar dataKey="absent" fill="#dc3545" name="Absent" />
              <Bar dataKey="late" fill="#ffc107" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Absent Employees Today</h3>
        {dashboardData.absentEmployees.length === 0 ? (
          <p className="success">All employees are present today!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.absentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;

