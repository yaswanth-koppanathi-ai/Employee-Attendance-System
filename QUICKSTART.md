# Quick Start Guide

## Quick Setup (5 minutes)

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Set up MongoDB**
   - Install MongoDB locally, OR
   - Use MongoDB Atlas (free tier available)
   - Update `backend/.env` with your MongoDB connection string

3. **Create backend/.env file**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/attendance_system
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Seed the database** (creates sample users and data)
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Access the app**
   - Open http://localhost:3000
   - Login as Manager: `manager@example.com` / `manager123`
   - Login as Employee: `john@example.com` / `employee123`

## Common Commands

```bash
# Install all dependencies
npm run install-all

# Run both backend and frontend
npm run dev

# Run backend only
cd backend && npm run dev

# Run frontend only
cd frontend && npm start

# Seed database
cd backend && npm run seed
```

## Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running: `mongod`
- Check your MONGODB_URI in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

**Port already in use?**
- Change PORT in `backend/.env`
- Or kill the process: `lsof -ti:5000 | xargs kill` (Mac/Linux)

**CORS errors?**
- Backend CORS is already configured
- Make sure backend is running on port 5000

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the application for your needs
- Deploy to production (see README for production build instructions)

