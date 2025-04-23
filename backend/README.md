
# Car Rental & Ride Sharing Backend

This is the backend API for the Car Rental & Ride Sharing application.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a .env file based on .env.example
   ```
   cp .env.example .env
   ```
5. Edit the .env file with your configuration

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/upload/profile` - Upload profile picture
- `POST /api/auth/upload/license` - Upload driving license

### Cars

- `GET /api/cars` - Get all cars with filtering
- `GET /api/cars/:id` - Get single car by ID
- `POST /api/cars` - Add a new car (host only)
- `PUT /api/cars/:id` - Update a car (owner only)
- `DELETE /api/cars/:id` - Delete a car (owner only)

### Bookings

- `GET /api/bookings/my-bookings` - Get all bookings for current user
- `GET /api/bookings/my-car-bookings` - Get all bookings for cars owned by current user
- `POST /api/bookings` - Create a new booking
- `PATCH /api/bookings/:id/status` - Update booking status (host only)
- `PATCH /api/bookings/:id/payment` - Update payment status

### Ride Sharing

- `GET /api/rideshares` - Get all available ride shares
- `GET /api/rideshares/:id` - Get single ride share by ID
- `POST /api/rideshares` - Create a new ride share
- `POST /api/rideshares/:id/join` - Request to join a ride share
- `PATCH /api/rideshares/:id/passengers/:passengerId` - Update passenger status (driver only)
- `DELETE /api/rideshares/:id` - Cancel a ride share (driver only)
