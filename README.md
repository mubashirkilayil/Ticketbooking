## Features

- Customer and Organizer roles with JWT authentication
- Browse, search and filter events
- Ticket booking with availability validation
- Customer booking history
- Organizer event creation and sales summary
- Attendee list for organizer events
- MongoDB Atlas database
- Responsive React frontend

## Tech Stack

**Frontend:** React, Vite, React Router, CSS
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
**Deployment:** Vercel, Render, MongoDB Atlas

## Live Demo

Frontend: [Add Vercel URL]

Backend API: https://ticketbooking-server-8djt.onrender.com

## Installation

```bash
# Backend
cd Server
npm install
npm run dev

# Frontend
cd Client/ticketbooking
npm install
npm run dev
```

Create a `.env` file in the backend with:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
```

For the frontend:

```env
VITE_API_URL=your_backend_url
```
