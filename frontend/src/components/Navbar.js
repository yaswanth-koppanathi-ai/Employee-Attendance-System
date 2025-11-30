import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate(user?.role === 'manager' ? '/manager/login' : '/employee/login');
  };

  const isManager = user?.role === 'manager';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isManager ? '/manager/dashboard' : '/employee/dashboard'} className="navbar-brand">
          Attendance System
        </Link>
        <div className="navbar-menu">
          {isManager ? (
            <>
              <Link to="/manager/dashboard">Dashboard</Link>
              <Link to="/manager/attendance">All Attendance</Link>
              <Link to="/manager/calendar">Calendar</Link>
              <Link to="/manager/reports">Reports</Link>
            </>
          ) : (
            <>
              <Link to="/employee/dashboard">Dashboard</Link>
              <Link to="/employee/mark-attendance">Mark Attendance</Link>
              <Link to="/employee/attendance-history">My History</Link>
              <Link to="/employee/profile">Profile</Link>
            </>
          )}
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

