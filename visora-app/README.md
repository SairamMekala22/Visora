# Visora Full-Stack Application

Complete authentication and dashboard system with black & white aesthetic.

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📁 Project Structure

```
visora-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── reviews.js
│   │   └── users.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🔑 Features

### Authentication
- ✅ User signup with password hashing
- ✅ User login with JWT token
- ✅ Protected dashboard route

### Dashboard
- ✅ User profile display
- ✅ User preferences management
- ✅ Add and view reviews
- ✅ Logout functionality
- ✅ Return to landing page

### Design
- ✅ Black & white aesthetic
- ✅ Clean borders and spacing
- ✅ Hover effects (invert colors)
- ✅ Fully responsive
- ✅ Tailwind CSS

## 🗄️ Database

MongoDB connection string in `backend/.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster0.fake.mongodb.net/visora
```

**Replace with your actual MongoDB credentials!**

## 📡 API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Reviews
- `POST /api/reviews/add` - Add review
- `GET /api/reviews/:userId` - Get user reviews

### Users
- `GET /api/users/preferences/:userId` - Get preferences
- `POST /api/users/preferences/update` - Update preferences

## 🎨 Design System

- **Colors**: Black (#000), White (#fff), Gray (#f5f5f5, #eaeaea)
- **Borders**: 1-2px solid black
- **Buttons**: White bg, black border, hover inverts
- **Fonts**: Inter, Poppins, Manrope
- **Spacing**: Clean and minimal

## 📝 Notes

- Backend uses fake MongoDB credentials - replace before production
- JWT token is placeholder ("fake-jwt-token")
- All routes return JSON responses
- CORS enabled for frontend communication
