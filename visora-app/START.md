# 🚀 Quick Start Guide

## Step 1: Install Backend Dependencies

```bash
cd visora-app/backend
npm install
```

## Step 2: Install Frontend Dependencies

```bash
cd visora-app/frontend
npm install
```

## Step 3: Start Backend Server

```bash
cd visora-app/backend
node server.js
```

You should see:
```
Server running on port 5000
MongoDB connected...
```

## Step 4: Start Frontend (in a new terminal)

```bash
cd visora-app/frontend
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms
➜  Local:   http://localhost:3000/
```

## Step 5: Open Browser

Navigate to: `http://localhost:3000`

## 🎯 Test the App

1. **Signup**: Create a new account at `/signup`
2. **Login**: Login with your credentials at `/login`
3. **Dashboard**: View your dashboard with preferences and reviews

## ⚠️ Important

Before production, replace MongoDB credentials in `backend/.env`:
```
MONGO_URI=your_actual_mongodb_connection_string
```

## 🎨 Pages

- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - User dashboard (protected)

Enjoy your Visora app! 🎉
