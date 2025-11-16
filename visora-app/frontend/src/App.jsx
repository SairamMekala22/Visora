import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  // Check if user is logged in
  const isAuthenticated = () => {
    return localStorage.getItem('user') && localStorage.getItem('token')
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard if logged in, otherwise to login */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
        
        {/* Public routes - redirect to dashboard if already logged in */}
        <Route 
          path="/login" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        
        {/* Protected route - only accessible when logged in */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
