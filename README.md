# Conn-unity - Social Community Platform

A full-stack social media platform inspired by Reddit, built with React and Node.js.

## Features

- 🔐 User Authentication (Register/Login)
- 👥 Community Management (Create, Join, Leave)
- 📝 Post Creation with Images
- 💬 Comments System
- ⬆️ Upvote/Downvote Posts and Comments
- 📊 Community Polls
- 🏷️ Mood Tags (Inspiring, Funny, Educational, etc.)
- 💾 Save Posts
- 📈 Popular Communities List
- 🏆 Daily Challenges
- 📱 Responsive Design

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- React Icons
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Software Development Project"
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up MongoDB:
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/connunity`
   - Or update the connection string in `backend/.env`

5. Configure environment variables:
   - Backend uses `.env` file (already created)
   - Default port: 5000
   - JWT Secret: Change in production!

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Communities
- `GET /api/communities` - Get all communities
- `GET /api/communities/:name` - Get single community
- `POST /api/communities` - Create community (protected)
- `POST /api/communities/:name/join` - Join community (protected)
- `POST /api/communities/:name/leave` - Leave community (protected)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Votes
- `POST /api/votes/post/:postId` - Vote on post (protected)
- `POST /api/votes/comment/:commentId` - Vote on comment (protected)
- `POST /api/votes/save/:postId` - Save/unsave post (protected)

### Polls
- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create poll (protected)
- `POST /api/polls/:id/vote` - Vote on poll (protected)

## Default Data

The application starts with an empty database. You can:

1. Register a new account through the UI
2. Create communities
3. Create posts
4. Create polls

## Project Structure

```
.
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── public/          # Static assets
└── README.md
```

## Development

### Backend Development
- Uses nodemon for auto-reload
- MongoDB connection with Mongoose
- JWT-based authentication
- RESTful API design

### Frontend Development
- Vite for fast development
- React hooks for state management
- Component-based architecture
- Responsive CSS design

## Production Build

### Build Frontend
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

### Serve Frontend
```bash
cd frontend
npm run preview
```

## Troubleshooting

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Default: `mongodb://localhost:27017/connunity`

2. **Port Already in Use**
   - Backend: Change PORT in `backend/.env`
   - Frontend: Change port in `frontend/vite.config.js`

3. **CORS Errors**
   - Backend CORS is configured for `localhost:3000`
   - Update if using different ports

## License

MIT License

## Author

Conn-unity Development Team

