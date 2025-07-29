# TimeLeft - Connect with Others Through Meaningful Events

TimeLeft is a full-stack web application inspired by timeleft.com that allows users to create and join events with a unique twist - participant details are only revealed on the event date, encouraging genuine connections without preconceptions.

## Features

- **User Authentication**: Secure registration and login system
- **Event Management**: Create, join, and manage events
- **Icebreakers**: Add conversation starters to events
- **Reveal System**: Participant details are hidden until the event date
- **Admin Panel**: Approve/reject events and manage users
- **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email notifications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd time-left
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd backend
   npm install
   cd ..
   ```

4. Set up environment variables
   - Create a `.env` file in the `backend` directory with the following variables:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     NODE_ENV=development
     EMAIL_HOST=your_email_host
     EMAIL_PORT=your_email_port
     EMAIL_USERNAME=your_email_username
     EMAIL_PASSWORD=your_email_password
     EMAIL_FROM_NAME=TimeLeft
     EMAIL_FROM_ADDRESS=noreply@timeleft.com
     FRONTEND_URL=http://localhost:3000
     ```

5. Create a `.env` file in the root directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

In the project directory, you can run:

### `npm run dev`

Runs both the frontend and backend concurrently.
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

### `npm start`

Runs only the frontend in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run server`

Runs only the backend server using nodemon for auto-reloading.

### `npm run build`

Builds the frontend for production to the `build` folder.

## Project Structure

```
time-left/
├── backend/                # Backend code
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── index.js        # Express app setup
│   │   └── server.js       # Server entry point
│   ├── .env                # Backend environment variables
│   └── package.json        # Backend dependencies
├── public/                 # Static files
├── src/                    # Frontend code
│   ├── components/         # Reusable components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   ├── services/           # API service functions
│   ├── App.tsx             # Main app component
│   └── index.tsx           # Entry point
├── .env                    # Frontend environment variables
├── package.json            # Frontend dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## API Endpoints

### Authentication
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Events
- `POST /api/events` - Create a new event
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `PUT /api/events/:id/join` - Join an event
- `PUT /api/events/:id/leave` - Leave an event
- `PUT /api/events/:id/approve` - Approve an event (admin)
- `PUT /api/events/:id/reject` - Reject an event (admin)

### Icebreakers
- `POST /api/icebreakers` - Create a new icebreaker
- `GET /api/icebreakers` - Get all icebreakers
- `GET /api/icebreakers/:id` - Get icebreaker by ID
- `PUT /api/icebreakers/:id` - Update icebreaker
- `DELETE /api/icebreakers/:id` - Delete icebreaker
- `POST /api/events/:eventId/icebreakers` - Add icebreaker to event
- `DELETE /api/events/:eventId/icebreakers/:icebreakerId` - Remove icebreaker from event

## License

This project is licensed under the MIT License.
