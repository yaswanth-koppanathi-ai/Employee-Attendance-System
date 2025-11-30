const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_system');
    console.log('MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data');

    // Create Manager
    const manager = new User({
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'manager123',
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management'
    });
    await manager.save();
    console.log('Created manager: manager@example.com / manager123');

    // Create Employees
    const employees = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'employee123',
        employeeId: 'EMP001',
        department: 'Engineering'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'employee123',
        employeeId: 'EMP002',
        department: 'Engineering'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'employee123',
        employeeId: 'EMP003',
        department: 'Sales'
      },
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: 'employee123',
        employeeId: 'EMP004',
        department: 'Marketing'
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'employee123',
        employeeId: 'EMP005',
        department: 'Sales'
      }
    ];

    const createdEmployees = [];
    for (const emp of employees) {
      const user = new User(emp);
      await user.save();
      createdEmployees.push(user);
      console.log(`Created employee: ${emp.email} / employee123`);
    }

    // Create sample attendance records for the last 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      for (const employee of createdEmployees) {
        // Skip weekends randomly (70% chance of attendance on weekdays)
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const shouldHaveAttendance = !isWeekend && Math.random() > 0.3;

        if (shouldHaveAttendance) {
          const checkInTime = new Date(date);
          checkInTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

          const checkOutTime = new Date(checkInTime);
          checkOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

          let status = 'present';
          if (checkInTime.getHours() > 9 || (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0)) {
            status = 'late';
          }

          const attendance = new Attendance({
            userId: employee._id,
            date: date,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            status: status
          });

          await attendance.save();
        }
      }
    }

    console.log('Created sample attendance records for the last 30 days');
    console.log('\nSeed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Manager: manager@example.com / manager123');
    console.log('Employee: john@example.com / employee123');
    console.log('(All employees use password: employee123)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

