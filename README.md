# Employee Attendance System

A full-stack employee attendance tracking system with role-based access control for employees and managers.

**Author:** Yaswanth  
**Institution:** Mohan Babu University

## Tech Stack

- **Frontend**: React + Redux Toolkit
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Features

### Employee Features
-  Register/Login
-  Mark attendance (Check In / Check Out)
-  View attendance history (calendar or table view)
-  View monthly summary (Present/Absent/Late days)
-  Dashboard with stats

### Manager Features
-  Login
-  View all employees attendance
-  Filter by employee, date, status
-  View team attendance summary
-  Export attendance reports (CSV)
-  Dashboard with team stats and charts
-  Team calendar view

## Project Structure

```
employee-attendance-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Employee/
│   │   │   └── Manager/
│   │   ├── store/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employee-attendance-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   Or install separately:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/attendance_system
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

   **How to get MongoDB URL:**
   
   **Option 1: Local MongoDB (Recommended for Development)**
   - Install MongoDB Community Server from [mongodb.com/download](https://www.mongodb.com/try/download/community)
   - After installation, MongoDB runs on `mongodb://localhost:27017`
   - Use: `MONGODB_URI=mongodb://localhost:27017/attendance_system`
   
   **Option 2: MongoDB Atlas (Cloud - Free Tier Available)**
   1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   2. Sign up for a free account
   3. Create a new cluster (choose FREE tier)
   4. Click "Connect" → "Connect your application"
   5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   6. Replace `<password>` with your database user password
   7. Add database name at the end: `/attendance_system`
   8. Example: `MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/attendance_system`
   9. **Important:** Add your IP address to the Network Access whitelist (or use 0.0.0.0/0 for all IPs in development)

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   ```
   
   This will create:
   - 1 Manager account: `manager@example.com` / `manager123`
   - 5 Employee accounts: `john@example.com`, `jane@example.com`, etc. / `employee123`
   - Sample attendance records for the last 30 days

6. **Run the application**

   **Option 1: Run both backend and frontend together**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration (default: 7d)
- `NODE_ENV` - Environment (development/production)

### Frontend
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new employee
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance/my-history` - Get my attendance history
- `GET /api/attendance/my-summary` - Get monthly summary

### Attendance (Manager)
- `GET /api/attendance/all` - Get all employees attendance
- `GET /api/attendance/employee/:id` - Get specific employee attendance
- `GET /api/attendance/summary` - Get team summary
- `GET /api/attendance/export` - Export CSV
- `GET /api/attendance/today-status` - Get today's status for all employees

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard stats
- `GET /api/dashboard/manager` - Manager dashboard stats

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('employee' | 'manager'),
  employeeId: String (unique),
  department: String,
  createdAt: Date
}
```

### Attendance Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: String ('present' | 'absent' | 'late' | 'half-day'),
  totalHours: Number,
  createdAt: Date
}
```

## Default Login Credentials

After running the seed script:

**Manager:**
- Email: `manager@example.com`
- Password: `manager123`

**Employees:**
- Email: `john@example.com`, `jane@example.com`, `bob@example.com`, etc.
- Password: `employee123` (for all employees)

## Screenshots

### Employee Dashboard
- Today's attendance status
- Monthly summary (Present/Absent/Late)
- Recent attendance history
- Quick check in/out buttons

### Manager Dashboard
- Total employees count
- Today's attendance overview
- Weekly attendance trend chart
- Department-wise attendance chart
- List of absent employees

### Attendance History
- Calendar view with color coding
- Table view with filters
- Monthly summary statistics

### Reports
- Filter by date range and employee
- Export to CSV functionality
- Detailed attendance table

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Runs on http://localhost:3000
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

The build folder will contain the production-ready static files.

## Deployment

**Quick Start:** See [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) for step-by-step Vercel deployment guide.

**Quick Deploy Steps:**
1. **Backend:** Deploy to [Render](https://render.com) (free) - Root directory: `backend`
2. **Frontend:** Deploy to [Vercel](https://vercel.com) (free) - Root directory: `frontend`
3. **Database:** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)

**Important:** Deploy backend first, then set `REACT_APP_API_URL` in Vercel to point to your backend URL.

For detailed deployment options, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Deployment

**Quick Start:** See [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) for step-by-step Vercel deployment guide.

**Quick Deploy Steps:**
1. **Backend:** Deploy to [Render](https://render.com) (free) - Root directory: `backend`
2. **Frontend:** Deploy to [Vercel](https://vercel.com) (free) - Root directory: `frontend`
3. **Database:** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)

**Important:** Deploy backend first, then set `REACT_APP_API_URL` in Vercel to point to your backend URL.

## Troubleshooting

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity for MongoDB Atlas

2. **Port Already in Use**
   - Change PORT in .env file
   - Or kill the process using the port

3. **CORS Errors**
   - Ensure backend CORS is configured
   - Check REACT_APP_API_URL in frontend
   - For production, set FRONTEND_URL environment variable

4. **JWT Token Errors**
   - Clear localStorage in browser
   - Re-login to get new token

5. **404 Error on Vercel**
   - **Most Common:** Backend is not deployed! Deploy backend first on Render/Railway
   - Check `REACT_APP_API_URL` environment variable in Vercel
   - Ensure backend URL is accessible (test: `https://your-backend-url/api/health`)
   - See [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) for step-by-step guide

## License

ISC

## Author

**Yaswanth**  
Mohan Babu University

