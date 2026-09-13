# Full-Stack MERN Event & Ticket Booking Portal

A beginner-friendly MERN machine-test project for a multi-vendor event and ticket booking portal.

## Features

### Customer
- Signup/login with JWT authentication
- Browse upcoming events
- Search by title, description or location
- Filter by category
- See remaining ticket count
- Book multiple tickets
- Automatic total amount calculation
- View My Bookings
- Logout

### Organizer
- Signup/login with JWT authentication
- Create events
- Future date validation
- Ticket price and capacity validation
- View created events
- View tickets sold
- View remaining tickets
- View total revenue
- View attendee list
- Logout

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Password hashing with bcrypt
- Role-based authorization
- Atomic ticket inventory update using a MongoDB transaction
- Search and category filters

## Project Structure

```text
Ticket Booking web App/
├── Client/
│   └── ticketbooking/
│       └── src/
│           ├── App.jsx
│           ├── App.css
│           ├── index.css
│           └── main.jsx
│
├── Server/
│   ├── db/
│   │   ├── index.js
│   │   └── Models/
│   │       ├── User.js
│   │       ├── Event.js
│   │       └── Booking.js
│   ├── middleware/
│   │   └── auth.js
│   ├── Routes/
│   │   ├── index.js
│   │   ├── user-route.js
│   │   ├── event-route.js
│   │   └── booking-route.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

## Requirements

- Node.js 20+ recommended
- MongoDB local installation OR MongoDB Atlas
- npm

## 1. Backend Setup

Open terminal:

```bash
cd Server
npm install
```

Create a `.env` file from `.env.example`:

```env
PORT=6000
MONGO_URI=mongodb://localhost:27017/ticket_bookingDB
JWT_SECRET=change_this_to_a_long_random_secret
```

Start backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:6000
```

API:

```text
http://localhost:6000/api
```

## Important: Booking Transactions

The booking API uses a MongoDB transaction so ticket reduction and booking creation are handled together. MongoDB transactions require a replica set or MongoDB Atlas.

For the easiest setup, use MongoDB Atlas for the database. If you use a local MongoDB server, run it as a replica set before testing the booking transaction.

## 2. Frontend Setup

Open another terminal:

```bash
cd Client/ticketbooking
npm install
```

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:6000/api
```

Start frontend:

```bash
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Public

```text
GET /api/events
GET /api/events/:id
```

Query examples:

```text
GET /api/events?category=Tech
GET /api/events?search=music
GET /api/events?category=Tech&search=conference
```

### Customer

```text
POST /api/events/:id/book
GET /api/bookings/my-bookings
```

Both require:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Organizer

```text
POST /api/events
GET /api/events/organizer/my-events
GET /api/events/:id/attendees
```

Both require an organizer JWT token.

## Test Flow

1. Create an ORGANIZER account.
2. Login as organizer.
3. Create an event.
4. Logout.
5. Create a CUSTOMER account.
6. Login as customer.
7. Find the event.
8. Book one or more tickets.
9. Open My Bookings.
10. Login again as organizer and check tickets sold, revenue and attendees.

## Deployment

### MongoDB Atlas

Create a free MongoDB Atlas cluster and use its connection string as `MONGO_URI`.

### Backend

Deploy the `Server` folder to Render, Koyeb or Railway.

Environment variables:

```text
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_secret
```

The backend start command is:

```bash
npm start
```

### Frontend

Deploy `Client/ticketbooking` to Vercel or Netlify.

Set:

```text
VITE_API_URL=https://your-backend-url/api
```

Then build with:

```bash
npm run build
```

## GitHub Safety

Do not commit `.env`, passwords, MongoDB connection strings, JWT secrets or `node_modules`.

Use the provided `.gitignore` files.

## Assessment Deliverables

Before submission, provide:

- Public GitHub repository URL
- Live frontend URL
- Live backend API base URL
- README.md
- Test credentials for organizer and customer
