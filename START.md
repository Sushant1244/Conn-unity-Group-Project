# Quick Start Guide

## Prerequisites
- Node.js installed (v16+)
- MongoDB running locally

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Start MongoDB
Make sure MongoDB is running on your system:
- Windows: MongoDB should be running as a service
- Mac/Linux: `mongod` or `brew services start mongodb-community`

## Step 3: Seed Database (Optional)
```bash
cd backend
npm run seed
```

This will create sample users, communities, posts, and polls.

## Step 4: Start Backend Server
```bash
cd backend
npm start
# or for development:
npm run dev
```

Backend will run on http://localhost:5000

## Step 5: Start Frontend Server
Open a new terminal:
```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000

## Step 6: Access the Application
Open your browser and go to: http://localhost:3000

## Test Accounts (if seeded)
- Email: tech@example.com, Password: password123
- Email: pixel@example.com, Password: password123
- Email: dev@example.com, Password: password123

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `backend/.env`
- Default: `mongodb://localhost:27017/connunity`

### Port Already in Use
- Backend: Change PORT in `backend/.env`
- Frontend: Change port in `frontend/vite.config.js`

### CORS Errors
- Backend CORS is configured for `localhost:3000`
- Update if using different ports

