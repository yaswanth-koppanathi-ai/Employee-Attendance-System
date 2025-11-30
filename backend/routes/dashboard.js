const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, isManager } = require('../middleware/auth');

const router = express.Router();

// Helper function to get start and end of day
const getDayBounds = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @route   GET /api/dashboard/employee
// @desc    Get employee dashboard stats
// @access  Private (Employee)
router.get('/employee', auth, async (req, res) => {
  try {
    const today = new Date();
    const { start: todayStart, end: todayEnd } = getDayBounds(today);

    // Today's status
    const todayAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    // Current month stats
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const monthAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const present = monthAttendance.filter(a => a.status === 'present').length;
    const absent = monthAttendance.filter(a => a.status === 'absent').length;
    const late = monthAttendance.filter(a => a.status === 'late').length;
    const totalHours = monthAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    // Recent attendance (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo }
    })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      todayStatus: {
        checkedIn: !!todayAttendance?.checkInTime,
        checkedOut: !!todayAttendance?.checkOutTime,
        status: todayAttendance?.status || 'absent',
        checkInTime: todayAttendance?.checkInTime,
        checkOutTime: todayAttendance?.checkOutTime
      },
      monthSummary: {
        present,
        absent,
        late,
        totalHours: Math.round(totalHours * 100) / 100
      },
      recentAttendance: recentAttendance.map(a => ({
        date: a.date,
        status: a.status,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        totalHours: a.totalHours
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/manager
// @desc    Get manager dashboard stats
// @access  Private (Manager)
router.get('/manager', auth, isManager, async (req, res) => {
  try {
    const today = new Date();
    const { start: todayStart, end: todayEnd } = getDayBounds(today);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('userId', 'name employeeId department');

    const todayPresent = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const todayAbsent = totalEmployees - todayPresent;
    const lateArrivals = todayAttendance.filter(a => a.status === 'late').length;

    // Weekly attendance trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const weeklyAttendance = await Attendance.find({
      date: { $gte: sevenDaysAgo }
    });

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const { start, end } = getDayBounds(date);
      const dayRecords = weeklyAttendance.filter(a => {
        const recordDate = new Date(a.date);
        return recordDate >= start && recordDate <= end;
      });
      weeklyTrend.push({
        date: date.toISOString().split('T')[0],
        present: dayRecords.filter(a => a.status === 'present' || a.status === 'late').length,
        absent: totalEmployees - dayRecords.filter(a => a.status === 'present' || a.status === 'late').length
      });
    }

    // Department-wise attendance
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const monthAttendance = await Attendance.find({
      date: { $gte: monthStart, $lte: monthEnd }
    }).populate('userId', 'department');

    const departmentWise = {};
    monthAttendance.forEach(record => {
      const dept = record.userId?.department || 'Unknown';
      if (!departmentWise[dept]) {
        departmentWise[dept] = { present: 0, absent: 0, late: 0 };
      }
      if (record.status === 'present') departmentWise[dept].present++;
      else if (record.status === 'absent') departmentWise[dept].absent++;
      else if (record.status === 'late') departmentWise[dept].late++;
    });

    // Absent employees today
    const allEmployees = await User.find({ role: 'employee' });
    const absentEmployees = allEmployees
      .filter(emp => {
        const record = todayAttendance.find(a => a.userId._id.toString() === emp._id.toString());
        return !record || record.status === 'absent';
      })
      .map(emp => ({
        id: emp._id,
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department
      }));

    res.json({
      totalEmployees,
      todayAttendance: {
        present: todayPresent,
        absent: todayAbsent,
        lateArrivals
      },
      weeklyTrend,
      departmentWise,
      absentEmployees
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

