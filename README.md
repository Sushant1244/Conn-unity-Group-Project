# Conn-unity-Group-Project

A full-stack web application with React frontend and Node.js Express backend.

## Project Structure

```
Group Project Connunity/
├── frontend/          # React application
│   ├── public/        # Static files
│   ├── src/           # React components and code
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js Express server
│   ├── server.js      # Main server file
│   ├── .env           # Environment variables
│   └── package.json   # Backend dependencies
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

Dependencies have already been installed for both frontend and backend.

### Running the Application

#### Backend Server

1. Open a terminal and navigate to the backend folder:
```bash
cd backend
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

#### Frontend Application

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

## Environment Variables

Backend environment variables are configured in `backend/.env`:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

## Development

- Frontend code is in the `frontend/src` directory
- Backend code is in the `backend` directory
- Both servers support hot-reload during development

## Next Steps

- Add more components to the frontend
- Create additional API routes in the backend
- Set up a database connection
- Add authentication
- Implement your features

## License

ISC
